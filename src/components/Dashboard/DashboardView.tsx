'use client';

import React from 'react';
import styles from './Dashboard.module.css';
import DailyResonance from './DailyResonance';
import InsightGrid from './InsightGrid';
import ActiveSanctuary from './ActiveSanctuary';

const DashboardView: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <DailyResonance />
      <InsightGrid />
      <ActiveSanctuary />
    </div>
  );
};

export default DashboardView;
