// ===== AVEN MEDICAL WELLNESS GUIDANCE =====
// Curated tips organized by category. NOT diagnosis — only wellness guidance.
// Always paired with "consult a healthcare professional" disclaimer.

export interface WellnessTip {
  id: string;
  title: string;
  description: string;
  category: WellnessCategory;
  forSignals: string[]; // matches against detected emotional signals
  icon: string;
}

export type WellnessCategory = 'sleep' | 'stress' | 'breathing' | 'mindfulness' | 'physical' | 'social' | 'nutrition' | 'professional';

export const CATEGORY_META: Record<WellnessCategory, { label: string; color: string; icon: string }> = {
  sleep: { label: 'Sleep Hygiene', color: '#6366f1', icon: '🌙' },
  stress: { label: 'Stress Relief', color: '#f59e0b', icon: '🧘' },
  breathing: { label: 'Breathing Exercises', color: '#10b981', icon: '🌬️' },
  mindfulness: { label: 'Mindfulness', color: '#8b5cf6', icon: '🧠' },
  physical: { label: 'Physical Wellness', color: '#ef4444', icon: '💪' },
  social: { label: 'Social Connection', color: '#ec4899', icon: '💬' },
  nutrition: { label: 'Nutrition & Hydration', color: '#14b8a6', icon: '🥗' },
  professional: { label: 'Professional Help', color: '#64748b', icon: '🏥' },
};

export const WELLNESS_TIPS: WellnessTip[] = [
  // SLEEP
  {
    id: 'sleep_schedule',
    title: 'Consistent Sleep Schedule',
    description: 'Try to go to bed and wake up at the same time every day, even on weekends. This helps regulate your body\'s internal clock and can improve sleep quality over time.',
    category: 'sleep',
    forSignals: ['sleep issues', 'insomnia', 'fatigue', 'tired', 'exhaustion'],
    icon: '⏰',
  },
  {
    id: 'screen_before_bed',
    title: 'Reduce Screen Time Before Bed',
    description: 'Try to avoid screens for at least 30 minutes before sleeping. Blue light from devices can suppress melatonin production and make it harder to fall asleep.',
    category: 'sleep',
    forSignals: ['sleep issues', 'insomnia', 'anxiety'],
    icon: '📱',
  },
  {
    id: 'sleep_environment',
    title: 'Optimize Your Sleep Environment',
    description: 'Keep your bedroom cool (65-68°F / 18-20°C), dark, and quiet. Consider using blackout curtains or a white noise machine if needed.',
    category: 'sleep',
    forSignals: ['sleep issues', 'insomnia', 'fatigue'],
    icon: '🛏️',
  },

  // STRESS
  {
    id: 'progressive_relaxation',
    title: 'Progressive Muscle Relaxation',
    description: 'Tense each muscle group for 5 seconds, then release for 30 seconds. Start from your toes and work up to your head. This reduces physical tension associated with stress.',
    category: 'stress',
    forSignals: ['stress', 'anxiety', 'tension', 'overwhelm'],
    icon: '🧘',
  },
  {
    id: 'time_blocking',
    title: 'Time Blocking for Overwhelm',
    description: 'Break your day into focused 25-minute blocks (Pomodoro technique) with 5-minute breaks. This prevents feeling overwhelmed by making tasks manageable.',
    category: 'stress',
    forSignals: ['stress', 'overwhelm', 'burnout', 'productivity'],
    icon: '📋',
  },
  {
    id: 'journaling_practice',
    title: 'Expressive Writing',
    description: 'Write for 15-20 minutes about your deepest feelings without editing. Research shows this can reduce stress hormones and improve immune function.',
    category: 'stress',
    forSignals: ['stress', 'anxiety', 'sadness', 'frustration'],
    icon: '📝',
  },

  // BREATHING
  {
    id: 'box_breathing',
    title: '4-7-8 Breathing Technique',
    description: 'Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times. This activates your parasympathetic nervous system, reducing anxiety.',
    category: 'breathing',
    forSignals: ['anxiety', 'panic', 'stress', 'nervousness', 'worry'],
    icon: '🌬️',
  },
  {
    id: 'grounding_breath',
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This grounds you in the present moment during anxiety or panic.',
    category: 'breathing',
    forSignals: ['anxiety', 'panic', 'dissociation', 'overwhelm'],
    icon: '🌍',
  },

  // MINDFULNESS
  {
    id: 'body_scan',
    title: 'Body Scan Meditation',
    description: 'Spend 10 minutes scanning attention from head to toe, noticing sensations without judgment. This builds self-awareness and reduces tension.',
    category: 'mindfulness',
    forSignals: ['anxiety', 'stress', 'tension', 'insomnia'],
    icon: '🧘‍♀️',
  },
  {
    id: 'gratitude_practice',
    title: 'Daily Gratitude Practice',
    description: 'Write down 3 specific things you\'re grateful for before bed. Research shows this rewires your brain toward positive thinking over time.',
    category: 'mindfulness',
    forSignals: ['sadness', 'depression', 'negativity', 'hopelessness'],
    icon: '🙏',
  },
  {
    id: 'mindful_walking',
    title: 'Mindful Walking',
    description: 'Take a 10-minute walk focusing on each step, the ground beneath you, and the air on your skin. This combines movement with mindfulness.',
    category: 'mindfulness',
    forSignals: ['stress', 'anxiety', 'depression', 'loneliness'],
    icon: '🚶',
  },

  // PHYSICAL
  {
    id: 'morning_stretch',
    title: 'Morning Stretch Routine',
    description: 'Spend 5-10 minutes stretching when you wake up. Focus on neck, shoulders, back, and hips. Physical tension often mirrors emotional stress.',
    category: 'physical',
    forSignals: ['tension', 'fatigue', 'stress', 'burnout'],
    icon: '🤸',
  },
  {
    id: 'regular_movement',
    title: '30 Minutes of Daily Movement',
    description: 'Even a 30-minute walk releases endorphins and serotonin. Exercise is one of the most evidence-based treatments for mild to moderate depression.',
    category: 'physical',
    forSignals: ['depression', 'sadness', 'fatigue', 'low energy', 'burnout'],
    icon: '🏃',
  },

  // SOCIAL
  {
    id: 'reach_out',
    title: 'Reach Out to Someone',
    description: 'Send a message to a friend or family member. Connection is a fundamental human need — even a short check-in can shift your mood.',
    category: 'social',
    forSignals: ['loneliness', 'isolation', 'disconnection', 'sadness'],
    icon: '📞',
  },
  {
    id: 'community_activity',
    title: 'Join a Group Activity',
    description: 'Consider joining a class, club, or online community around an interest. Shared activities create natural connection without pressure.',
    category: 'social',
    forSignals: ['loneliness', 'isolation', 'boredom', 'disconnection'],
    icon: '👥',
  },

  // NUTRITION
  {
    id: 'hydration',
    title: 'Stay Hydrated',
    description: 'Dehydration can worsen anxiety, fatigue, and mood. Aim for 8 glasses of water daily. Keep a water bottle visible as a reminder.',
    category: 'nutrition',
    forSignals: ['fatigue', 'headache', 'low energy', 'stress'],
    icon: '💧',
  },
  {
    id: 'mood_foods',
    title: 'Mood-Supporting Nutrition',
    description: 'Foods rich in omega-3 (fish, walnuts), magnesium (leafy greens), and vitamin D (sunlight, eggs) support mental health. Avoid excess caffeine and sugar.',
    category: 'nutrition',
    forSignals: ['depression', 'fatigue', 'anxiety', 'mood swings'],
    icon: '🥑',
  },

  // PROFESSIONAL
  {
    id: 'therapy_suggestion',
    title: 'Consider Professional Support',
    description: 'If your symptoms persist for more than 2 weeks or significantly impact daily life, speaking with a mental health professional can make a real difference. This is a sign of strength, not weakness.',
    category: 'professional',
    forSignals: ['depression', 'anxiety', 'burnout', 'hopelessness', 'self-harm'],
    icon: '🩺',
  },
  {
    id: 'regular_checkup',
    title: 'Schedule a Health Checkup',
    description: 'Mental and physical health are deeply connected. Thyroid issues, vitamin deficiencies, and hormonal changes can all affect mood. A routine checkup can rule out physical causes.',
    category: 'professional',
    forSignals: ['fatigue', 'mood swings', 'sleep issues', 'depression'],
    icon: '🏥',
  },
];

// Get relevant tips based on user's detected signals
export function getRelevantTips(signals: string[], maxTips: number = 8): WellnessTip[] {
  if (signals.length === 0) return WELLNESS_TIPS.slice(0, maxTips);
  
  const scored = WELLNESS_TIPS.map(tip => {
    const matchCount = tip.forSignals.filter(s =>
      signals.some(sig => sig.toLowerCase().includes(s) || s.includes(sig.toLowerCase()))
    ).length;
    return { tip, score: matchCount };
  });

  // Sort by relevance score, then ensure variety in categories
  scored.sort((a, b) => b.score - a.score);
  
  const result: WellnessTip[] = [];
  const usedCategories = new Set<WellnessCategory>();
  
  // First pass: pick top matches ensuring category variety
  for (const item of scored) {
    if (result.length >= maxTips) break;
    if (item.score > 0) {
      result.push(item.tip);
      usedCategories.add(item.tip.category);
    }
  }

  // Fill remaining slots with tips from uncovered categories
  if (result.length < maxTips) {
    for (const item of scored) {
      if (result.length >= maxTips) break;
      if (!result.includes(item.tip) && !usedCategories.has(item.tip.category)) {
        result.push(item.tip);
        usedCategories.add(item.tip.category);
      }
    }
  }

  // Always include professional help suggestion at the end
  const profTip = WELLNESS_TIPS.find(t => t.id === 'therapy_suggestion');
  if (profTip && !result.includes(profTip) && result.length < maxTips + 1) {
    result.push(profTip);
  }

  return result;
}

export const MEDICAL_DISCLAIMER = `⚕️ **Important Disclaimer**: Aven provides general wellness guidance only. This is NOT a substitute for professional medical advice, diagnosis, or treatment. If symptoms persist or worsen, please consult a qualified healthcare professional. In case of emergency, contact your local emergency services immediately.`;
