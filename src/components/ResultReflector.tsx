'use client';

import React from 'react';
import { WellnessAnalysis } from '@/lib/wellness-service';

interface ResultReflectorProps {
  analysis: WellnessAnalysis;
  onReset: () => void;
}

const ResultReflector: React.FC<ResultReflectorProps> = ({ analysis, onReset }) => {
  if (!analysis) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto animate-in zoom-in-95 fade-in duration-700">
      <div className="ethereal-glass rounded-[3rem] p-12 md:p-16 shadow-[0_40px_80px_-20px_rgba(22,53,38,0.15)] border border-primary/5 relative overflow-hidden group">
        {/* Animated Background Element */}
        <div 
          className="absolute inset-0 opacity-10 bg-gradient-to-tr from-primary via-tertiary to-secondary group-hover:scale-110 transition-transform duration-[3000ms]" 
          style={{ filter: 'blur(100px)' }}
        />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">lens_blur</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-label text-primary/40 font-black">Ethereal Analysis</p>
                <p className="text-primary font-headline font-bold">Resonance Found</p>
              </div>
            </div>
            <button 
              onClick={onReset}
              className="p-3 rounded-full hover:bg-primary/5 transition-colors text-secondary hover:rotate-90 duration-500"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Emotional Summary */}
          <div className="mb-16 text-center">
            <p className="text-3xl md:text-5xl font-outfit font-light text-primary leading-tight mb-8">
              "{analysis.summary}"
            </p>
            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border ${analysis.severity === 'high' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-primary/5 border-primary/10 text-primary'}`}>
              <span className={`w-2 h-2 rounded-full ${analysis.severity === 'high' ? 'bg-red-500 animate-pulse' : 'bg-primary'}`}></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-label font-black">{analysis.severity} Intensity</span>
            </div>
          </div>

          {/* Emotion Spectrum */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {analysis.emotions?.map((emotion: any) => (
              <div key={emotion.label} className="organic-card p-6 rounded-3xl text-center group/emotion transition-all hover:shadow-lg">
                <p className="text-[10px] font-label tracking-widest uppercase text-secondary/60 mb-2 group-hover/emotion:text-primary transition-colors">
                  {emotion.label}
                </p>
                <p className="text-3xl font-outfit font-light text-primary">
                  {Math.round(emotion.score * 100)}%
                </p>
              </div>
            ))}
          </div>

          {/* Deep Insight */}
          <div className="bg-primary/5 rounded-[2rem] p-10 border border-primary/5 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <h4 className="text-[10px] font-label tracking-[0.3em] uppercase text-primary font-bold">Deeper Reflection</h4>
             </div>
             <p className="text-primary/80 font-body text-lg leading-relaxed italic">
               {analysis.insight}
             </p>
          </div>

          {/* Interaction */}
          <div className="mt-12 flex justify-center">
            <button 
              onClick={onReset}
              className="px-12 py-5 rounded-full bg-primary text-white font-headline font-bold tracking-wide shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              Acknowledge & Continue
              <span className="material-symbols-outlined">done_all</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultReflector;
