// ===== AVEN CRISIS DETECTION ENGINE =====
// Client-side safety net. Runs BEFORE the API call.

export type CrisisLevel = 'none' | 'monitoring' | 'alert' | 'critical';

export interface CrisisResult {
  level: CrisisLevel;
  triggered: boolean;
  matchedPhrases: string[];
  message: string;
  action: string;
}

// Phrases indicating potential crisis — grouped by severity
const CRITICAL_PHRASES = [
  'want to die', 'kill myself', 'end my life', 'suicide', 'suicidal',
  'no reason to live', 'better off dead', 'end it all', 'take my life',
  'want to disappear forever', 'not worth living', 'planning to end',
  'goodbye forever', 'final goodbye', 'this is my last',
];

const ALERT_PHRASES = [
  'self harm', 'self-harm', 'cutting myself', 'hurting myself',
  'can\'t go on', 'give up on life', 'hopeless', 'no hope',
  'nothing matters', 'nobody cares', 'don\'t want to exist',
  'wish i was dead', 'wish i wasn\'t born', 'can\'t take it anymore',
  'unbearable pain', 'no way out', 'trapped forever',
];

const MONITORING_PHRASES = [
  'give up', 'can\'t cope', 'falling apart', 'breaking down',
  'can\'t handle', 'overwhelming pain', 'deeply sad', 'extreme sadness',
  'worthless', 'useless', 'burden to everyone', 'nobody understands',
  'completely alone', 'dark place', 'rock bottom',
];

export function detectCrisis(text: string, consecutiveNegative: number = 0, avgSeverity: number = 0): CrisisResult {
  const lower = text.toLowerCase().trim();

  // Check critical phrases
  const criticalMatches = CRITICAL_PHRASES.filter(p => lower.includes(p));
  if (criticalMatches.length > 0) {
    return {
      level: 'critical',
      triggered: true,
      matchedPhrases: criticalMatches,
      message: 'I hear you, and I want you to know that your life matters deeply. You don\'t have to face this alone. Please reach out to someone who can help right now.',
      action: 'SHOW_CRISIS_RESOURCES',
    };
  }

  // Check alert phrases
  const alertMatches = ALERT_PHRASES.filter(p => lower.includes(p));
  if (alertMatches.length > 0) {
    return {
      level: 'alert',
      triggered: true,
      matchedPhrases: alertMatches,
      message: 'It sounds like you\'re going through something really painful. Your feelings are valid, and support is available whenever you need it.',
      action: 'SHOW_SUPPORT_OPTIONS',
    };
  }

  // Check monitoring phrases
  const monitoringMatches = MONITORING_PHRASES.filter(p => lower.includes(p));
  if (monitoringMatches.length > 0 || (consecutiveNegative >= 4 && avgSeverity >= 3.5)) {
    return {
      level: 'monitoring',
      triggered: true,
      matchedPhrases: monitoringMatches,
      message: 'I notice you\'ve been carrying a lot. It takes strength to express what you\'re feeling. I\'m here with you.',
      action: 'GENTLE_CHECKIN',
    };
  }

  return {
    level: 'none',
    triggered: false,
    matchedPhrases: [],
    message: '',
    action: '',
  };
}

export const CRISIS_RESOURCES = [
  { name: 'iCall', description: 'Professional Counseling', phone: '9152987821', available: 'Mon-Sat, 8am-10pm' },
  { name: 'Vandrevala Foundation', description: '24/7 Crisis Support', phone: '9999666555', available: '24/7' },
  { name: 'AASRA', description: 'Crisis Intervention', phone: '9820466726', available: '24/7' },
  { name: 'Emergency Services', description: 'Immediate Help', phone: '112', available: '24/7' },
];
