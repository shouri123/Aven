// ===== AVEN EMOTIONAL PATTERN DETECTOR =====
// Local logic — no API calls. Detects burnout, anxiety, loneliness, sleep, motivation patterns.

import { UserMemory } from './memory-system';

export interface DetectedPattern {
  id: string;
  label: string;
  description: string;
  confidence: number; // 0-100
  severity: 'low' | 'moderate' | 'high';
  icon: string; // emoji
}

export function detectPatterns(memory: UserMemory): DetectedPattern[] {
  if (!memory || memory.totalEntries < 2) return [];
  
  const patterns: DetectedPattern[] = [];
  const recent5 = memory.emotionHistory.slice(-5);
  const recent3 = memory.emotionHistory.slice(-3);
  const freq = memory.signalFrequency;

  // 1. BURNOUT DETECTION
  // stress ↑ + sleep/energy mentions + high severity over 3+ entries
  const stressCount = (freq['stress'] || 0) + (freq['overwhelm'] || 0) + (freq['exhaustion'] || 0);
  const sleepIssues = (freq['sleep issues'] || 0) + (freq['insomnia'] || 0) + (freq['fatigue'] || 0);
  const avgSev3 = memory.avgSeverity3;
  if (stressCount >= 2 && avgSev3 >= 3) {
    const burnoutConf = Math.min(95, 40 + stressCount * 12 + (sleepIssues * 10) + (avgSev3 > 3.5 ? 15 : 0));
    patterns.push({
      id: 'burnout',
      label: 'Possible Burnout',
      description: `Stress detected ${stressCount} times with average severity ${avgSev3.toFixed(1)}/5 over recent entries. ${sleepIssues > 0 ? 'Sleep disruption also noted.' : ''}`,
      confidence: burnoutConf,
      severity: avgSev3 >= 4 ? 'high' : 'moderate',
      icon: 'Flame',
    });
  }

  // 2. ANXIETY TREND
  const anxietyCount = (freq['anxiety'] || 0) + (freq['worry'] || 0) + (freq['panic'] || 0) + (freq['nervousness'] || 0);
  if (anxietyCount >= 2) {
    const anxConf = Math.min(90, 35 + anxietyCount * 15);
    patterns.push({
      id: 'anxiety_trend',
      label: 'Anxiety Trend',
      description: `Anxiety-related signals detected ${anxietyCount} times across your entries.`,
      confidence: anxConf,
      severity: anxietyCount >= 4 ? 'high' : 'moderate',
      icon: 'CloudRain',
    });
  }

  // 3. LONELINESS PATTERN
  const lonelyCount = (freq['loneliness'] || 0) + (freq['isolation'] || 0) + (freq['disconnection'] || 0);
  const negativeStreak = memory.consecutiveNegative;
  if (lonelyCount >= 2 || (lonelyCount >= 1 && negativeStreak >= 2)) {
    patterns.push({
      id: 'loneliness',
      label: 'Loneliness Pattern',
      description: `Feelings of loneliness or disconnection noted ${lonelyCount} times. ${negativeStreak >= 2 ? `Currently on a ${negativeStreak}-entry negative streak.` : ''}`,
      confidence: Math.min(85, 30 + lonelyCount * 20 + negativeStreak * 5),
      severity: lonelyCount >= 3 ? 'high' : 'moderate',
      icon: 'Heart',
    });
  }

  // 4. MOTIVATION DECLINE
  const recent5Positive = recent5.filter(e => e.sentiment === 'positive').length;
  const recent5Severity = recent5.reduce((s, e) => s + e.severity, 0) / Math.max(recent5.length, 1);
  if (recent5Positive <= 1 && recent5Severity >= 3 && memory.totalEntries >= 4) {
    patterns.push({
      id: 'motivation_decline',
      label: 'Motivation Decline',
      description: `Only ${recent5Positive} of last ${recent5.length} entries were positive. Average severity: ${recent5Severity.toFixed(1)}/5.`,
      confidence: Math.min(80, 40 + (5 - recent5Positive) * 10),
      severity: recent5Severity >= 4 ? 'high' : 'moderate',
      icon: 'TrendingDown',
    });
  }

  // 5. SLEEP DISRUPTION
  const lateNightRatio = memory.totalEntries > 0 ? memory.lateNightCount / memory.totalEntries : 0;
  const sleepSignals = (freq['sleep issues'] || 0) + (freq['insomnia'] || 0) + (freq['tired'] || 0) + (freq['fatigue'] || 0);
  if (lateNightRatio >= 0.3 || sleepSignals >= 2) {
    patterns.push({
      id: 'sleep_disruption',
      label: 'Sleep Disruption',
      description: `${memory.lateNightCount} late-night entries (${(lateNightRatio * 100).toFixed(0)}% of total). ${sleepSignals > 0 ? `Sleep-related signals detected ${sleepSignals} times.` : ''}`,
      confidence: Math.min(85, 30 + memory.lateNightCount * 15 + sleepSignals * 10),
      severity: lateNightRatio >= 0.5 ? 'high' : 'moderate',
      icon: 'Moon',
    });
  }

  // 6. POSITIVE GROWTH (if improving)
  if (memory.totalEntries >= 5) {
    const older = memory.emotionHistory.slice(-7, -3);
    const newer = recent3;
    if (older.length >= 2 && newer.length >= 2) {
      const olderAvg = older.reduce((s, e) => s + e.severity, 0) / older.length;
      const newerAvg = newer.reduce((s, e) => s + e.severity, 0) / newer.length;
      if (newerAvg < olderAvg - 0.5) {
        patterns.push({
          id: 'positive_growth',
          label: 'Positive Growth',
          description: `Your severity has improved from ${olderAvg.toFixed(1)} to ${newerAvg.toFixed(1)}. You're making progress!`,
          confidence: Math.min(80, 50 + Math.round((olderAvg - newerAvg) * 15)),
          severity: 'low',
          icon: 'Sprout',
        });
      }
    }
  }

  // Sort by confidence descending
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// Build pattern summary for AI context
export function buildPatternContext(patterns: DetectedPattern[]): string {
  if (patterns.length === 0) return '';
  return `Detected Emotional Patterns:\n${patterns.map(p =>
    `- ${p.label} (${p.confidence}% confidence, ${p.severity}): ${p.description}`
  ).join('\n')}`;
}
