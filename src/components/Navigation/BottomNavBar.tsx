'use client';

import React from 'react';

interface BottomNavBarProps {
  activeTab: 'journal' | 'dashboard' | 'medical' | 'profile';
  onTabChange: (tab: 'journal' | 'dashboard' | 'medical' | 'profile') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'journal', label: 'Journal', icon: 'book_5' },
    { id: 'dashboard', label: 'Atmosphere', icon: 'temp_preferences_custom' },
    { id: 'medical', label: 'Sanctuary', icon: 'eco' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ] as const;

  return (
    <nav className="fixed bottom-0 md:bottom-8 left-1/2 -translate-x-1/2 w-full md:w-[90%] max-w-lg h-24 md:h-20 flex justify-around items-center px-6 pb-2 md:pb-0 bg-[#fbf9f5]/90 backdrop-blur-2xl z-50 md:rounded-full shadow-[0_20px_50px_rgba(22,53,38,0.15)] border-t md:border border-primary/5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center p-3 transition-all duration-500 relative group ${
              activeTab === item.id 
                ? 'text-primary scale-110' 
                : 'text-secondary/60 hover:text-primary active:scale-90'
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute -top-1 w-8 h-1 bg-tertiary rounded-full animate-in zoom-in-50 duration-300"></div>
            )}
            <span className={`material-symbols-outlined text-2xl mb-1 ${activeTab === item.id ? 'font-bold' : 'font-light'}`}>
              {item.icon}
            </span>
            <span className={`font-label text-[9px] uppercase tracking-widest font-black transition-opacity ${activeTab === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
              {item.label}
            </span>
          </button>
        ))}
    </nav>
  );
};

export default BottomNavBar;
