"use client";

import styles from "./WellnessRecommendations.module.css";

const RECOMMENDATIONS = [
  {
    title: "Digital Decompression",
    description: "You've been active late at night. Try setting a 'No Screen' boundary 30 mins before bed.",
    icon: "🌙",
    tag: "Sleep"
  },
  {
    title: "Grounding Walk",
    description: "A 10-minute walk without music can help lower the cortisol spikes detected yesterday.",
    icon: "🌳",
    tag: "Stress"
  },
  {
    title: "Social Micro-Dose",
    description: "Send a quick 'thinking of you' text to one person. It helps break the isolation loop.",
    icon: "💬",
    tag: "Connection"
  }
];

export default function WellnessRecommendations() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Proactive Recommendations</h3>
      <div className={styles.grid}>
        {RECOMMENDATIONS.map((rec, i) => (
          <div key={i} className={`${styles.card} glass-card`}>
            <div className={styles.header}>
              <span className={styles.icon}>{rec.icon}</span>
              <span className={styles.tag}>{rec.tag}</span>
            </div>
            <h4 className={styles.recTitle}>{rec.title}</h4>
            <p className={styles.description}>{rec.description}</p>
            <button className={styles.actionButton}>I'll try this</button>
          </div>
        ))}
      </div>
    </div>
  );
}
