'use client';

import React from 'react';

interface TopAppBarProps {
  onProfileClick?: () => void;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ onProfileClick }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#fbf9f5]/80 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(22,53,38,0.06)] transition-all">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
                <div className="p-2 bg-gradient-to-tr from-tertiary to-primary rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-white text-xl">potted_plant</span>
                </div>
                <span className="text-2xl font-bold tracking-tighter text-primary font-outfit">Aura.</span>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[9px] font-label font-black text-secondary uppercase tracking-[0.2em]">Coherent</span>
                    </div>
                    <span className="text-[10px] text-primary/40 font-label font-bold uppercase transition-opacity">Verdant Sanctuary</span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-full hover:bg-tertiary/10 transition-colors text-tertiary">
                        <span className="material-symbols-outlined text-2xl font-light">settings</span>
                    </button>
                    <div 
                        onClick={onProfileClick}
                        className="w-10 h-10 rounded-full bg-tertiary/10 overflow-hidden border-2 border-tertiary/30 cursor-pointer hover:border-tertiary transition-colors shadow-sm"
                    >
                        <img 
                            alt="User profile" 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6NA9B0a2awVf4b0r22lc3TArhgwkfXiYroPX-WApXY0RSzvrOSg1AMeQpj1ppcpcs4lAf1f5gdBVd1xoyUigkRZ-COUaccyByi4EWB69m2OF62sm0EAH7DTF9nt7J2EUoXk7BHMyoAzDus-rY1upHJLVUru6ugy8HqGWCf7V_4e3AgPQBvm1sekdTiy0-WU0SZKrMz8N3WvKSAgc5e6r6TXRs1Dt_HwXxjsIfy02eAYyeQVQkdjl8gy3rkk0eQw_I_vtAOWYCTY0" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default TopAppBar;
