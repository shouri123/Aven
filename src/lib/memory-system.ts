// ===== AVEN LONG-TERM MEMORY SYSTEM =====
// Stores emotional history, patterns, behavioral metadata, and user context

export interface EmotionRecord {
  sentiment: string;
  signals: string[];
  severity: number;
  timestamp: string;
}

export interface EntryMetadata {
  id: number;
  text: string;
  timestamp: string;
  hourOfDay: number;
  emotion?: EmotionRecord;
}

export interface UserMemory {
  userName: string;
  totalEntries: number;
  emotionHistory: EmotionRecord[];
  entryMetadata: EntryMetadata[];
  // Rolling averages
  avgSeverity3: number;
  avgSeverity7: number;
  // Pattern flags
  detectedPatterns: string[];
  // Behavioral
  lateNightCount: number;
  consecutiveNegative: number;
  lastEntryDate: string;
  // Signal frequency map
  signalFrequency: Record<string, number>;
  // Top recurring themes
  recurringThemes: string[];
}

const MEMORY_KEY = (uid: string) => `aven_memory_${uid}`;

export function getMemory(uid: string): UserMemory | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(MEMORY_KEY(uid));
  return raw ? JSON.parse(raw) : null;
}

export function saveMemory(uid: string, memory: UserMemory): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMORY_KEY(uid), JSON.stringify(memory));
}

export function initMemory(userName: string): UserMemory {
  return {
    userName,
    totalEntries: 0,
    emotionHistory: [],
    entryMetadata: [],
    avgSeverity3: 0,
    avgSeverity7: 0,
    detectedPatterns: [],
    lateNightCount: 0,
    consecutiveNegative: 0,
    lastEntryDate: '',
    signalFrequency: {},
    recurringThemes: [],
  };
}

export function updateMemory(
  memory: UserMemory,
  entryText: string,
  emotion: { sentiment: string; signals: string[]; severity: number }
): UserMemory {
  const now = new Date();
  const hour = now.getHours();
  const timestamp = now.toISOString();

  const emotionRecord: EmotionRecord = {
    sentiment: emotion.sentiment,
    signals: emotion.signals,
    severity: emotion.severity,
    timestamp,
  };

  const metadata: EntryMetadata = {
    id: Date.now(),
    text: entryText,
    timestamp,
    hourOfDay: hour,
    emotion: emotionRecord,
  };

  // Update emotion history
  const emotionHistory = [...memory.emotionHistory, emotionRecord];
  const entryMetadata = [...memory.entryMetadata, metadata];

  // Calculate rolling severity averages
  const last3 = emotionHistory.slice(-3);
  const last7 = emotionHistory.slice(-7);
  const avgSeverity3 = last3.reduce((s, e) => s + e.severity, 0) / Math.max(last3.length, 1);
  const avgSeverity7 = last7.reduce((s, e) => s + e.severity, 0) / Math.max(last7.length, 1);

  // Track late-night entries (10 PM - 4 AM)
  const isLateNight = hour >= 22 || hour <= 4;
  const lateNightCount = memory.lateNightCount + (isLateNight ? 1 : 0);

  // Track consecutive negatives
  let consecutiveNegative = 0;
  for (let i = emotionHistory.length - 1; i >= 0; i--) {
    if (emotionHistory[i].sentiment === 'negative') consecutiveNegative++;
    else break;
  }

  // Update signal frequency
  const signalFrequency = { ...memory.signalFrequency };
  emotion.signals.forEach(sig => {
    signalFrequency[sig] = (signalFrequency[sig] || 0) + 1;
  });

  // Find recurring themes (signals appearing 3+ times)
  const recurringThemes = Object.entries(signalFrequency)
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([signal]) => signal);

  return {
    ...memory,
    totalEntries: memory.totalEntries + 1,
    emotionHistory,
    entryMetadata,
    avgSeverity3,
    avgSeverity7,
    lateNightCount,
    consecutiveNegative,
    lastEntryDate: timestamp,
    signalFrequency,
    recurringThemes,
  };
}

// Build a context summary for the AI prompt
export function buildMemoryContext(memory: UserMemory): string {
  if (!memory || memory.totalEntries === 0) return '';

  const lines: string[] = [];
  lines.push(`User Name: ${memory.userName}`);
  lines.push(`Total Entries: ${memory.totalEntries}`);
  lines.push(`Average Severity (last 3): ${memory.avgSeverity3.toFixed(1)}/5`);
  lines.push(`Average Severity (last 7): ${memory.avgSeverity7.toFixed(1)}/5`);
  lines.push(`Consecutive Negative Entries: ${memory.consecutiveNegative}`);
  lines.push(`Late Night Entries: ${memory.lateNightCount}`);

  if (memory.recurringThemes.length > 0) {
    lines.push(`Recurring Themes: ${memory.recurringThemes.join(', ')}`);
  }

  if (memory.detectedPatterns.length > 0) {
    lines.push(`Detected Patterns: ${memory.detectedPatterns.join(', ')}`);
  }

  // Last 5 entries summaries
  const recent = memory.entryMetadata.slice(-5);
  if (recent.length > 0) {
    lines.push(`\nRecent Entry History:`);
    recent.forEach((e, i) => {
      const date = new Date(e.timestamp).toLocaleDateString();
      const time = new Date(e.timestamp).toLocaleTimeString();
      const emotionStr = e.emotion
        ? `[${e.emotion.sentiment}, severity: ${e.emotion.severity}/5, signals: ${e.emotion.signals.join(', ')}]`
        : '[no analysis]';
      lines.push(`  ${i + 1}. (${date} ${time}) "${e.text.substring(0, 100)}..." ${emotionStr}`);
    });
  }

  return lines.join('\n');
}
