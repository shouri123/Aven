'use client';

import React from 'react';

const InsightGrid: React.FC = () => {
  const cards = [
    {
      title: 'Weekly Harmony',
      value: '84%',
      desc: 'Your emotional resonance is peaking in quiet moments.',
      color: 'from-primary/20 to-transparent',
      glow: 'indigo-glow'
    },
    {
      title: 'Guided Calm',
      value: '12m',
      desc: 'Consistency is forming a deeper sanctuary for your mind.',
      color: 'from-secondary/20 to-transparent',
      glow: 'cyan-glow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6 mb-32">
      {cards.map((card) => (
        <div 
          key={card.title}
          className={`relative group p-10 serenity-glass rounded-xl ghost-border transition-all hover:bg-surface-container-high/60 ${card.glow}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20 rounded-xl`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-label tracking-widest uppercase text-on-surface/40">
                {card.title}
              </h3>
              <span className="material-symbols-outlined text-primary/60 group-hover:text-primary transition-colors">
                trending_up
              </span>
            </div>
            <div className="text-6xl font-outfit font-light text-on-surface mb-4">
              {card.value}
            </div>
            <p className="text-on-surface-variant font-manrope leading-relaxed max-w-[280px]">
              {card.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightGrid;
