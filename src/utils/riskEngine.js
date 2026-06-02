/**
 * SecurePlay AI Risk Engine
 * Calculates multidimensional risk indicators for game transactions.
 */

export function calculateRiskScore(transaction, childProfile) {
  const { amount, time, ageRating, gameName } = transaction;
  const childAge = childProfile.age;
  const avgSpending = childProfile.avgSpending || 12.00;
  const transactionsTodayCount = childProfile.transactionsTodayCount || 0;

  // 1. Amount Risk (0 - 100)
  // Higher ratio to average spending -> higher risk
  const amountRatio = amount / avgSpending;
  let amountRisk = 0;
  if (amountRatio > 1) {
    amountRisk = Math.min(100, Math.round((amountRatio - 1) * 15 + 10));
  } else {
    amountRisk = Math.round((amount / avgSpending) * 10);
  }

  // 2. Time-of-Day Risk (0 - 100)
  // Late night (11 PM to 5 AM) is highly risky
  let timeRisk = 0;
  const hour = parseInt(time.split(':')[0], 10);
  const isAM = time.toLowerCase().includes('am') || time.toLowerCase().includes('pm') === false; // assume 24h if no am/pm
  const isPM = time.toLowerCase().includes('pm');
  
  let hour24 = hour;
  if (isPM && hour !== 12) hour24 += 12;
  if (isAM && hour === 12) hour24 = 0;

  if (hour24 >= 23 || hour24 < 5) {
    // Late night
    timeRisk = 90;
  } else if (hour24 >= 21 || hour24 < 7) {
    // Evening/Early morning
    timeRisk = 40;
  } else {
    timeRisk = 5;
  }

  // 3. Frequency Risk (0 - 100)
  // More than 2 transactions in a day triggers high risk
  let frequencyRisk = 0;
  if (transactionsTodayCount >= 3) {
    frequencyRisk = 95;
  } else if (transactionsTodayCount === 2) {
    frequencyRisk = 60;
  } else if (transactionsTodayCount === 1) {
    frequencyRisk = 30;
  } else {
    frequencyRisk = 5;
  }

  // 4. Age Risk (0 - 100)
  // Compare age rating (e.g. 17 for M, 10 for E10+, 13 for T) with child's actual age
  let ageRisk = 0;
  const ratingMap = { 'E': 0, 'E10+': 10, 'T': 13, 'M': 17, 'A': 18 };
  const targetRatingAge = ratingMap[ageRating] || 0;
  
  if (childAge < targetRatingAge) {
    const ageDiff = targetRatingAge - childAge;
    ageRisk = Math.min(100, ageDiff * 25);
  } else {
    ageRisk = 0;
  }

  // Calculate composite risk score (weighted average)
  // Weights: Amount (40%), Time (20%), Frequency (25%), Age (15%)
  const compositeScore = Math.round(
    (amountRisk * 0.40) +
    (timeRisk * 0.20) +
    (frequencyRisk * 0.25) +
    (ageRisk * 0.15)
  );

  return {
    score: Math.min(100, Math.max(0, compositeScore)),
    metrics: {
      amountRisk,
      timeRisk,
      frequencyRisk,
      ageRisk
    },
    ratios: {
      amountRatio: parseFloat(amountRatio.toFixed(1)),
      transactionsTodayCount,
      ageDiff: Math.max(0, targetRatingAge - childAge),
      targetRatingAge
    }
  };
}

/**
 * Generates the natural language explanation for parents.
 * Integrates optional real Gemini API call, or resolves locally using smart templates.
 */
export async function generateAIExplanation(transaction, childProfile, apiKey = null) {
  const riskAnalysis = calculateRiskScore(transaction, childProfile);
  const { score, metrics, ratios } = riskAnalysis;
  const childName = childProfile.name;

  // If API Key is provided, call real Gemini API
  if (apiKey) {
    try {
      const prompt = `Analyze this child gaming transaction and write a concise, one or two-sentence natural language warning for parents. Explain why it is risky or safe.
      Child Name: ${childName}
      Child Age: ${childAge}
      Transaction Game: ${transaction.gameName}
      Transaction Cost: $${transaction.amount}
      Average Purchase Cost: $${childProfile.avgSpending}
      Transaction Time: ${transaction.time}
      Daily transaction count before this: ${ratios.transactionsTodayCount}
      Game Age Rating: ${transaction.ageRating}
      Calculated Risk Score: ${score}/100
      Provide only the final sentence explanation. Be direct, premium, and concise.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (e) {
      console.warn("Failed fetching explanation from Gemini API, falling back to local engine.", e);
    }
  }

  // Local Smart AI explanation builder (highly descriptive templates matching rules)
  const triggers = [];
  
  if (metrics.amountRisk > 50) {
    triggers.push(`is ${ratios.amountRatio}x larger than ${childName}'s average purchase ($${childProfile.avgSpending.toFixed(2)})`);
  }
  
  if (metrics.timeRisk > 50) {
    triggers.push(`occurred late at night (${transaction.time})`);
  }

  if (metrics.frequencyRisk > 50) {
    triggers.push(`is the ${ratios.transactionsTodayCount + 1}rd purchase request today`);
  }

  if (metrics.ageRisk > 0) {
    triggers.push(`is for "${transaction.gameName}" which is rated ${transaction.ageRating} (Leo is only ${childProfile.age})`);
  }

  // Construct sentences based on factors triggered
  if (triggers.length === 0) {
    return `This purchase aligns with ${childName}'s standard spending behavior and occurs within active hours. Low risk detected.`;
  }

  let text = `This purchase `;
  if (triggers.length === 1) {
    text += triggers[0];
  } else if (triggers.length === 2) {
    text += `${triggers[0]} and ${triggers[1]}`;
  } else {
    const last = triggers.pop();
    text += `${triggers.join(', ')}, and ${last}`;
  }

  // Add recommendation based on final score
  if (score >= 75) {
    text += `. Parent approval is strongly recommended due to extreme deviations.`;
  } else if (score >= 40) {
    text += `. Parent approval is recommended for confirmation.`;
  } else {
    text += `. Standard behavior, but flagged for minor profile deviations.`;
  }

  return text;
}
