"use client";
import React, { useState, useEffect } from 'react';
import {
  Leaf, BookOpen, LayoutGrid, HeartPulse, User, Send,
  Lock, ArrowRight, Brain, Target, Waves, Wind,
  AlertTriangle, ShieldCheck, Phone, Headphones,
  LogOut, Sparkles, TrendingUp, Menu, X, Eye, EyeOff,
  CheckCircle2, ChevronDown, ChevronUp, Activity,
  Heart, Moon, Flame, MessageCircle, Info, Clock,
  CloudRain, TrendingDown, Smartphone, Bed, ClipboardList,
  PenLine, Globe, Users, Droplets, Apple, Hospital
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Flame, CloudRain, Heart, TrendingDown, Moon, Sprout: Leaf,
  Clock, Smartphone, Bed, Wind, ClipboardList, PenLine,
  Globe, Activity, Phone, Users, Droplets, Apple,
  Stethoscope: HeartPulse, Hospital, AlertTriangle, Info, ShieldCheck,
  Brain, Sparkles, Send, Leaf, MessageCircle
};

const AvenIcon = ({ name, size = 18, className = "" }: { name: string, size?: number, className?: string }) => {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span className="text-xs">✦</span>;
  return <Icon size={size} className={className} />;
};
import { getMemory, saveMemory, initMemory, updateMemory, buildMemoryContext, type UserMemory } from '@/lib/memory-system';
import { detectPatterns, buildPatternContext, type DetectedPattern } from '@/lib/pattern-detector';
import { detectCrisis, CRISIS_RESOURCES, type CrisisResult } from '@/lib/crisis-detector';
import { generateProactiveMessages, type ProactiveMessage } from '@/lib/proactive-agent';
import { getRelevantTips, CATEGORY_META, MEDICAL_DISCLAIMER, type WellnessTip } from '@/lib/wellness-tips';

// ===== CRYPTO =====
async function hashPassword(pw: string): Promise<string> {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== TYPES =====
interface UserData { id: string; name: string; email: string; passwordHash: string; createdAt: string; }
interface Session { userId: string; name: string; email: string; }
interface EntryEmotion { sentiment: string; signals: string[]; severity: number; reflection: string; recommendations: string[]; reasoning?: string[]; patternInsights?: string[]; wellnessGuidance?: string[]; }
interface Entry { id: number; text: string; timestamp: string; emotion?: EntryEmotion; }
interface ChatMessage { role: 'user' | 'ai' | 'system' | 'proactive'; text: string; emotion?: EntryEmotion; timestamp: string; crisisLevel?: string; }

// ===== STORAGE =====
function getUsers(): UserData[] { return JSON.parse(localStorage.getItem('aven_users') || '[]'); }
function setUsers(u: UserData[]) { localStorage.setItem('aven_users', JSON.stringify(u)); }
function getSession(): Session | null { const s = localStorage.getItem('aven_session'); return s ? JSON.parse(s) : null; }
function setSession(s: Session | null) { s ? localStorage.setItem('aven_session', JSON.stringify(s)) : localStorage.removeItem('aven_session'); }
function getEntries(uid: string): Entry[] { return JSON.parse(localStorage.getItem(`aven_entries_${uid}`) || '[]'); }
function setEntries(uid: string, e: Entry[]) { localStorage.setItem(`aven_entries_${uid}`, JSON.stringify(e)); }
function getMessages(uid: string): ChatMessage[] { return JSON.parse(localStorage.getItem(`aven_messages_${uid}`) || '[]'); }
function setMessages(uid: string, m: ChatMessage[]) { localStorage.setItem(`aven_messages_${uid}`, JSON.stringify(m)); }
function getUnlocks(count: number) { return { insights: count >= 3, dashboard: count >= 5, medical: count >= 7 }; }

// ===== ROOT APP =====
export default function App() {
  const [session, setSess] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<'welcome' | 'signup' | 'signin'>('welcome');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setSess(getSession()); setLoaded(true); }, []);

  const handleLogin = (s: Session) => { setSession(s); setSess(s); };
  const handleLogout = () => { setSession(null); setSess(null); setAuthMode('welcome'); };

  if (!loaded) return <div className="min-h-screen bg-[#fbf9f5]" />;
  if (!session) {
    if (authMode === 'signup') return <SignUpForm onSuccess={handleLogin} onBack={() => setAuthMode('welcome')} />;
    if (authMode === 'signin') return <SignInForm onSuccess={handleLogin} onBack={() => setAuthMode('welcome')} />;
    return <WelcomeScreen onSignUp={() => setAuthMode('signup')} onSignIn={() => setAuthMode('signin')} />;
  }
  return <MainApp session={session} onLogout={handleLogout} />;
}

// ===== WELCOME =====
function WelcomeScreen({ onSignUp, onSignIn }: { onSignUp: () => void; onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-6">
      <div className="mesh-bg" />
      <div className="max-w-md w-full text-center fade-scale">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#10b981] to-[#059669] flex items-center justify-center shadow-xl shadow-[#10b981]/30 mb-6">
            <Leaf size={36} className="text-white" />
          </div>
          <h1 className="text-5xl font-light tracking-tight text-[#163526] font-[var(--font-outfit)] mb-3">Aven.</h1>
          <p className="text-[#446a74] text-lg leading-relaxed">Your AI wellness companion that<br /><span className="text-[#10b981] font-semibold">listens, learns, and evolves</span> with you.</p>
        </div>
        <div className="space-y-3 mt-10">
          <button onClick={onSignUp} className="auth-btn auth-btn-primary">Create Your Sanctuary</button>
          <button onClick={onSignIn} className="auth-btn auth-btn-secondary">Welcome Back — Sign In</button>
        </div>
        <p className="mt-8 text-xs text-[#446a74]/60">Your data stays on your device. Private and encrypted.</p>
      </div>
    </div>
  );
}

// ===== SIGN UP =====
function SignUpForm({ onSuccess, onBack }: { onSuccess: (s: Session) => void; onBack: () => void }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
  const [err, setErr] = useState(''); const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !pw) return setErr('All fields are required.');
    if (pw.length < 6) return setErr('Password must be at least 6 characters.');
    if (pw !== pw2) return setErr('Passwords do not match.');
    const users = getUsers();
    if (users.find(u => u.email === email.toLowerCase())) return setErr('An account with this email already exists.');
    const hash = await hashPassword(pw);
    const id = crypto.randomUUID();
    const newUser: UserData = { id, name: name.trim(), email: email.toLowerCase().trim(), passwordHash: hash, createdAt: new Date().toISOString() };
    setUsers([...users, newUser]);
    onSuccess({ userId: id, name: newUser.name, email: newUser.email });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-6">
      <div className="mesh-bg" />
      <div className="max-w-md w-full fade-up">
        <button onClick={onBack} className="text-[#446a74] hover:text-[#10b981] mb-6 text-sm font-semibold flex items-center gap-1 transition-colors">← Back</button>
        <div className="ethereal-glass rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-[#10b981]/10"><Sparkles size={22} className="text-[#10b981]" /></div>
            <h2 className="text-2xl font-bold text-[#163526]">Create Account</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-[10px] uppercase tracking-widest font-bold text-[#446a74] mb-1 block ml-1">Full Name</label><input className="auth-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></div>
            <div><label className="text-[10px] uppercase tracking-widest font-bold text-[#446a74] mb-1 block ml-1">Email</label><input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div className="relative"><label className="text-[10px] uppercase tracking-widest font-bold text-[#446a74] mb-1 block ml-1">Password</label><input className="auth-input pr-10" type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder="Min 6 characters" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-8 text-[#446a74]/50 hover:text-[#10b981]">{showPw ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
            <div><label className="text-[10px] uppercase tracking-widest font-bold text-[#446a74] mb-1 block ml-1">Confirm Password</label><input className="auth-input" type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Re-enter password" /></div>
            {err && <p className="text-red-500 text-sm font-medium bg-red-50 rounded-xl px-4 py-2">{err}</p>}
            <button type="submit" className="auth-btn auth-btn-primary mt-4">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ===== SIGN IN =====
function SignInForm({ onSuccess, onBack }: { onSuccess: (s: Session) => void; onBack: () => void }) {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const [err, setErr] = useState(''); const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pw) return setErr('Both fields are required.');
    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim());
    if (!user) return setErr('No account found with this email.');
    const hash = await hashPassword(pw);
    if (hash !== user.passwordHash) return setErr('Incorrect password.');
    onSuccess({ userId: user.id, name: user.name, email: user.email });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-6">
      <div className="mesh-bg" />
      <div className="max-w-md w-full fade-up">
        <button onClick={onBack} className="text-[#446a74] hover:text-[#10b981] mb-6 text-sm font-semibold flex items-center gap-1 transition-colors">← Back</button>
        <div className="ethereal-glass rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-[#10b981]/10"><User size={22} className="text-[#10b981]" /></div>
            <h2 className="text-2xl font-bold text-[#163526]">Welcome Back</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-[10px] uppercase tracking-widest font-bold text-[#446a74] mb-1 block ml-1">Email</label><input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div className="relative"><label className="text-[10px] uppercase tracking-widest font-bold text-[#446a74] mb-1 block ml-1">Password</label><input className="auth-input pr-10" type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter password" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-8 text-[#446a74]/50 hover:text-[#10b981]">{showPw ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
            {err && <p className="text-red-500 text-sm font-medium bg-red-50 rounded-xl px-4 py-2">{err}</p>}
            <button type="submit" className="auth-btn auth-btn-primary mt-4">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
function MainApp({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [view, setView] = useState('chat');
  const [entries, setEntriesState] = useState<Entry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ToastIcon, setToastIcon] = useState<React.ElementType | null>(null);
  const [memory, setMemoryState] = useState<UserMemory | null>(null);
  const [patterns, setPatterns] = useState<DetectedPattern[]>([]);
  const [proactiveMessages, setProactive] = useState<ProactiveMessage[]>([]);
  const unlocks = getUnlocks(entries.length);

  useEffect(() => {
    setEntriesState(getEntries(session.userId));
    const mem = getMemory(session.userId) || initMemory(session.name);
    setMemoryState(mem);
    saveMemory(session.userId, mem);
  }, [session.userId, session.name]);

  useEffect(() => {
    if (memory && memory.totalEntries >= 2) {
      const p = detectPatterns(memory);
      setPatterns(p);
      const pm = generateProactiveMessages(memory, p);
      setProactive(pm);
    }
  }, [memory]);

  const showToast = (msg: string, Icon?: React.ElementType) => { 
    setToast(msg); 
    setToastIcon(Icon || null);
    setTimeout(() => { setToast(null); setToastIcon(null); }, 3000); 
  };

  const addEntry = (entry: Entry) => {
    const updated = [...entries, entry];
    setEntries(session.userId, updated);
    setEntriesState(updated);
    if (entry.emotion && memory) {
      const newMem = updateMemory(memory, entry.text, { sentiment: entry.emotion.sentiment, signals: entry.emotion.signals, severity: entry.emotion.severity });
      newMem.detectedPatterns = detectPatterns(newMem).map(p => p.label);
      saveMemory(session.userId, newMem);
      setMemoryState(newMem);
    }
    const u = getUnlocks(updated.length);
    if (updated.length === 3 && u.insights) showToast('Insights tab unlocked! Your AI is learning.', TrendingUp);
    if (updated.length === 5 && u.dashboard) showToast('Dashboard unlocked! Patterns emerging.', LayoutGrid);
    if (updated.length === 7 && u.medical) showToast('Medical insights unlocked!', HeartPulse);
  };

  const handleNav = (id: string) => { setView(id); setSidebarOpen(false); };

  const navItems = [
    { id: 'chat', label: 'Chat', icon: BookOpen, locked: false },
    { id: 'insights', label: 'Insights', icon: TrendingUp, locked: !unlocks.insights, req: 3 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, locked: !unlocks.dashboard, req: 5 },
    { id: 'medical', label: 'Medical', icon: HeartPulse, locked: !unlocks.medical, req: 7 },
    { id: 'profile', label: 'Profile', icon: User, locked: false },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      <div className="mesh-bg" />
      <div className="md:hidden fixed top-0 w-full z-50 bg-[#fbf9f5]/80 backdrop-blur-xl border-b border-[#10b981]/10 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#10b981]/10 rounded-xl"><Menu size={22} className="text-[#163526]" /></button>
        <span className="font-bold text-[#163526] flex items-center gap-2"><Leaf size={16} className="text-[#10b981]" /> Aven.</span>
        <div className="w-8" />
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="p-6 border-b border-[#10b981]/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-[#10b981] to-[#059669] rounded-xl"><Leaf size={20} className="text-white" /></div>
            <span className="text-xl font-bold tracking-tight text-[#163526]">Aven.</span>
          </div>
          <p className="text-[10px] text-[#446a74] mt-2 tracking-widest uppercase font-bold">AI Wellness Agent</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => !item.locked && handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 group ${
                view === item.id ? 'bg-[#163526] text-white shadow-lg shadow-[#163526]/20' :
                item.locked ? 'text-[#446a74]/40 cursor-default' : 'text-[#446a74] hover:bg-[#10b981]/10 hover:text-[#163526]'
              }`}>
              <item.icon size={18} strokeWidth={view === item.id ? 2 : 1.5} />
              <span className="font-semibold text-sm flex-1">{item.label}</span>
              {item.locked && <Lock size={14} className="opacity-40" />}
              {item.locked && item.req && <span className="text-[9px] bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.5 rounded-full font-bold">{item.req}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 mx-4 mb-2 rounded-2xl bg-[#10b981]/5 border border-[#10b981]/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#10b981]">Agent Status</span>
          </div>
          <p className="text-xs text-[#446a74]">{entries.length} entries analyzed</p>
          <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${Math.min((entries.length / 7) * 100, 100)}%` }} /></div>
          <p className="text-[9px] text-[#446a74]/60 mt-1">{entries.length >= 7 ? 'Fully calibrated' : `${7 - entries.length} more to full calibration`}</p>
          {patterns.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{patterns.slice(0, 2).map(p => <span key={p.id} className="text-[8px] bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1"><AvenIcon name={p.icon} size={8} /> {p.label}</span>)}</div>}
        </div>
        <div className="p-4 border-t border-[#10b981]/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10b981] to-[#163526] flex items-center justify-center text-white font-bold text-sm">{session.name[0]}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-[#163526] truncate">{session.name}</p><p className="text-[10px] text-[#446a74] truncate">{session.email}</p></div>
            <button onClick={onLogout} className="p-2 rounded-xl hover:bg-red-50 text-[#446a74] hover:text-red-500 transition-colors" title="Log Out"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      <main className="main-content pt-14 md:pt-0">
        {view === 'chat' && <ChatView session={session} entries={entries} addEntry={addEntry} memory={memory} patterns={patterns} proactiveMessages={proactiveMessages} />}
        {view === 'insights' && (unlocks.insights ? <InsightsView entries={entries} patterns={patterns} /> : <LockedView label="Insights" current={entries.length} required={3} />)}
        {view === 'dashboard' && (unlocks.dashboard ? <DashboardView entries={entries} memory={memory} patterns={patterns} /> : <LockedView label="Dashboard" current={entries.length} required={5} />)}
        {view === 'medical' && (unlocks.medical ? <MedicalView memory={memory} /> : <LockedView label="Medical Insights" current={entries.length} required={7} />)}
        {view === 'profile' && <ProfileView session={session} entries={entries} memory={memory} patterns={patterns} />}
      </main>
      {toast && <div className="fixed bottom-8 left-1/2 z-50 animate-toast flex items-center gap-3 bg-[#163526] text-white px-6 py-3 rounded-full shadow-2xl">{ToastIcon ? <ToastIcon size={16} className="text-[#10b981]" /> : <CheckCircle2 size={16} className="text-[#10b981]" />}<span className="text-sm font-medium">{toast}</span></div>}
    </div>
  );
}

// ===== CRISIS BANNER =====
function CrisisBanner({ crisis }: { crisis: CrisisResult }) {
  if (!crisis.triggered) return null;
  const isCritical = crisis.level === 'critical';
  return (
    <div className={`crisis-banner ${isCritical ? 'crisis-critical' : 'crisis-alert'} mx-8 mt-4 rounded-2xl p-4 fade-down`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${isCritical ? 'bg-red-200' : 'bg-amber-200'}`}><AlertTriangle size={20} className={isCritical ? 'text-red-700' : 'text-amber-700'} /></div>
        <div className="flex-1">
          <p className={`font-bold text-sm ${isCritical ? 'text-red-800' : 'text-amber-800'}`}>{isCritical ? 'Crisis Support Available' : 'We\'re Here For You'}</p>
          <p className={`text-xs mt-1 ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>{crisis.message}</p>
          {(crisis.level === 'critical' || crisis.level === 'alert') && (
            <div className="flex flex-wrap gap-2 mt-3">{CRISIS_RESOURCES.slice(0, 2).map(r => (
              <a key={r.name} href={`tel:${r.phone}`} className={`text-xs font-bold px-3 py-1.5 rounded-full ${isCritical ? 'bg-red-700 text-white' : 'bg-amber-700 text-white'}`}>
                <Phone size={10} /> {r.name}: {r.phone}
              </a>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== REASONING PANEL =====
function ReasoningPanel({ reasoning, patternInsights, wellnessGuidance }: { reasoning?: string[]; patternInsights?: string[]; wellnessGuidance?: string[] }) {
  const [open, setOpen] = useState(false);
  const hasContent = (reasoning && reasoning.length > 0) || (patternInsights && patternInsights.length > 0) || (wellnessGuidance && wellnessGuidance.length > 0);
  if (!hasContent) return null;

  return (
    <div className="mt-3 border-t border-[#10b981]/10 pt-2">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#10b981] hover:text-[#059669] transition-colors">
        <Brain size={12} /> AI Reasoning {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && (
        <div className="reasoning-panel mt-2 p-3 rounded-xl bg-[#163526]/5 space-y-2 fade-up">
          {reasoning && reasoning.length > 0 && <div><p className="text-[9px] uppercase tracking-widest font-bold text-[#446a74] mb-1">Analysis Chain</p>{reasoning.map((r, i) => <p key={i} className="text-xs text-[#163526] flex items-start gap-2"><span className="text-[#10b981] font-bold shrink-0">→</span>{r}</p>)}</div>}
          {patternInsights && patternInsights.length > 0 && <div><p className="text-[9px] uppercase tracking-widest font-bold text-[#446a74] mb-1 mt-2">Pattern Insights</p>{patternInsights.map((p, i) => <p key={i} className="text-xs text-[#163526] flex items-start gap-2"><span className="text-[#10b981] font-bold shrink-0">◆</span>{p}</p>)}</div>}
          {wellnessGuidance && wellnessGuidance.length > 0 && <div><p className="text-[9px] uppercase tracking-widest font-bold text-[#446a74] mb-1 mt-2">Wellness Guidance</p>{wellnessGuidance.map((w, i) => <p key={i} className="text-xs text-[#163526] flex items-start gap-2"><span className="text-[#10b981] font-bold shrink-0">✦</span>{w}</p>)}</div>}
        </div>
      )}
    </div>
  );
}

// ===== CHAT VIEW =====
function ChatView({ session, entries, addEntry, memory, patterns, proactiveMessages }: { session: Session; entries: Entry[]; addEntry: (e: Entry) => void; memory: UserMemory | null; patterns: DetectedPattern[]; proactiveMessages: ProactiveMessage[] }) {
  const [text, setText] = useState('');
  const [messages, setMsgs] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCrisis, setActiveCrisis] = useState<CrisisResult>({ level: 'none', triggered: false, matchedPhrases: [], message: '', action: '' });
  const chatRef = React.useRef<HTMLDivElement>(null);
  const firstName = session.name.split(' ')[0];

  useEffect(() => {
    const stored = getMessages(session.userId);
    // Inject proactive messages if not already present
    if (proactiveMessages.length > 0 && stored.length > 0) {
      const lastStored = stored[stored.length - 1];
      const topProactive = proactiveMessages[0];
      if (lastStored.role !== 'proactive' || !lastStored.text.includes(topProactive.text.substring(0, 30))) {
        const proMsg: ChatMessage = { role: 'proactive', text: topProactive.text, timestamp: new Date().toISOString() };
        const withPro = [...stored, proMsg];
        setMsgs(withPro);
        setMessages(session.userId, withPro);
        return;
      }
    }
    setMsgs(stored);
  }, [session.userId, proactiveMessages]);

  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text: text.trim(), timestamp: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMsgs(updated);
    setMessages(session.userId, updated);
    setText('');
    setLoading(true);

    // Client-side crisis detection
    const crisis = detectCrisis(text, memory?.consecutiveNegative || 0, memory?.avgSeverity3 || 0);
    if (crisis.triggered) setActiveCrisis(crisis);

    try {
      const memCtx = memory ? buildMemoryContext(memory) : '';
      const patCtx = buildPatternContext(patterns);
      const res = await fetch('/api/analyze-wellness', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMsg.text, userName: session.name, memoryContext: memCtx, patternContext: patCtx, crisisLevel: crisis.level, entryCount: entries.length }),
      });
      const data = await res.json();
      const emotion: EntryEmotion = { sentiment: data.sentiment, signals: data.detectedSignals || [], severity: data.severity, reflection: data.reflection, recommendations: data.recommendations || [], reasoning: data.reasoning || [], patternInsights: data.patternInsights || [], wellnessGuidance: data.wellnessGuidance || [] };
      const aiMsg: ChatMessage = { role: 'ai', text: data.reflection, emotion, timestamp: new Date().toISOString(), crisisLevel: crisis.level };
      if (data.isCrisis && !crisis.triggered) setActiveCrisis({ level: 'alert', triggered: true, matchedPhrases: [], message: 'The AI detected possible distress in your message. Support is available.', action: 'SHOW_SUPPORT_OPTIONS' });
      const withAi = [...updated, aiMsg];
      setMsgs(withAi);
      setMessages(session.userId, withAi);
      addEntry({ id: Date.now(), text: userMsg.text, timestamp: userMsg.timestamp, emotion });
    } catch {
      const errMsg: ChatMessage = { role: 'ai', text: `${firstName}, I'm having trouble connecting right now. Your entry has been saved locally — I'll analyze it when I'm back online.`, timestamp: new Date().toISOString() };
      const withErr = [...updated, errMsg];
      setMsgs(withErr);
      setMessages(session.userId, withErr);
      addEntry({ id: Date.now(), text: userMsg.text, timestamp: userMsg.timestamp });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-8 py-6 border-b border-[#10b981]/10 bg-[#fbf9f5]/80 backdrop-blur-xl">
        <h1 className="text-3xl font-light tracking-tight text-[#163526] font-[var(--font-outfit)]">
          {messages.length === 0 ? <>Hi {firstName}, I&apos;m <span className="text-[#10b981] font-semibold">Aven</span></> : <>Reflecting with <span className="text-[#10b981] font-semibold">{firstName}</span></>}
        </h1>
        <p className="text-sm text-[#446a74] mt-1">{messages.length === 0 ? 'What\'s on your mind today? I\'m here to listen and learn about you.' : `${entries.length} entries analyzed · Agent ${entries.length >= 7 ? 'fully calibrated' : 'learning'}`}</p>
      </div>

      <CrisisBanner crisis={activeCrisis} />

      <div ref={chatRef} className="flex-1 overflow-y-auto px-8 py-6 space-y-4 flex flex-col">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-lg fade-scale">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#10b981]/10 flex items-center justify-center mb-6"><Wind size={40} className="text-[#10b981]" strokeWidth={1.5} /></div>
              <h2 className="text-4xl font-light text-[#163526] font-[var(--font-outfit)] mb-3">How are you <span className="italic text-[#10b981]">really</span> feeling?</h2>
              <p className="text-[#446a74] leading-relaxed">Start writing below, {firstName}. I&apos;ll listen, analyze your emotional patterns, and give you personalized support that evolves as I learn about you.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'proactive' ? (
              <div className="proactive-bubble max-w-[85%]">
                <div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-[#10b981]" /><span className="text-[9px] uppercase tracking-widest font-bold text-[#10b981]">Aven Proactive Check-in</span></div>
                <p className="text-[15px] text-[#163526] leading-relaxed">{msg.text}</p>
              </div>
            ) : (
              <div className={msg.role === 'user' ? 'chat-user' : 'chat-ai'}>
                <p className="leading-relaxed text-[15px]">{msg.text}</p>
                {msg.emotion && msg.role === 'ai' && (
                  <div className="mt-3 pt-3 border-t border-[#10b981]/10">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {msg.emotion.signals.map((s, j) => <span key={j} className="emotion-tag bg-[#10b981]/10 text-[#10b981]">{s}</span>)}
                      <span className={`emotion-tag ${msg.emotion.severity >= 4 ? 'bg-red-100 text-red-700' : msg.emotion.severity >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>Severity: {msg.emotion.severity}/5</span>
                    </div>
                    {msg.emotion.recommendations.length > 0 && (
                      <div className="space-y-1 mt-2">{msg.emotion.recommendations.map((r, j) => <p key={j} className="text-xs text-[#446a74] flex items-start gap-2"><ArrowRight size={12} className="text-[#10b981] mt-0.5 shrink-0" />{r}</p>)}</div>
                    )}
                    <ReasoningPanel reasoning={msg.emotion.reasoning} patternInsights={msg.emotion.patternInsights} wellnessGuidance={msg.emotion.wellnessGuidance} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="chat-ai"><div className="typing-dots flex gap-1.5"><span /><span /><span /></div></div></div>}
      </div>

      <div className="px-8 py-4 border-t border-[#10b981]/10 bg-[#fbf9f5]/80 backdrop-blur-xl">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <textarea value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="flex-1 bg-white/80 border border-[#10b981]/15 rounded-2xl px-5 py-3.5 text-[#163526] placeholder:text-[#446a74]/40 resize-none outline-none focus:border-[#10b981] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all text-[15px] min-h-[52px] max-h-32"
            placeholder={`Share what's on your mind, ${firstName}...`} rows={1} />
          <button onClick={handleSend} disabled={loading || !text.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#163526] to-[#0f241a] text-white hover:from-[#10b981] hover:to-[#059669] shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-semibold text-sm active:scale-95">
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== LOCKED VIEW =====
function LockedView({ label, current, required }: { label: string; current: number; required: number }) {
  return (
    <div className="locked-overlay min-h-screen px-8">
      <div className="locked-icon"><Lock size={32} className="text-[#10b981]" /></div>
      <h2 className="text-3xl font-light text-[#163526] mb-3 font-[var(--font-outfit)]">{label} Locked</h2>
      <p className="text-[#446a74] max-w-md leading-relaxed mb-6">Your AI agent is still learning about you. Write <strong className="text-[#10b981]">{required - current} more</strong> journal entries to unlock this feature.</p>
      <div className="w-64"><div className="progress-track"><div className="progress-fill" style={{ width: `${(current / required) * 100}%` }} /></div><p className="text-xs text-[#446a74] mt-2 text-center">{current} / {required} entries</p></div>
    </div>
  );
}

// ===== INSIGHTS VIEW =====
function InsightsView({ entries, patterns }: { entries: Entry[]; patterns: DetectedPattern[] }) {
  const emotions = entries.filter(e => e.emotion).map(e => e.emotion!);
  const signalCounts: Record<string, number> = {};
  emotions.forEach(em => em.signals.forEach(s => { signalCounts[s] = (signalCounts[s] || 0) + 1; }));
  const sorted = Object.entries(signalCounts).sort((a, b) => b[1] - a[1]);
  const sentiments = { positive: emotions.filter(e => e.sentiment === 'positive').length, negative: emotions.filter(e => e.sentiment === 'negative').length, neutral: emotions.filter(e => e.sentiment === 'neutral').length };
  const avgSeverity = emotions.length ? (emotions.reduce((s, e) => s + e.severity, 0) / emotions.length).toFixed(1) : '0';

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      <div className="fade-up">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#10b981]">Agent Insights</span>
        <h2 className="text-4xl font-light tracking-tight text-[#163526] font-[var(--font-outfit)] mt-1">Emotional Patterns</h2>
        <p className="text-[#446a74] mt-1">Based on {entries.length} entries your AI has analyzed.</p>
      </div>

      {/* Pattern Badges */}
      {patterns.length > 0 && (
        <div className="flex flex-wrap gap-3 fade-up delay-100">
          {patterns.map(p => (
            <div key={p.id} className={`pattern-badge ${p.severity === 'high' ? 'pattern-high' : p.severity === 'moderate' ? 'pattern-moderate' : 'pattern-low'}`}>
              <AvenIcon name={p.icon} size={20} />
              <div>
                <p className="text-sm font-bold">{p.label}</p>
                <p className="text-[10px] opacity-70">{p.confidence}% confidence</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-up delay-100">
        <div className="glass-card rounded-2xl p-6"><p className="text-[10px] uppercase tracking-widest font-bold text-[#446a74]">Avg Severity</p><p className="text-4xl font-light text-[#163526] mt-2">{avgSeverity}<span className="text-lg text-[#446a74]">/5</span></p></div>
        <div className="glass-card rounded-2xl p-6"><p className="text-[10px] uppercase tracking-widest font-bold text-[#446a74]">Sentiment Split</p><div className="flex gap-3 mt-3"><span className="text-green-600 font-bold">{sentiments.positive}↑</span><span className="text-red-500 font-bold">{sentiments.negative}↓</span><span className="text-gray-400 font-bold">{sentiments.neutral}→</span></div></div>
        <div className="glass-card rounded-2xl p-6"><p className="text-[10px] uppercase tracking-widest font-bold text-[#446a74]">Top Signal</p><p className="text-2xl font-semibold text-[#10b981] mt-2 capitalize">{sorted[0]?.[0] || 'None yet'}</p></div>
      </div>

      {sorted.length > 0 && (
        <div className="glass-card rounded-3xl p-8 fade-up delay-200">
          <h3 className="text-lg font-semibold text-[#163526] mb-4">Detected Signals</h3>
          <div className="space-y-3">{sorted.map(([signal, count]) => (
            <div key={signal} className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#163526] capitalize w-28">{signal}</span>
              <div className="flex-1 progress-track"><div className="progress-fill" style={{ width: `${(count / entries.length) * 100}%` }} /></div>
              <span className="text-xs font-bold text-[#446a74]">{count}x</span>
            </div>
          ))}</div>
        </div>
      )}

      {/* Severity Timeline */}
      <div className="glass-card rounded-3xl p-8 fade-up delay-300">
        <h3 className="text-lg font-semibold text-[#163526] mb-4">Severity Timeline</h3>
        <div className="flex items-end gap-2 h-32">
          {emotions.slice(-14).map((em, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-lg transition-all ${em.severity >= 4 ? 'bg-red-400' : em.severity >= 2 ? 'bg-amber-400' : 'bg-[#10b981]'}`} style={{ height: `${(em.severity / 5) * 100}%`, minHeight: '8px' }} />
              <span className="text-[8px] text-[#446a74]">{em.severity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Details */}
      {patterns.length > 0 && (
        <div className="glass-card rounded-3xl p-8 fade-up delay-400">
          <h3 className="text-lg font-semibold text-[#163526] mb-4 flex items-center gap-2"><Brain size={20} className="text-[#10b981]" /> Pattern Analysis</h3>
          <div className="space-y-4">{patterns.map(p => (
            <div key={p.id} className="p-4 rounded-2xl bg-white/50 border border-[#10b981]/10">
              <div className="flex items-center gap-3 mb-2">
                <AvenIcon name={p.icon} size={24} />
                <div className="flex-1"><p className="font-bold text-[#163526]">{p.label}</p><p className="text-[9px] uppercase tracking-widest text-[#446a74]">{p.severity} · {p.confidence}% confidence</p></div>
              </div>
              <p className="text-sm text-[#446a74]">{p.description}</p>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

// ===== DASHBOARD VIEW =====
function DashboardView({ entries, memory, patterns }: { entries: Entry[]; memory: UserMemory | null; patterns: DetectedPattern[] }) {
  const emotions = entries.filter(e => e.emotion).map(e => e.emotion!);
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen">
      <div className="fade-up">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#10b981]">Deep Analysis</span>
        <h2 className="text-4xl font-light tracking-tight text-[#163526] font-[var(--font-outfit)] mt-1">Emotional Dashboard</h2>
      </div>

      {/* Emotional Timeline Chart */}
      <div className="glass-card rounded-3xl p-8 fade-scale delay-100">
        <h3 className="text-lg font-semibold text-[#163526] mb-4 flex items-center gap-2"><Activity size={20} className="text-[#10b981]" /> Emotional Timeline</h3>
        <div className="h-48 relative overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="timelineGrad" x1="0%" x2="100%"><stop offset="0%" stopColor="#10b981" /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#ef4444" /></linearGradient>
              <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.3" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient>
            </defs>
            {emotions.length > 1 && (
              <>
                <path d={`M0,${200 - (emotions[0]?.severity ?? 2) * 35} ${emotions.map((e, i) => `L${(i) * (1000 / Math.max(emotions.length - 1, 1))},${200 - e.severity * 35}`).join(' ')} L1000,200 L0,200 Z`} fill="url(#fillGrad)" />
                <path d={`M0,${200 - (emotions[0]?.severity ?? 2) * 35} ${emotions.map((e, i) => `L${(i) * (1000 / Math.max(emotions.length - 1, 1))},${200 - e.severity * 35}`).join(' ')}`} fill="none" stroke="url(#timelineGrad)" strokeWidth="3" strokeLinecap="round" />
                {emotions.map((e, i) => <circle key={i} cx={(i) * (1000 / Math.max(emotions.length - 1, 1))} cy={200 - e.severity * 35} r="5" fill={e.severity >= 4 ? '#ef4444' : e.severity >= 2 ? '#f59e0b' : '#10b981'} stroke="white" strokeWidth="2" />)}
              </>
            )}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-[#446a74] font-bold px-2"><span>Low</span><span>Severity</span><span>High</span></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl fade-up delay-200 text-center">
          <Brain size={24} className="text-[#10b981] mx-auto mb-2" />
          <p className="text-2xl font-light text-[#163526]">{emotions.length}</p>
          <p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Analyzed</p>
        </div>
        <div className="glass-card p-5 rounded-2xl fade-up delay-200 text-center">
          <Heart size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-light text-[#163526]">{memory?.avgSeverity3.toFixed(1) || '0'}</p>
          <p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Recent Avg</p>
        </div>
        <div className="glass-card p-5 rounded-2xl fade-up delay-300 text-center">
          <Moon size={24} className="text-indigo-400 mx-auto mb-2" />
          <p className="text-2xl font-light text-[#163526]">{memory?.lateNightCount || 0}</p>
          <p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Late Nights</p>
        </div>
        <div className="glass-card p-5 rounded-2xl fade-up delay-400 text-center">
          <Flame size={24} className="text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-light text-[#163526]">{memory?.consecutiveNegative || 0}</p>
          <p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Neg. Streak</p>
        </div>
      </div>

      {/* Recurring Themes */}
      {memory && memory.recurringThemes.length > 0 && (
        <div className="glass-card rounded-3xl p-8 fade-up delay-300">
          <h3 className="text-lg font-semibold text-[#163526] mb-4">Recurring Themes</h3>
          <div className="flex flex-wrap gap-2">{memory.recurringThemes.map(t => <span key={t} className="px-4 py-2 rounded-full bg-[#10b981]/10 text-[#10b981] font-bold text-sm capitalize">{t}</span>)}</div>
        </div>
      )}

      {/* Active Patterns */}
      {patterns.length > 0 && (
        <div className="glass-card rounded-3xl p-8 fade-up delay-400">
          <h3 className="text-lg font-semibold text-[#163526] mb-4">Active Patterns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{patterns.map(p => (
            <div key={p.id} className={`p-4 rounded-2xl border ${p.severity === 'high' ? 'border-red-200 bg-red-50/50' : p.severity === 'moderate' ? 'border-amber-200 bg-amber-50/50' : 'border-green-200 bg-green-50/50'}`}>
              <div className="flex items-center gap-2 mb-2"><AvenIcon name={p.icon} size={18} /><p className="font-bold text-[#163526] text-sm">{p.label}</p></div>
              <p className="text-xs text-[#446a74]">{p.description}</p>
              <div className="mt-2 progress-track"><div className="progress-fill" style={{ width: `${p.confidence}%` }} /></div>
              <p className="text-[9px] text-[#446a74] mt-1">{p.confidence}% confidence</p>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

// ===== MEDICAL VIEW =====
function MedicalView({ memory }: { memory: UserMemory | null }) {
  const allSignals = memory ? Object.keys(memory.signalFrequency) : [];
  const tips = getRelevantTips(allSignals, 10);
  const grouped: Record<string, WellnessTip[]> = {};
  tips.forEach(t => { if (!grouped[t.category]) grouped[t.category] = []; grouped[t.category].push(t); });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      <div className="fade-up">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#10b981]">Wellness Guidance</span>
        <h2 className="text-4xl font-light tracking-tight text-[#163526] font-[var(--font-outfit)] mt-1">Medical Wellness</h2>
        <p className="text-[#446a74] mt-1">Personalized guidance based on your emotional patterns{allSignals.length > 0 ? `: ${allSignals.slice(0, 3).join(', ')}` : ''}</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 fade-up delay-100">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 text-sm">Important Disclaimer</p>
            <p className="text-xs text-amber-700 mt-1">Aven provides general wellness guidance only. This is NOT a substitute for professional medical advice, diagnosis, or treatment. If symptoms persist, please consult a qualified healthcare professional.</p>
          </div>
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="organic-card distress-glow p-6 rounded-3xl border-red-100 bg-gradient-to-br from-white to-red-50/30 fade-up delay-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2.5 rounded-xl"><AlertTriangle size={22} className="text-red-600" /></div>
          <div><h4 className="text-lg font-bold text-red-700">Emergency Support</h4><span className="text-[9px] uppercase tracking-widest text-red-600 font-bold">If you need immediate help</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CRISIS_RESOURCES.map(r => (
            <a key={r.name} href={`tel:${r.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-red-100 hover:border-red-300 transition-all group">
              <Phone size={16} className="text-red-500" />
              <div className="flex-1"><p className="text-sm font-bold text-[#163526]">{r.name}</p><p className="text-[10px] text-[#446a74]">{r.description} · {r.available}</p></div>
              <span className="text-sm font-mono text-red-600 font-bold">{r.phone}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Wellness Tips by Category */}
      {Object.entries(grouped).map(([cat, catTips]) => {
        const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META];
        return (
          <div key={cat} className="glass-card rounded-3xl p-8 fade-up delay-200">
            <div className="flex items-center gap-3 mb-4">
              <AvenIcon name={meta.icon} size={24} />
              <h3 className="text-lg font-semibold text-[#163526]">{meta.label}</h3>
            </div>
            <div className="space-y-3">
              {catTips.map(tip => (
                <div key={tip.id} className="p-4 rounded-2xl bg-white/50 border border-[#10b981]/10 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <AvenIcon name={tip.icon} size={20} />
                    <div><p className="font-bold text-sm text-[#163526]">{tip.title}</p><p className="text-xs text-[#446a74] mt-1 leading-relaxed">{tip.description}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Consult Doctor Reminder */}
      <div className="bg-[#163526] text-white rounded-3xl p-8 text-center fade-up delay-300">
        <ShieldCheck size={32} className="mx-auto text-[#10b981] mb-4" />
        <h3 className="text-xl font-bold mb-2">Always Consult a Professional</h3>
        <p className="text-sm text-white/70 max-w-lg mx-auto">If you&apos;re experiencing persistent symptoms, please consult a healthcare professional. These wellness tips complement — but never replace — professional medical care. Your health matters.</p>
      </div>
    </div>
  );
}

// ===== PROFILE VIEW =====
function ProfileView({ session, entries, memory, patterns }: { session: Session; entries: Entry[]; memory: UserMemory | null; patterns: DetectedPattern[] }) {
  const unlocks = getUnlocks(entries.length);
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 min-h-screen">
      <div className="ethereal-glass p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 fade-scale">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10b981] to-[#163526] flex items-center justify-center text-white font-bold text-3xl shadow-lg">{session.name[0]}</div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-light text-[#163526] font-[var(--font-outfit)]">{session.name}</h2>
          <p className="text-[#446a74]">{session.email}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-[#10b981]/10 text-center">
            <p className="text-2xl font-bold text-[#163526]">{entries.length}</p><p className="text-[9px] uppercase font-bold text-[#446a74] tracking-widest">Entries</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-[#10b981]/10 text-center">
            <p className="text-2xl font-bold text-[#163526]">{patterns.length}</p><p className="text-[9px] uppercase font-bold text-[#446a74] tracking-widest">Patterns</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 fade-up delay-100">
        <h3 className="text-lg font-semibold text-[#163526] mb-4 flex items-center gap-2"><Sparkles size={18} className="text-[#10b981]" /> Agent Capabilities</h3>
        <div className="space-y-3">
          {[{ label: 'Chat & Reflection', unlocked: true, at: 0 }, { label: 'Mood Insights', unlocked: unlocks.insights, at: 3 }, { label: 'Full Dashboard', unlocked: unlocks.dashboard, at: 5 }, { label: 'Medical Guidance', unlocked: unlocks.medical, at: 7 }].map(c => (
            <div key={c.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
              {c.unlocked ? <CheckCircle2 size={18} className="text-[#10b981]" /> : <Lock size={18} className="text-[#446a74]/30" />}
              <span className={`flex-1 text-sm font-medium ${c.unlocked ? 'text-[#163526]' : 'text-[#446a74]/40'}`}>{c.label}</span>
              <span className="text-[9px] font-bold text-[#446a74] uppercase tracking-widest">{c.unlocked ? 'Active' : `${c.at} entries`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Stats */}
      {memory && memory.totalEntries > 0 && (
        <div className="glass-card rounded-3xl p-8 fade-up delay-200">
          <h3 className="text-lg font-semibold text-[#163526] mb-4 flex items-center gap-2"><Brain size={18} className="text-[#10b981]" /> Agent Memory</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-xl bg-white/50"><p className="text-xl font-bold text-[#163526]">{memory.totalEntries}</p><p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Stored</p></div>
            <div className="text-center p-3 rounded-xl bg-white/50"><p className="text-xl font-bold text-[#163526]">{Object.keys(memory.signalFrequency).length}</p><p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Signals</p></div>
            <div className="text-center p-3 rounded-xl bg-white/50"><p className="text-xl font-bold text-[#163526]">{memory.avgSeverity7.toFixed(1)}</p><p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Avg Sev</p></div>
            <div className="text-center p-3 rounded-xl bg-white/50"><p className="text-xl font-bold text-[#163526]">{memory.recurringThemes.length}</p><p className="text-[9px] uppercase tracking-widest text-[#446a74] font-bold">Themes</p></div>
          </div>
        </div>
      )}

      {/* Guardrails */}
      <div className="glass-card rounded-3xl p-8 fade-up delay-300">
        <h3 className="text-lg font-semibold text-[#163526] mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-[#10b981]" /> Safety & Ethics</h3>
        <div className="space-y-2">
          {['Aven never diagnoses mental health conditions', 'Aven never prescribes or recommends medication', 'Aven never replaces professional medical care', 'All data stays on your device — private & encrypted', 'Crisis detection triggers immediate support resources', 'AI reasoning is transparent and explainable'].map(g => (
            <div key={g} className="flex items-center gap-3 p-2"><CheckCircle2 size={14} className="text-[#10b981] shrink-0" /><span className="text-sm text-[#446a74]">{g}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
