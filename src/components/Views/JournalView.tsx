'use client';

import React, { useState, useEffect } from 'react';

interface JournalViewProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const JournalView: React.FC<JournalViewProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [entriesCount, setEntriesCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('aura_entries') || '[]');
      setEntriesCount(saved.length);
    }
  }, []);

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date().toLocaleDateString('en-US', options).replace(',', ' •');
  };

  return (
    <main className="relative pt-36 pb-40 px-6 max-w-5xl mx-auto min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center mb-12 w-full animate-in fade-in slide-in-from-top-5 duration-700">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-md mb-6 border border-tertiary/20 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-label text-primary/80 font-bold">Verdant Sanctuary Active</span>
        </div>
        <h1 className="font-outfit font-light text-5xl md:text-7xl lg:text-8xl text-primary tracking-tight mb-6 text-center w-full">
          How are you <span className="italic font-extralight text-tertiary">really</span> feeling?
        </h1>
      </section>

      {/* Journal Reflection Workspace: Ethereal Sanctuary */}
      <section className="w-full relative animate-in zoom-in-95 duration-1000">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-tertiary/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="ethereal-glass rounded-3xl p-8 md:p-14 shadow-[0_40px_80px_-20px_rgba(22,53,38,0.08)] relative overflow-hidden group hover:shadow-xl transition-all">
          {/* Workspace Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-[2rem] bg-gradient-to-tr from-tertiary/20 to-primary/5">
                <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
              </div>
              <div>
                <p className="text-primary font-headline text-xl font-bold flex items-center gap-2">
                  New Reflection
                  {entriesCount > 0 && <span className="text-[9px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full font-label font-black tracking-widest uppercase">Entry #{entriesCount + 1}</span>}
                </p>
                <p className="text-xs text-secondary/70 tracking-widest font-label uppercase mt-1">
                  {getFormattedDate()} • Private Sanctuary
                </p>
              </div>
            </div>
            <button className="p-3 rounded-full hover:bg-primary/5 transition-colors text-secondary hover:text-primary">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          {/* Main Input Field */}
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-72 bg-transparent border-none focus:ring-0 text-2xl md:text-3xl font-light text-primary placeholder:text-primary/20 resize-none leading-relaxed outline-none" 
            placeholder="The space is yours. Let your thoughts flow without judgment..."
          />

          {/* Floating Interaction Layer */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-primary/5 pt-10">
            <div className="flex items-center gap-8">
              <button className="flex items-center gap-3 group/icon hover:text-primary transition-all text-secondary">
                <span className="material-symbols-outlined group-hover/icon:scale-110 transition-transform">mood</span>
                <span className="text-sm font-label font-medium">Record Mood</span>
              </button>
              <button className="flex items-center gap-3 group/icon hover:text-primary transition-all text-secondary">
                <span className="material-symbols-outlined group-hover/icon:scale-110 transition-transform">lock</span>
                <span className="text-sm font-label font-medium">Encrypted</span>
              </button>
            </div>
            <button 
              onClick={() => onAnalyze(text)}
              disabled={isAnalyzing || !text.trim()}
              className="group relative px-10 py-5 rounded-full bg-gradient-to-r from-primary to-[#0f241a] text-white hover:from-tertiary hover:to-primary shadow-xl shadow-primary/20 transition-all duration-500 flex items-center gap-4 overflow-hidden active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              <span className="font-headline font-semibold text-lg relative z-10 transition-all">
                {isAnalyzing ? 'Seeking Clarity...' : 'Save Reflection'}
              </span>
              <span className="material-symbols-outlined relative z-10 group-hover:rotate-45 transition-transform duration-500">
                {isAnalyzing ? 'sync' : 'spa'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Supporting Context Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24">
        <div className="md:col-span-2 ethereal-glass rounded-3xl p-10 shadow-lg border border-primary/5 flex flex-col justify-between min-h-[320px] transition-all hover:border-tertiary/30 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
          <div>
            <h3 className="text-3xl font-headline font-light text-primary mb-3">Weekly Harmony</h3>
            <p className="text-secondary text-base max-w-sm">Your emotional frequency is stabilizing beautifully this week.</p>
          </div>
          <div className="w-full h-32 mt-10 flex items-end justify-between gap-2">
            {[40, 60, 85, 55, 95, 45, 35].map((h, i) => (
              <div 
                key={i} 
                className={`w-full rounded-xl relative transition-all duration-700 hover:scale-y-110 cursor-pointer ${
                  i === 2 ? 'bg-gradient-to-t from-tertiary/60 to-tertiary' : i === 4 ? 'bg-gradient-to-t from-secondary/40 to-secondary/80' : 'bg-primary/5 hover:bg-tertiary/20'
                }`}
                style={{ height: `${h}%`, transformOrigin: 'bottom' }}
              >
                {(i === 2 || i === 4) && (
                  <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-white rounded-full shadow-lg ${i===2 ? 'bg-tertiary' : 'bg-secondary'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="ethereal-glass rounded-3xl p-10 shadow-lg border border-primary/5 group relative overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500">
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-tertiary/15 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-tertiary/10 flex items-center justify-center mb-8 group-hover:bg-tertiary transition-colors duration-500">
              <span className="material-symbols-outlined text-4xl text-tertiary group-hover:text-white transition-colors duration-500">air</span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-3">Guided Calm</h3>
            <p className="text-secondary text-sm mb-8 leading-relaxed">Ground your thoughts with a 5-minute breathwork session before you write.</p>
          </div>
          <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-3 group-hover:gap-5 transition-all w-fit relative z-10 hover:text-tertiary">
            Center Now
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Visual Polish: Floating Ornament */}
      <div className="fixed bottom-32 right-12 hidden lg:flex flex-col items-center gap-4 hover:scale-110 transition-transform cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-tertiary to-secondary animate-pulse flex items-center justify-center opacity-80 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-xl">air</span>
          </div>
        </div>
        <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-tertiary rotate-90 origin-left mt-10 whitespace-nowrap">Breathe Deep</span>
      </div>
    </main>
  );
};

export default JournalView;
