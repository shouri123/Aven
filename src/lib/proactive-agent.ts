// ===== AVEN PROACTIVE AGENT =====
// Generates proactive check-in messages based on user patterns.
// This is what makes Aven "agentic" — it initiates, not just responds.

import { UserMemory } from './memory-system';
import { DetectedPattern } from './pattern-detector';

export interface ProactiveMessage {
  id: string;
  type: 'checkin' | 'insight' | 'encouragement' | 'concern';
  text: string;
  priority: number; // 1-5
}

export function generateProactiveMessages(
  memory: UserMemory,
  patterns: DetectedPattern[]
): ProactiveMessage[] {
  if (!memory || memory.totalEntries < 2) return [];

  const messages: ProactiveMessage[] = [];
  const name = memory.userName.split(' ')[0]; // First name

  // 1. CONSECUTIVE NEGATIVE STREAK (3+)
  if (memory.consecutiveNegative >= 3) {
    messages.push({
      id: 'negative_streak',
      type: 'concern',
      text: `${name}, I've noticed your last ${memory.consecutiveNegative} entries have been difficult. I want you to know that tough seasons don't last forever — and acknowledging how you feel is a sign of strength. Would you like to talk about what's been weighing on you?`,
      priority: 4,
    });
  }

  // 2. WORSENING SEVERITY TREND
  if (memory.avgSeverity3 > memory.avgSeverity7 + 0.8 && memory.totalEntries >= 5) {
    messages.push({
      id: 'worsening_trend',
      type: 'concern',
      text: `${name}, your recent entries show higher stress levels compared to your overall pattern. Sometimes when things intensify, it helps to step back and focus on one small thing that brings you peace. What's one thing that made you smile recently?`,
      priority: 4,
    });
  }

  // 3. LATE-NIGHT PATTERN
  const lateNightRatio = memory.totalEntries > 0 ? memory.lateNightCount / memory.totalEntries : 0;
  if (lateNightRatio >= 0.4 && memory.lateNightCount >= 2) {
    messages.push({
      id: 'late_night',
      type: 'insight',
      text: `${name}, Aven noticed you've been writing quite late at night — ${memory.lateNightCount} of your ${memory.totalEntries} entries were after 10 PM. Late nights can sometimes reflect a restless mind. How's your sleep been lately?`,
      priority: 3,
    });
  }

  // 4. BURNOUT PATTERN DETECTED
  const burnout = patterns.find(p => p.id === 'burnout');
  if (burnout && burnout.confidence >= 60) {
    messages.push({
      id: 'burnout_warning',
      type: 'concern',
      text: `${name}, based on your recent entries, Aven has detected signs that could indicate burnout — sustained stress with declining energy. Consider taking a short break, even 10 minutes of doing nothing. Your wellbeing comes first.`,
      priority: 5,
    });
  }

  // 5. LONELINESS PATTERN
  const lonely = patterns.find(p => p.id === 'loneliness');
  if (lonely && lonely.confidence >= 50) {
    messages.push({
      id: 'loneliness_support',
      type: 'checkin',
      text: `${name}, you've mentioned feeling disconnected or alone a few times. Connection is a fundamental need — even a short text to someone you trust can make a difference. Is there someone you'd feel comfortable reaching out to?`,
      priority: 3,
    });
  }

  // 6. POSITIVE GROWTH
  const growth = patterns.find(p => p.id === 'positive_growth');
  if (growth) {
    messages.push({
      id: 'growth_celebration',
      type: 'encouragement',
      text: `${name}, Aven wants to celebrate something — your recent entries show real improvement compared to earlier. Whatever you've been doing differently, it's working. Keep going!` ,
      priority: 2,
    });
  }

  // 7. MILESTONE ENTRIES
  if (memory.totalEntries === 5) {
    messages.push({
      id: 'milestone_5',
      type: 'encouragement',
      text: `${name}, you've written 5 entries! Aven is starting to understand your emotional patterns better. The more you share, the more personalized my support becomes.`,
      priority: 2,
    });
  } else if (memory.totalEntries === 10) {
    messages.push({
      id: 'milestone_10',
      type: 'encouragement',
      text: `${name}, 10 entries! That's real commitment to self-reflection. Aven has built a solid understanding of your emotional landscape. You're investing in yourself — that matters.`,
      priority: 2,
    });
  }

  // Sort by priority (highest first)
  return messages.sort((a, b) => b.priority - a.priority);
}
