'use client';

import React from 'react';

const MedicalGuidance: React.FC = () => {
  const indicators = [
    { label: 'Systemic Balance', status: 'Stable', value: 92, color: 'text-secondary' },
    { label: 'Neural Recovery', status: 'Optimal', value: 88, color: 'text-primary' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mb-40">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 serenity-glass rounded-xl p-12 ghost-border group relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors" />
          
          <div className="flex items-center gap-4 mb-12">
            <span className="material-symbols-outlined text-secondary text-3xl">verified_user</span>
            <h2 className="text-3xl font-outfit font-light text-on-surface">Clinical Compass</h2>
          </div>

          <div className="space-y-12">
            {indicators.map((ind) => (
              <div key={ind.label} className="relative">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-label tracking-widest uppercase text-on-surface/40 mb-1">{ind.label}</h4>
                    <p className={`text-lg font-manrope font-medium ${ind.color}`}>{ind.status}</p>
                  </div>
                  <span className="text-2xl font-outfit font-light text-on-surface/60">{ind.value}%</span>
                </div>
                <div className="h-[2px] w-full bg-on-surface/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-transparent to-current ${ind.color}`}
                    style={{ width: `${ind.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="serenity-glass rounded-xl p-12 ghost-border bg-gradient-to-b from-surface-container-high/40 to-transparent">
          <h3 className="text-xs font-label tracking-widest uppercase text-primary mb-8 underline underline-offset-8">Immediate Support</h3>
          <p className="text-on-surface/60 font-manrope leading-relaxed mb-10 text-sm">
            Our wellness agents are on standby. Reach out for a compassionate presence in moments of acute stress.
          </p>
          <button className="w-full py-5 rounded-full bg-on-surface text-surface-container-lowest font-manrope font-bold text-sm tracking-widest uppercase hover:bg-secondary transition-all cyan-glow">
            Connect Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalGuidance;
