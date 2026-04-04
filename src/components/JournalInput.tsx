'use client';

import React, { useState } from 'react';

interface JournalInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const JournalInput: React.FC<JournalInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-32 px-6">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-breathe" />
      
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How does your inner world feel today?"
          className="w-full h-80 bg-surface-container-lowest/40 serenity-glass rounded-xl p-12 text-2xl font-manrope font-extralight text-on-surface placeholder:text-on-surface/20 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
        />
        
        <div className="absolute bottom-8 right-8 flex items-center gap-6">
          <span className="text-on-surface/20 font-label text-xs tracking-widest uppercase">
            {text.length} characters
          </span>
          <button
            onClick={() => onAnalyze(text)}
            disabled={isAnalyzing || !text.trim()}
            className="px-10 py-4 bg-primary text-surface-container-lowest rounded-full font-manrope font-semibold tracking-wide hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all indigo-glow"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-surface-container-lowest animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-surface-container-lowest animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-surface-container-lowest animate-bounce [animation-delay:0.4s]" />
              </div>
            ) : (
              'Seek Clarity'
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-12 text-on-surface/30">
        {['Reflective', 'Honest', 'Unfiltered'].map((tag) => (
          <div key={tag} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
            <span className="text-xs font-label tracking-widest uppercase">{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalInput;
