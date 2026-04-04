'use client';

import React, { useState } from 'react';
import styles from './CrisisBanner.module.css';

export default function CrisisBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${styles.banner} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.container}>
        <div className={styles.mainInfo}>
          <span className={styles.alertIcon}>🚨</span>
          <span className={styles.text}>Crisis Support Available:</span>
          <div className={styles.quickLinks}>
            <a href="tel:9152987821" className={styles.link}>iCall: 9152987821</a>
            <a href="tel:18602662345" className={styles.link}>Vandrevala: 1860 266 2345</a>
          </div>
          <button 
            className={styles.expandButton} 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'All Helplines'}
          </button>
        </div>

        {isExpanded && (
          <div className={styles.expandedContent}>
            <div className={styles.grid}>
              <div className={styles.item}>
                <strong>NIMHANS (24/7)</strong>
                <a href="tel:08046110007">080-46110007</a>
              </div>
              <div className={styles.item}>
                <strong>SNEHI</strong>
                <a href="tel:01124341234">011-24341234</a>
              </div>
              <div className={styles.item}>
                <strong>KIRAN (Govt)</strong>
                <a href="tel:18005990019">1800-599-0019</a>
              </div>
              <div className={styles.item}>
                <strong>Emergency</strong>
                <a href="tel:112">Dial 112</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
