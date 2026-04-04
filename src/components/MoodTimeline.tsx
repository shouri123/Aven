"use client";

import styles from "./MoodTimeline.module.css";

interface HistoryEntry {
  date: string;
  mood: string;
  signal: 'anxiety' | 'stress' | 'burnout' | 'calm' | 'neutral';
  intensity: number;
}

const MOCK_HISTORY: HistoryEntry[] = [
  { date: "Mar 30", mood: "Overwhelmed", signal: "stress", intensity: 80 },
  { date: "Mar 31", mood: "Tired", signal: "burnout", intensity: 60 },
  { date: "Apr 01", mood: "Restless", signal: "anxiety", intensity: 70 },
  { date: "Apr 02", mood: "Thinking", signal: "neutral", intensity: 40 },
  { date: "Today", mood: "Reflecting", signal: "calm", intensity: 30 },
];

export default function MoodTimeline() {
  return (
    <div className={`${styles.container} glass-card`}>
      <h3 className={styles.title}>Emotional Timeline</h3>
      <div className={styles.timeline}>
        {MOCK_HISTORY.map((entry, i) => (
          <div key={i} className={styles.entry}>
            <div className={styles.dateSide}>
              <span className={styles.date}>{entry.date}</span>
            </div>
            <div className={styles.nodeSide}>
              <div 
                className={`${styles.node} ${styles[entry.signal]}`}
                style={{ height: `${entry.intensity}%` }}
              ></div>
            </div>
            <div className={styles.infoSide}>
              <span className={styles.moodLabel}>{entry.mood}</span>
              <span className={styles.signalLabel}>#{entry.signal}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <div className={styles.insight}>
          <strong>Gently Improving:</strong> Your stress levels have decreased by 15% since Monday.
        </div>
      </div>
    </div>
  );
}
