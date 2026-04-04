'use client';

import React, { useState, useEffect } from 'react';

interface ProfileViewProps {
  showToast: (msg: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ showToast }) => {
  const [profileData, setProfileData] = useState({
    name: "Wanderer",
    email: "wanderer@aura.app",
    intention: "Inner Peace"
  });
  const [stats, setStats] = useState({ entries: 0, streak: 3 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('aura_profile');
      if (savedProfile) setProfileData(JSON.parse(savedProfile));

      // In a real app, this would come from a DB, but we'll use a placeholder for now
      // or track it via entries saved in localStorage
      const savedEntries = JSON.parse(localStorage.getItem('aura_entries') || '[]');
      setStats(prev => ({ ...prev, entries: savedEntries.length }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('aura_profile', JSON.stringify(profileData));
    showToast("Profile settings updated successfully.");
  };

  return (
    <main className="pt-36 pb-40 px-6 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center gap-8 ethereal-glass p-10 rounded-[3rem] shadow-xl shadow-primary/5 border border-primary/5">
        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-tertiary to-primary p-1">
            <div className="w-full h-full rounded-full border-4 border-white overflow-hidden relative">
              <img 
                alt="User profile" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6NA9B0a2awVf4b0r22lc3TArhgwkfXiYroPX-WApXY0RSzvrOSg1AMeQpj1ppcpcs4lAf1f5gdBVd1xoyUigkRZ-COUaccyByi4EWB69m2OF62sm0EAH7DTF9nt7J2EUoXk7BHMyoAzDus-rY1upHJLVUru6ugy8HqGWCf7V_4e3AgPQBvm1sekdTiy0-WU0SZKrMz8N3WvKSAgc5e6r6TXRs1Dt_HwXxjsIfy02eAYyeQVQkdjl8gy3rkk0eQw_I_vtAOWYCTY0" 
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">settings</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-tertiary text-white p-2 rounded-full border-4 border-white shadow-sm">
            <span className="material-symbols-outlined text-sm">potted_plant</span>
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h2 className="text-4xl font-outfit text-primary font-light mb-2">{profileData.name}</h2>
          <p className="text-secondary font-medium flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Pursuing: {profileData.intention}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-primary/5 text-center min-w-[100px]">
            <span className="material-symbols-outlined text-tertiary mx-auto mb-2 block">workspace_premium</span>
            <p className="text-2xl font-bold text-primary">{stats.streak}</p>
            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest font-label">Day Streak</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-primary/5 text-center min-w-[100px]">
            <span className="material-symbols-outlined text-tertiary mx-auto mb-2 block">auto_stories</span>
            <p className="text-2xl font-bold text-primary">{stats.entries}</p>
            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest font-label">Entries</p>
          </div>
        </div>
      </section>

      {/* Settings Form */}
      <section className="organic-card p-10 rounded-[3rem] shadow-lg shadow-primary/5 border border-primary/5">
        <h3 className="text-2xl font-headline font-light text-primary mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary">person</span> 
          Account Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-2 font-label">Preferred Name</label>
            <input 
              type="text" 
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full bg-background-soft/50 border-none rounded-2xl px-6 py-4 text-primary font-medium focus:ring-2 focus:ring-tertiary/20 transition-shadow outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-2 font-label">Email Identity</label>
            <input 
              type="email" 
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full bg-background-soft/50 border-none rounded-2xl px-6 py-4 text-primary font-medium focus:ring-2 focus:ring-tertiary/20 transition-shadow outline-none"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-2 font-label">Current Intention / Focus</label>
            <input 
              type="text" 
              name="intention"
              value={profileData.intention}
              onChange={handleChange}
              className="w-full bg-background-soft/50 border-none rounded-2xl px-6 py-4 text-primary font-medium focus:ring-2 focus:ring-tertiary/20 transition-shadow outline-none"
              placeholder="e.g., Finding Balance, Career Growth, Inner Peace"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-primary/5">
          <button 
            onClick={handleSaveProfile}
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Aesthetic Ornament */}
      <div className="text-center py-10 opacity-20 group">
        <span className="material-symbols-outlined text-primary text-4xl group-hover:rotate-180 transition-transform duration-1000">filter_vintage</span>
        <p className="font-label text-[10px] uppercase tracking-[0.5em] mt-4">Nurture Your Growth</p>
      </div>
    </main>
  );
};

export default ProfileView;
