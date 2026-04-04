'use client';

import React from 'react';

const DailyResonance: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-32">
      <div className="serenity-glass rounded-xl p-12 ghost-border cyan-glow overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[100px] pointer-events-none group-hover:bg-secondary/10 transition-colors" />
        
        <div className="flex items-center justify-between mb-20 relative">
          <div>
            <h2 className="text-4xl font-outfit font-light text-on-surface mb-2">Daily Resonance</h2>
            <p className="text-on-surface-variant font-extralight tracking-wide">A timeline of your emotional frequency.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full serenity-glass ghost-border text-xs font-label uppercase tracking-widest text-on-surface/60 hover:text-primary transition-colors">7 Days</button>
            <button className="px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-label uppercase tracking-widest ghost-border">Today</button>
          </div>
        </div>

        <div className="relative h-64 flex items-end justify-between px-10">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-on-surface/10" />
          
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                <stop offset="50%" stopColor="var(--secondary)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M 0 180 Q 200 120 400 200 T 800 150 T 1200 100"
              fill="none"
              stroke="url(#line-grad)"
              strokeWidth="4"
              className="drop-shadow-[0_0_15px_rgba(76,215,246,0.5)]"
            />
          </svg>

          {[6, 9, 12, 15, 18, 21].map((hour) => (
            <div key={hour} className="flex flex-col items-center gap-4 relative z-10">
              <div 
                className="w-1.5 h-1.5 rounded-full bg-secondary indigo-glow animate-pulse"
                style={{ marginBottom: Math.random() * 80 + 20 + 'px' }}
              />
              <span className="text-[10px] font-label text-on-surface/30 tracking-tighter uppercase">{hour}:00</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyResonance;
