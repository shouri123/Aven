export interface RiskAnalysis {
  isCrisis: boolean;
  severity: number;
  riskSignals: string[];
  actionPlan: string;
}

export function evaluateRisk(text: string): RiskAnalysis {
  const lowerText = text.toLowerCase();
  
  // Severe Distress keywords
  const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'give up', "don't want to live", 'hopeless', 'end it', 'want to die'];
  
  const isCrisis = crisisKeywords.some(keyword => lowerText.includes(keyword));
  
  if (isCrisis) {
    return {
      isCrisis: true,
      severity: 5,
      riskSignals: ['Suicidal Ideation / Severe Distress Detected by Risk Agent'],
      actionPlan: "OVERRIDE_TO_CRISIS_MODE"
    };
  }

  return {
    isCrisis: false,
    severity: 0,
    riskSignals: [],
    actionPlan: "PROCEED"
  };
}
