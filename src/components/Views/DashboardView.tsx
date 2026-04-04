'use client';

import React, { useState, useEffect } from 'react';

const DashboardView: React.FC = () => {
  const [entriesCount, setEntriesCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('aura_entries') || '[]');
      setEntriesCount(saved.length);
    }
  }, []);

  // Simple harmony calculation based on entry count for flavor
  const harmonyIndex = Math.min(60 + (entriesCount * 5), 98);

  return (
    <main className="pt-32 pb-40 px-6 max-w-screen-xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Hero: Emotional Timeline */}
      <section className="relative">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-4xl md:text-6xl font-headline font-light tracking-tight text-primary">Daily Resonance</h2>
            <p className="text-secondary font-label mt-2 tracking-wide uppercase text-[10px] font-bold">Tracking your ethereal shift over the last 24 hours.</p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-tertiary font-headline text-4xl font-bold">{harmonyIndex}%</span>
            <p className="text-[10px] font-label uppercase tracking-widest text-secondary font-black">Harmony Index</p>
          </div>
        </div>
        
        {/* Fluid Timeline SVG */}
        <div className="relative w-full h-80 ethereal-glass rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-primary/5 border border-primary/5">
          {/* Abstract Glows */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-tertiary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]"></div>
          
          <svg className="w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="pathGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#163526"></stop>
                <stop offset="50%" stopColor="#accfb8"></stop>
                <stop offset="100%" stopColor="#446a74"></stop>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur result="coloredBlur" stdDeviation="4"></feGaussianBlur>
                <feMerge>
                  <feMergeNode in="coloredBlur"></feMergeNode>
                  <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M0,150 Q150,50 300,120 T600,80 T1000,100" 
              fill="none" 
              filter="url(#glow)" 
              stroke="url(#pathGradient)" 
              strokeLinecap="round" 
              strokeWidth="4"
              className="drop-shadow-2xl"
            ></path>
            {/* Nodes */}
            <circle className="animate-pulse" cx="300" cy="120" fill="#accfb8" r="6" stroke="white" strokeWidth="2"></circle>
            <circle cx="600" cy="80" fill="#163526" r="6" stroke="white" strokeWidth="2"></circle>
          </svg>
          
          <div className="absolute bottom-6 left-12 right-12 flex justify-between text-[11px] uppercase tracking-[0.3em] text-secondary/60 font-label font-bold">
            <span>Dawn</span>
            <span>Noon</span>
            <span>Dusk</span>
            <span>Midnight</span>
          </div>
        </div>
      </section>

      {/* Insights Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Insight Card 1 */}
        <div className="organic-card p-10 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-primary/5">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 rounded-2xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-3xl">wb_twilight</span>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-secondary/60 font-black">Optimization</span>
          </div>
          <h3 className="text-2xl font-headline font-light mb-4 tracking-tight text-primary">Circadian Harmony</h3>
          <p className="text-sm leading-relaxed text-secondary mb-8 font-medium italic opacity-80">Your natural rhythm is aligning beautifully. High focus expected at 10:45 AM.</p>
          <div className="flex items-center gap-4">
            <div className="h-2 flex-1 bg-primary/5 rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[85%] rounded-full shadow-[0_0_10px_rgba(68,106,116,0.3)]"></div>
            </div>
            <span className="text-[11px] font-label text-secondary font-black">85%</span>
          </div>
        </div>

        {/* Insight Card 2 */}
        <div className="organic-card p-10 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-primary/5">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 rounded-2xl bg-tertiary/10 text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-secondary/60 font-black">Mental State</span>
          </div>
          <h3 className="text-2xl font-headline font-light mb-4 tracking-tight text-primary">Resilience</h3>
          <p className="text-sm leading-relaxed text-secondary mb-8 font-medium italic opacity-80">Emotional capacity has increased by 12% following your recent reflections.</p>
          <button className="text-[10px] font-label uppercase tracking-widest text-tertiary font-black hover:tracking-[0.2em] transition-all flex items-center gap-2">
            Review Patterns <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* Insight Card 3 */}
        <div className="organic-card p-10 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-primary/5">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-3xl">center_focus_strong</span>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-secondary/60 font-black">Deep Work</span>
          </div>
          <h3 className="text-2xl font-headline font-light mb-4 tracking-tight text-primary">Focus Resonance</h3>
          <p className="text-sm leading-relaxed text-secondary mb-8 font-medium italic opacity-80">The current atmosphere is conducive to high-level cognitive tasks and strategic thinking.</p>
          <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-primary/5 flex items-center justify-center shadow-sm">
                 <span className="material-symbols-outlined text-primary/30 text-lg">waves</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Dynamic Visualization Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="ethereal-glass p-12 rounded-[3rem] flex flex-col justify-center items-center text-center space-y-8 min-h-[360px] shadow-xl border border-primary/5 group">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-primary/10 to-tertiary/20 animate-pulse blur-2xl opacity-40 absolute -inset-4"></div>
            <div className="w-32 h-32 rounded-full border border-primary/10 flex items-center justify-center relative z-10 bg-white/60 backdrop-blur-xl shadow-lg group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-5xl text-primary font-light">air</span>
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-headline font-light tracking-widest text-primary">Focused Coherence</h4>
            <p className="text-secondary text-sm mt-4 max-w-xs mx-auto leading-relaxed italic">Atmosphere transitioning to 'Spring Meadow'. Your sensory environment is now optimized.</p>
          </div>
        </div>

        <div className="rounded-[3rem] overflow-hidden relative group h-[360px] shadow-2xl border-4 border-white">
          <img 
            alt="Abstract Art" 
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuClNFcomKbAIyAuK0g1p0b-LMe4qKE0xIGsTtX4U8hr_t4OKde60XS2pzj6XruivqSpY9aQMIWGXu63qcp6DVJOfKJlAAhWn-628CegyR79wySpCU4v0EAz_r5HdlWvNV76eDI9fsZR0sUAyycT1LVS3rDb25LgGHfF6qG1LivGUAyyUNH1q09bx3i3JwSdREklR8Cahw7FhuI6U5rDlYBWmAdZV6V62ea1WJ-mErXtXcQIN2qooSwF_cxPGckCP9jj0d1MPGANc-E"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10">
            <div className="inline-block px-3 py-1 bg-tertiary/20 backdrop-blur-md rounded-full mb-4 border border-white/20">
               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Daily Milestone</span>
            </div>
            <h4 className="text-3xl font-headline font-light tracking-tight text-white mb-2">Morning Reflection</h4>
            <p className="text-white/60 text-[10px] font-label uppercase tracking-[0.4em] font-black">Logged: 08:00 AM • Sanctuary Alpha</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardView;
