// src/services/geminiAdvisor.js

export function getAiMode() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isValid = apiKey && 
                  apiKey.trim() !== '' && 
                  !apiKey.includes('<') && 
                  !apiKey.includes('your_') && 
                  apiKey.length > 10;
  return {
    mode: isValid ? 'live' : 'local'
  };
}

export function getLocalFallback(transaction) {
  const {
    childAge = 10,
    amount = 0,
    merchant = 'App Store',
    category = 'In-App',
    riskScore = 0,
    riskLevel = 'Low',
    reasons = [],
    recommendation = 'Approve Normally',
    purchaseCountToday = 0,
    weeklySpend = 0
  } = transaction;

  let summary = '';
  const concerns = [];

  // Generate dynamic, natural explanation based on risk triggers
  if (riskScore >= 75) {
    let riskFactorText = '';
    const items = [];
    if (reasons.some(r => r.toLowerCase().includes('amount') || r.toLowerCase().includes('higher') || r.toLowerCase().includes('spending'))) {
      items.push('the amount exceeds typical spending patterns');
      concerns.push('High transaction amount');
    }
    if (reasons.some(r => r.toLowerCase().includes('daily') || r.toLowerCase().includes('frequency') || r.toLowerCase().includes('today') || r.toLowerCase().includes('multiple') || r.toLowerCase().includes('purchases'))) {
      items.push('multiple purchases have already been detected today');
      concerns.push('Elevated purchase frequency');
    }
    if (reasons.some(r => r.toLowerCase().includes('night') || r.toLowerCase().includes('time') || r.toLowerCase().includes('late'))) {
      items.push('the transaction is occurring late at night');
      concerns.push('Late-night transaction window');
    }
    if (reasons.some(r => r.toLowerCase().includes('age'))) {
      items.push("it deviates from the standard parameters for their age group");
      concerns.push('Age limit restriction');
    }
    if (reasons.some(r => r.toLowerCase().includes('unverified') || r.toLowerCase().includes('unknown') || r.toLowerCase().includes('merchant'))) {
      items.push('the merchant is unverified');
      concerns.push('Unverified Merchant');
    }

    if (items.length > 0) {
      if (items.length === 1) {
        riskFactorText = items[0];
      } else if (items.length === 2) {
        riskFactorText = `${items[0]} and ${items[1]}`;
      } else {
        const last = items.pop();
        riskFactorText = `${items.join(', ')}, and ${last}`;
      }
    }

    if (!riskFactorText) {
      riskFactorText = 'it triggered several high-risk telemetry markers';
    }

    summary = `This transaction was classified as high risk because ${riskFactorText}. We recommend validating the request context.`;
  } else if (riskScore >= 40) {
    let riskFactorText = '';
    const items = [];
    if (reasons.some(r => r.toLowerCase().includes('amount') || r.toLowerCase().includes('higher') || r.toLowerCase().includes('spending'))) {
      items.push('spending is slightly above the daily norm');
      concerns.push('Elevated spending amount');
    }
    if (reasons.some(r => r.toLowerCase().includes('frequency') || r.toLowerCase().includes('today') || r.toLowerCase().includes('multiple') || r.toLowerCase().includes('purchases'))) {
      items.push('this is the child\'s second purchase request today');
      concerns.push('Multiple purchases today');
    }
    if (reasons.some(r => r.toLowerCase().includes('category') || r.toLowerCase().includes('in-app') || r.toLowerCase().includes('gaming') || r.toLowerCase().includes('subscription'))) {
      items.push('the category carries a moderate risk of unauthorized spending');
      concerns.push('Gaming / In-App purchase category');
    }

    if (items.length > 0) {
      if (items.length === 1) {
        riskFactorText = items[0];
      } else {
        riskFactorText = `${items[0]} and ${items[1]}`;
      }
    }

    if (!riskFactorText) {
      riskFactorText = 'of moderate activity on the child\'s profile';
    }

    summary = `This transaction is flagged as medium risk because ${riskFactorText}. Verify the purchase with your child.`;
  } else {
    summary = `This transaction appears routine and matches the child's typical spending patterns. No major anomalies were detected.`;
    concerns.push('Low-risk category');
  }

  // Fallback concerns fill
  if (concerns.length === 0) {
    if (category.toLowerCase().includes('in-app') || category.toLowerCase().includes('gaming')) {
      concerns.push('Gaming / In-App category');
    } else {
      concerns.push('Standard purchase');
    }
  }

  // Ensure concerns has up to 3 elements
  if (reasons.length > 0 && concerns.length < 3) {
    reasons.forEach(r => {
      const cleanR = r.replace(/\.$/, '');
      if (concerns.length < 3 && !concerns.some(c => c.toLowerCase() === cleanR.toLowerCase())) {
        concerns.push(cleanR);
      }
    });
  }

  const confidence = Math.max(75, Math.min(99, Math.round(80 + (riskScore * 0.15))));

  return {
    summary,
    concerns: concerns.slice(0, 3),
    recommendation: recommendation || 'Require Parent OTP',
    confidence
  };
}

export async function generateTransactionAnalysis(transaction) {
  const { mode } = getAiMode();
  if (mode === 'local') {
    // Immediate local response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalFallback(transaction));
      }, 500); // short delay to show loading animation
    });
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are "AI Guardian", a security parent advisor inside the SecurePlay youth payment ecosystem.
Your job is to analyze transaction data for a child and generate a helpful natural-language risk assessment and recommendations for the parent.

Input Transaction JSON:
${JSON.stringify(transaction, null, 2)}

You MUST respond with a JSON object in this exact format (do not wrap in markdown code blocks, do not output any other text, just the raw JSON):
{
  "summary": "Provide a natural-language description (2-3 sentences) detailing why this is low/medium/high risk. Focus on explaining childAge, amount relative to weeklySpend, purchaseCountToday, category risk, and reasons.",
  "concerns": [
    "Short concern 1 (e.g. 'High transaction amount')",
    "Short concern 2 (e.g. 'Gaming category')",
    "Short concern 3 (e.g. 'Elevated purchase frequency')"
  ],
  "recommendation": "The recommended security protocol (e.g. 'Require Face Verification + Parent OTP', 'Require Parent OTP', or 'Approve Normally')",
  "confidence": 92
}

Analyze carefully, maintain a professional, protective but reassuring tone, and output ONLY valid JSON.`;

  // We set a timeout of 4.5 seconds to hit under 5s requirements
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      summary: parsed.summary || 'Transaction review completed.',
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns.slice(0, 3) : [],
      recommendation: parsed.recommendation || transaction.recommendation,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 90
    };

  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Gemini Advisor service failed or timed out. Falling back to Local Engine:', error);
    return getLocalFallback(transaction);
  }
}
