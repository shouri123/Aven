'use client';

import React from 'react';
import styles from './Dashboard.module.css';

const ActiveSanctuary: React.FC = () => {
  return (
    <div className={styles.activeSanctuaryContainer}>
      <div className={`${styles.glassCard} ${styles.sessionCard} ${styles.auraGlow}`}>
        <div className={styles.breathingIconWrapper}>
          <div className={`${styles.breathingIndicator} ${styles.indicatorGlow}`} />
          <div className={styles.innerCircle}>
            <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>
              air
            </span>
          </div>
        </div>
        
        <div className={styles.sessionMeta}>
          <h4 className={styles.sessionTitle}>Active Sanctuary</h4>
          <p className={styles.sessionSubtitle}>
            Entering focused coherence state. Ambient sounds transitioning to 'Spring Meadow'.
          </p>
        </div>
      </div>

      <div className={`${styles.glassCard} ${styles.reflectionCard} ${styles.auraGlow}`}>
        <img 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop" 
          alt="Abstract Nature"
          className={styles.reflectionImage}
        />
        <div className={styles.overlay} />
        <div className={styles.reflectionContent}>
          <h4 className={styles.reflectionTitle}>Morning Reflection</h4>
          <span className={styles.sessionTag}>Session: 08:00 AM</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveSanctuary;
