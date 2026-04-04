'use client';

import React from 'react';

const MedicalView: React.FC = () => {
  return (
    <main className="pt-32 pb-40 px-6 max-w-5xl mx-auto space-y-16">
      {/* Background Ambient Elements - scoped closely */}
      <div className="fixed top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#accfb8]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#446a74]/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full animate-in fade-in duration-700">
        {/* Hero Section */}
        <section className="relative mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-3">
              <span className="text-secondary tracking-[0.2em] uppercase text-[11px] font-bold block">Medical Sanctuary</span>
              <h2 className="text-5xl md:text-6xl font-light tracking-tight text-primary leading-tight">
                Safety <span className="font-bold text-accent-green italic">Sanctuary</span>
              </h2>
            </div>
            <p className="max-w-md text-on-surface-variant font-medium text-lg leading-relaxed md:text-right">
              Thoughtfully curated guidance designed to restore balance and provide clinical clarity during moments of overwhelm.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Triage Guide (Bento Left) */}
          <div className="lg:col-span-7 space-y-10">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-primary/40 font-black px-2">Assessment Matrix</h3>
            
            <div className="space-y-8">
              {/* High Distress (Critical) */}
              <div className="organic-card distress-glow p-10 rounded-[2rem] border-red-50 flex flex-col gap-8 transition-all duration-500 hover:shadow-xl bg-white/60 backdrop-blur-md">
                <div className="flex items-center gap-5">
                  <div className="bg-red-50 p-4 rounded-2xl">
                    <span className="material-symbols-outlined text-error-text text-3xl">emergency_home</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl font-extrabold text-error-text">High Distress</h4>
                      <span className="bg-red-100 text-red-800 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-black">Critical</span>
                    </div>
                  </div>
                </div>
                <p className="text-on-surface-variant text-lg leading-relaxed">If you are experiencing acute physical distress, self-harm impulses, or intense breathing difficulties, please prioritize immediate clinical support.</p>
                <button className="w-full py-4 bg-error-text text-white font-bold tracking-widest uppercase text-xs rounded-full shadow-lg shadow-red-900/20 active:scale-[0.98] transition-transform">
                  Activate Urgent Protocol
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Moderate Distress */}
                <div className="organic-card p-8 rounded-[2rem] flex flex-col gap-6 transition-all duration-500 hover:scale-[1.02] bg-white/60 backdrop-blur-md">
                  <div className="h-14 w-14 bg-secondary/5 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-2xl">psychology</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-3">Moderate Balance</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Persistent unease or sleep disruptions. Stabilization protocols are recommended.</p>
                  </div>
                  <a className="mt-auto text-secondary text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all" href="#">
                    Begin Guide <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                  </a>
                </div>

                {/* Low Distress */}
                <div className="organic-card p-8 rounded-[2rem] flex flex-col gap-6 transition-all duration-500 hover:scale-[1.02] bg-white/60 backdrop-blur-md">
                  <div className="h-14 w-14 bg-accent-green/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-3">Routine Care</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">General maintenance or mild stress. Explore grounding sensory modules.</p>
                  </div>
                  <a className="mt-auto text-primary text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all" href="#">
                    Open Tools <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Helplines (Bento Right) */}
          <div className="lg:col-span-5 space-y-10">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-primary/40 font-black px-2">Support Channels</h3>
            
            <div className="organic-card rounded-[2.5rem] p-4 flex flex-col gap-4 bg-white/60 backdrop-blur-md">
              {/* iCall Card */}
              <div className="bg-background-soft rounded-[1.5rem] p-8 transition-all hover:bg-white hover:shadow-sm group border border-transparent hover:border-accent-green/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-3xl font-light text-primary">iCall</h4>
                    <span className="text-accent-green text-[9px] uppercase font-black tracking-[0.2em]">Clinical Counseling</span>
                  </div>
                  <span className="material-symbols-outlined text-accent-green group-hover:-translate-y-1 transition-transform">support_agent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono tracking-tight text-primary">9152987821</span>
                  <button className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-xl">call</span>
                  </button>
                </div>
              </div>

              {/* Vandrevala Card */}
              <div className="bg-background-soft rounded-[1.5rem] p-8 transition-all hover:bg-white hover:shadow-sm group border border-transparent hover:border-accent-green/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-3xl font-light text-primary">Vandrevala</h4>
                    <span className="text-accent-green text-[9px] uppercase font-black tracking-[0.2em]">24/7 Crisis Care</span>
                  </div>
                  <span className="material-symbols-outlined text-accent-green group-hover:-translate-y-1 transition-transform">verified_user</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono tracking-tight text-primary">9999666555</span>
                  <button className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-xl">call</span>
                  </button>
                </div>
              </div>

              {/* Abstract Visual */}
              <div className="mt-4 p-4 text-center">
                <div className="relative h-44 rounded-[2rem] overflow-hidden mb-6 group">
                  <img 
                    alt="Verdant Nature" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU6BX9zAWaUVDIiaY-z1O96_jhdy82IMFbsWGOBhc4RwXeuhrrhymy62BmMRDaO0nO-ZXPK7_z2RC3XxQ5n3NOgxofk3mHg8T2RyCqnrCmnH1qy1_BYgkJebC7bA4UDUMAzPYbeWmwSsQ_jQCWSGe8tfzWRHfSrl6N70gcmBQCxkAK3lJ9_vWjoCGSdaPOqe_83BO41amwLGJ0dHrkIdk207qCKXCc2UK7EJSLFzm1vHmTwEQysq-euPXdYb7VFqb0bsuEd1jaPRY"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                </div>
                <p className="text-[11px] text-on-surface-variant/70 font-medium italic">"In every breath, nature finds its center."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MedicalView;
