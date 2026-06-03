export function calculateRisk({
  age,
  purchaseAmount,
  purchaseCountToday,
  weeklySpend,
  purchaseTime,
  merchantCategory
}) {
  let score = 0;
  const reasons = [];
  const metrics = {
    amountRisk: 0,
    frequencyRisk: 0,
    timeRisk: 0,
    categoryRisk: 0,
    ageRisk: 0
  };

  // 1. Amount Risk
  // Determine if it's abnormally large compared to weekly spend.
  // Using a fallback if weeklySpend is 0 to avoid division by zero.
  const baseline = weeklySpend > 0 ? weeklySpend : 1000;
  if (purchaseAmount > baseline * 0.5) {
    metrics.amountRisk = 30;
    score += 30;
    reasons.push("Purchase amount is significantly higher than normal spending.");
  } else if (purchaseAmount > baseline * 0.2) {
    metrics.amountRisk = 15;
    score += 15;
    reasons.push("Purchase amount is higher than normal.");
  }

  // 2. Frequency Risk
  if (purchaseCountToday >= 3) {
    metrics.frequencyRisk = 25;
    score += 25;
    reasons.push("Excessive daily purchase count (3+ purchases today).");
  } else if (purchaseCountToday === 2) {
    metrics.frequencyRisk = 10;
    score += 10;
    reasons.push("Multiple purchases detected today.");
  }

  // 3. Time Risk
  if (purchaseTime) {
    const timeMatch = purchaseTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1], 10);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;

      if (hour >= 22 || hour < 6) {
        metrics.timeRisk = 20;
        score += 20;
        reasons.push("Transaction occurred late at night.");
      }
    }
  }

  // 4. Age Risk
  if (age < 13 && purchaseAmount > baseline * 0.2) {
    metrics.ageRisk = 15;
    score += 15;
    reasons.push("Purchase behavior flagged based on user's age group.");
  }

  // 5. Merchant Category Risk
  const cat = merchantCategory ? merchantCategory.toLowerCase() : "";
  if (cat.includes("education") || cat.includes("books") || cat.includes("groceries")) {
    metrics.categoryRisk = -10;
    score = Math.max(0, score - 10);
    reasons.push("Merchant category is considered low risk.");
  } else if (cat.includes("in-app") || cat.includes("cosmetics")) {
    metrics.categoryRisk = 25;
    score += 25;
    reasons.push("In-App purchases carry a high risk of unauthorized spending.");
  } else if (cat.includes("gaming") || cat.includes("subscriptions") || cat.includes("game content")) {
    metrics.categoryRisk = 15;
    score += 15;
    reasons.push("Gaming and subscription services carry moderate risk.");
  } else if (cat.includes("unknown") || cat.includes("unverified")) {
    metrics.categoryRisk = 30;
    score += 30;
    reasons.push("Merchant is unverified or unknown.");
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine Level and Recommendation
  let level = "Low";
  let recommendation = "Approve Normally";

  if (score >= 75) {
    level = "High";
    recommendation = "Require Face Verification + Parent OTP";
  } else if (score >= 40) {
    level = "Medium";
    recommendation = "Require Parent OTP";
  }

  // Normalize metrics to be percentages (0-100 scale individually) for UI display purposes
  const normalize = (val, max) => Math.min(100, Math.max(0, Math.round((val / max) * 100)));
  const normalizedMetrics = {
    amountRisk: normalize(metrics.amountRisk, 30),
    frequencyRisk: normalize(metrics.frequencyRisk, 25),
    timeRisk: normalize(metrics.timeRisk, 20),
    categoryRisk: normalize(Math.max(0, metrics.categoryRisk), 30),
    ageRisk: normalize(metrics.ageRisk, 15)
  };

  // If no reasons generated, add a default safe one.
  if (reasons.length === 0) {
    reasons.push("Transaction matches standard safe spending patterns.");
  }

  return {
    score,
    level,
    reasons,
    recommendation,
    metrics: normalizedMetrics
  };
}
