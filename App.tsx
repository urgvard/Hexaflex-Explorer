
import React, { useState, useMemo, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import PendingApprovalPage from './components/PendingApprovalPage';
import IntroPage from './components/IntroPage';
import AdminPanel from './components/AdminPanel';
import { supabase, Profile } from './lib/supabase';
import HexagonVisual from './components/HexagonVisual';
import DetailPanel from './components/DetailPanel';
import SynergyPanel from './components/SynergyPanel';
import DefusionLab from './components/DefusionLab';
import MindfulnessStudio from './components/MindfulnessStudio';
import RecoveryCompass from './components/RecoveryCompass';
import AlcoholSupport from './components/AlcoholSupport';
import AmbientPlayer from './components/AmbientPlayer';
import ReferenceLibrary from './components/ReferenceLibrary';
import DailyPrompt from './components/DailyPrompt';
import StudyGuide from './components/StudyGuide';
import FloatingQuotes from './components/FloatingQuotes';
import GamesArcade from './components/GamesArcade'; 
import { ActProcess, Language, Theme } from './types';
import { getProcesses, UI_TEXT, HINT_SHOW_DELAY_MS, HINT_HIDE_DELAY_MS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Languages, ArrowLeft, MousePointerClick, GitMerge, Wind, Palette, Library, GraduationCap, Anchor, Wine, Sparkles, Gamepad2 } from 'lucide-react';

const STORAGE_KEYS = {
  LANG: 'hexaflex_lang',
  PRESET: 'hexaflex_preset',
  SELECTION: 'hexaflex_selection',
  HISTORY: 'hexaflex_history',
  HAS_SEEN_HINT: 'hexaflex_hint_seen',
};

type BgPreset = {
    id: string;
    name: string;
    type: Theme;
    bgClass: string;
    textClass: string;
    blobs: string[];
};

const BG_PRESETS: BgPreset[] = [
    {
        id: 'mentalist',
        name: 'Deep Space',
        type: 'dark',
        bgClass: 'bg-[#0f172a]', // Slate 900
        textClass: 'text-slate-100',
        blobs: ['bg-indigo-900', 'bg-emerald-900', 'bg-purple-900']
    },
    {
        id: 'serenity',
        name: 'Serenity',
        type: 'light',
        bgClass: 'bg-[#fff1f2]', // Rose 50
        textClass: 'text-rose-950',
        blobs: ['bg-rose-200', 'bg-orange-200', 'bg-amber-100']
    },
    {
        id: 'zen',
        name: 'Zen',
        type: 'light',
        bgClass: 'bg-[#f5f5f4]', // Stone 100
        textClass: 'text-stone-800',
        blobs: ['bg-stone-300', 'bg-emerald-100', 'bg-orange-100']
    },
    {
        id: 'ocean',
        name: 'Ocean',
        type: 'dark',
        bgClass: 'bg-[#083344]', // Cyan 950
        textClass: 'text-cyan-50',
        blobs: ['bg-cyan-900', 'bg-blue-900', 'bg-teal-900']
    },
     {
        id: 'forest',
        name: 'Forest',
        type: 'dark',
        bgClass: 'bg-[#022c22]', // Emerald 950
        textClass: 'text-emerald-50',
        blobs: ['bg-emerald-900', 'bg-green-900', 'bg-lime-900']
    }
];

const App: React.FC = () => {
  // Auth state
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'pending' | 'intro' | 'app'>('login');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadProfile(session.user.id);
      }
      setAuthChecked(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
        setAuthScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
      if (data.role === 'super_admin' || data.role === 'approved') {
        // Show intro screen once per session, then go straight to app
        const introSeen = sessionStorage.getItem('hexaflex_intro_seen');
        setAuthScreen(introSeen ? 'app' : 'intro');
      } else {
        setAuthScreen('pending');
      }
    }
  };

  const handleIntroEnter = () => {
    sessionStorage.setItem('hexaflex_intro_seen', 'true');
    setAuthScreen('app');
  };


  // Global State with LocalStorage Initialization
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [currentPresetIndex, setCurrentPresetIndex] = useState<number>(() => {
      const saved = localStorage.getItem(STORAGE_KEYS.PRESET);
      const index = BG_PRESETS.findIndex(p => p.id === saved);
      return index >= 0 ? index : 0; // Default to Mentalist
  });
  
  // App State
  const [selectedProcesses, setSelectedProcesses] = useState<ActProcess[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTION);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [highlightedProcessId, setHighlightedProcessId] = useState<string | null>(null);

  const [isDefusionLabOpen, setIsDefusionLabOpen] = useState(false);
  const [isMindfulnessOpen, setIsMindfulnessOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isAlcoholOpen, setIsAlcoholOpen] = useState(false);
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);
  const [isStudyGuideOpen, setIsStudyGuideOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false); 
  const [isBreathing, setIsBreathing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Navigation History
  const [history, setHistory] = useState<ActProcess[][]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  // Mouse Position for Parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Derived Data
  const processes = useMemo(() => getProcesses(lang), [lang]);
  const t = UI_TEXT[lang];
  const currentPreset = BG_PRESETS[currentPresetIndex];
  const theme = currentPreset.type;

  // Persistence Effects
  useEffect(() => localStorage.setItem(STORAGE_KEYS.LANG, lang), [lang]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.PRESET, currentPreset.id), [currentPreset.id]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.SELECTION, JSON.stringify(selectedProcesses)), [selectedProcesses]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)), [history]);

  // Hint Logic
  useEffect(() => {
      const hasSeen = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_HINT);
      if (!hasSeen) {
          setTimeout(() => {
              setShowHint(true);
              localStorage.setItem(STORAGE_KEYS.HAS_SEEN_HINT, 'true');
              setTimeout(() => setShowHint(false), HINT_HIDE_DELAY_MS);
          }, HINT_SHOW_DELAY_MS);
      }
  }, []);

  // Mouse Move Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX - window.innerWidth / 2), 
        y: (e.clientY - window.innerHeight / 2) 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggleProcess = (process: ActProcess) => {
    if (isBreathing) setIsBreathing(false); // Stop breathing if navigating
    setHistory(prev => [...prev, selectedProcesses]);
    setSelectedProcesses(prev => {
      if (prev.find(p => p.id === process.id)) {
        return prev.filter(p => p.id !== process.id);
      }
      if (prev.length >= 2) {
        return [process];
      }
      return [...prev, process];
    });
  };

  const handleLongPressProcess = (process: ActProcess) => {
      if (isBreathing) setIsBreathing(false);
      setHistory(prev => [...prev, selectedProcesses]);
      setSelectedProcesses([process]);
  };
  
  const handleOpenProcessById = (id: string) => {
      const p = processes.find(proc => proc.id === id);
      if (p) handleToggleProcess(p);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setSelectedProcesses(previousState);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleStartOver = () => {
      setHistory([]);
      setSelectedProcesses([]);
      setIsDefusionLabOpen(false);
      setIsMindfulnessOpen(false);
      setIsRecoveryOpen(false);
      setIsAlcoholOpen(false);
      setIsReferencesOpen(false);
      setIsStudyGuideOpen(false);
      setIsGamesOpen(false);
      setIsBreathing(false);
      setHighlightedProcessId(null);
      localStorage.removeItem(STORAGE_KEYS.SELECTION);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
  };

  const cyclePreset = () => {
      setCurrentPresetIndex(prev => (prev + 1) % BG_PRESETS.length);
  };
  
  const toggleLang = () => setLang(prev => prev === 'en' ? 'sv' : 'en');

  // Calculate Layout Shifts to avoid overlap
  const getContainerShift = () => {
      if (selectedProcesses.length === 2) return 'translate-y-[-10%] scale-90'; // Synergy mode: move up slightly
      if (selectedProcesses.length === 1) {
          const pos = selectedProcesses[0].position;
          // If popup is on Left, shift Hexagon Right.
          if (['top-left', 'bottom-left', 'top'].includes(pos)) {
              return 'translate-x-[20%] md:translate-x-[35%] scale-90';
          }
          // If popup is on Right, shift Hexagon Left.
          return 'translate-x-[-20%] md:translate-x-[-35%] scale-90';
      }
      return 'scale-100';
  };
  
  if (authScreen !== 'app') {
    if (!authChecked) return null; // Brief pause while session loads
    if (authScreen === 'signup') return <SignUpPage onBackToLogin={() => setAuthScreen('login')} onSignedUp={() => setAuthScreen('pending')} />;
    if (authScreen === 'pending') return <PendingApprovalPage email={profile?.email ?? ''} />;
    if (authScreen === 'intro') return <IntroPage onEnter={handleIntroEnter} lang={lang} />;
    return <LoginPage onSignUpClick={() => setAuthScreen('signup')} />;
  }

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col transition-colors duration-[2000ms] ease-in-out ${currentPreset.bgClass} ${currentPreset.textClass}`}>
      
      {/* Custom Styles for Slow Breathing Animation */}
      <style>{`
        @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.1); opacity: 0.6; }
        }
        .animate-breathe {
            animation: breathe 12s infinite ease-in-out;
        }
        .animate-breathe-delayed {
            animation: breathe 15s infinite ease-in-out;
            animation-delay: 2s;
        }
        .animate-breathe-slow {
            animation: breathe 18s infinite ease-in-out;
            animation-delay: 4s;
        }
      `}</style>

      {/* Visual Enhancements: Noise Texture & Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Noise Texture */}
         <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" 
            style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }} 
         />
         
         {/* Animated Blobs with Parallax & Theme Colors */}
         <div 
            className={`absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[140px] animate-breathe transition-colors duration-[3000ms] ${currentPreset.blobs[0]}`} 
            style={{ 
                transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`
            }} 
         />
         <div 
            className={`absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[140px] animate-breathe-delayed transition-colors duration-[3000ms] ${currentPreset.blobs[1]}`} 
            style={{ 
                transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`
            }} 
         />
         <div 
            className={`absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] animate-breathe-slow transition-colors duration-[3000ms] ${currentPreset.blobs[2]}`} 
            style={{ 
                transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`
            }} 
         />
      </div>

      {/* Floating Quotes - Moved to back (z-10) and positioned higher (top-2) */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2 hidden lg:block pointer-events-none z-10">
             <FloatingQuotes 
                lang={lang} 
                theme={theme} 
                className="w-[380px]"
             />
      </div>

      {/* Header - Z-Index 1000 to stay on top */}
      <motion.header 
        className="relative z-[1000] p-6 flex justify-between items-start shrink-0 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 pointer-events-auto">
            {/* Back Button - Conditional Rendering to ensure logo is flush left when no history */}
            {history.length > 0 && (
                <button 
                    onClick={handleBack} 
                    className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-slate-800'}`}
                    title={t.back}
                >
                    <ArrowLeft className="w-6 h-6" strokeWidth={3} />
                </button>
            )}

            <div onClick={handleStartOver} className="cursor-pointer relative z-[1001] flex flex-col select-none">
                 <h1 className={`text-4xl md:text-5xl font-serif tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    HEXAFLEX
                 </h1>
                 <p className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] opacity-60 ml-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {t.subtitle}
                 </p>
            </div>
        </div>

        <div className="flex items-center gap-3 mt-1 pointer-events-auto">
             <div className="hidden md:block">
                 <AmbientPlayer theme={theme} label={t.music} nextLabel={t.nextTrack} />
             </div>

            <button onClick={toggleLang} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <div className="flex items-center gap-1">
                    <Languages className="w-4 h-4 opacity-70" />
                    <span className="text-xs font-bold opacity-70">{lang.toUpperCase()}</span>
                </div>
            </button>

            <button onClick={cyclePreset} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title={`Theme: ${currentPreset.name}`}>
                <Palette className="w-4 h-4 opacity-70" />
            </button>
            
            <button onClick={() => setIsGamesOpen(true)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title={t.gamesTitle}>
                <Gamepad2 className="w-4 h-4 opacity-70" />
            </button>

            <button onClick={() => setIsReferencesOpen(true)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title={t.libraryTitle}>
                <Library className="w-4 h-4 opacity-70" />
            </button>
            
            <button 
                onClick={() => setIsStudyGuideOpen(!isStudyGuideOpen)} 
                className={`p-2 rounded-full transition-colors ${isStudyGuideOpen ? 'bg-indigo-500 text-white' : (theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5')}`} 
                title={t.studyTitle}
            >
                <GraduationCap className="w-4 h-4 opacity-70" />
            </button>
        </div>
      </motion.header>
      
      {/* Right Side Stack (Daily Prompt + Tools + Alcohol) */}
      <div className="absolute top-48 bottom-12 right-12 z-20 hidden lg:flex flex-col gap-4 w-[360px] pointer-events-auto">
          {/* Daily Cue */}
          <DailyPrompt theme={theme} lang={lang} onOpenProcess={handleOpenProcessById} className="flex-1" />

          {/* Mindfulness Studio Bubble */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            onClick={() => setIsMindfulnessOpen(true)}
            className={`w-full p-6 rounded-3xl border backdrop-blur-md text-left transition-all duration-300 hover:scale-[1.02] group flex-1 flex flex-col justify-center ${
                theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10' 
                : 'bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 opacity-70">
                <Wind className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                    {t.mindfulnessStudio}
                </h3>
            </div>
            <p className="text-base font-medium leading-relaxed font-serif italic">
                {lang === 'sv' ? "Förankra dig i nuet." : "Anchor yourself in the present moment."}
            </p>
             <div className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-full ${theme === 'dark' ? 'bg-teal-500/40' : 'bg-teal-400/40'}`} />
          </motion.button>

          {/* Defusion Lab Bubble */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            onClick={() => setIsDefusionLabOpen(true)}
            className={`w-full p-6 rounded-3xl border backdrop-blur-md text-left transition-all duration-300 hover:scale-[1.02] group flex-1 flex flex-col justify-center ${
                theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10' 
                : 'bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 opacity-70">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                    {t.defusionLab}
                </h3>
            </div>
            <p className="text-base font-medium leading-relaxed font-serif italic">
                {lang === 'sv' ? "Lossa greppet från klistriga tankar." : "Untangle from sticky thoughts."}
            </p>
             <div className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-full ${theme === 'dark' ? 'bg-emerald-500/40' : 'bg-emerald-400/40'}`} />
          </motion.button>

          {/* Recovery Compass Bubble */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            onClick={() => setIsRecoveryOpen(true)}
            className={`w-full p-6 rounded-3xl border backdrop-blur-md text-left transition-all duration-300 hover:scale-[1.02] group flex-1 flex flex-col justify-center ${
                theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10' 
                : 'bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 opacity-70">
                <Anchor className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                    {t.recoveryCompass}
                </h3>
            </div>
            <p className="text-base font-medium leading-relaxed font-serif italic">
                {lang === 'sv' ? "Navigera genom impulser och mönster." : "Navigate urges and patterns."}
            </p>
             <div className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-full ${theme === 'dark' ? 'bg-indigo-500/40' : 'bg-indigo-400/40'}`} />
          </motion.button>

          {/* Alcohol Support Bubble */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            onClick={() => setIsAlcoholOpen(true)}
            className={`w-full p-6 rounded-3xl border backdrop-blur-md text-left transition-all duration-300 hover:scale-[1.02] group flex-1 flex flex-col justify-center ${
                theme === 'dark' 
                ? 'bg-rose-900/10 border-rose-500/20 text-rose-100 hover:bg-rose-900/20' 
                : 'bg-white/60 border-rose-200 text-rose-800 hover:bg-white/80'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 opacity-90">
                <Wine className="w-5 h-5 text-rose-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                    {t.alcoholSupport}
                </h3>
            </div>
            <p className="text-base font-medium leading-relaxed font-serif italic opacity-80">
                {t.alcoholBubbleDescription}
            </p>
            <div className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-full ${theme === 'dark' ? 'bg-rose-500/40' : 'bg-rose-400/40'}`} />
          </motion.button>
      </div>

      {/* ACT Therapy Concept Box - Updated Style */}
      <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className={`absolute top-40 left-12 max-w-[360px] z-10 p-6 rounded-3xl border backdrop-blur-md hidden lg:block transition-all duration-700 ${
              theme === 'dark' 
              ? 'bg-white/5 border-white/10 text-white/80' 
              : 'bg-white/40 border-slate-200 text-slate-700'
          }`}
      >
          <div className="flex items-center gap-2 mb-2 opacity-70">
               <Sparkles className="w-4 h-4 text-amber-400" />
               <h3 className="text-xs font-bold uppercase tracking-widest">
                  {t.conceptActTitle}
              </h3>
          </div>
          <p className="text-base font-medium leading-relaxed font-serif italic">
              {t.conceptActContent}
          </p>
          <div className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-400/20'}`} />
      </motion.div>

      {/* Hint Toast (Bottom Center) */}
      <AnimatePresence>
          {showHint && (
              <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-black/80 text-white text-xs font-bold tracking-widest pointer-events-none"
              >
                  {t.longPressHint}
              </motion.div>
          )}
      </AnimatePresence>
      
      {/* Center Left: Guide (Reduced Size & Spacing) */}
      <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-1/2 left-12 transform -translate-y-1/2 z-0 hidden lg:block text-left w-[220px] pointer-events-none"
        >
             <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-40 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.guideTitle}</h3>
             <div className="space-y-2.5 flex flex-col items-start">
                 <div className="flex gap-2">
                     <MousePointerClick className="w-4 h-4 opacity-50 shrink-0" />
                     <div>
                         <p className="text-xs font-bold opacity-80 mb-0.5">{t.guideExplore}</p>
                         <p className="text-[10px] opacity-50 leading-tight">{t.guideExploreDesc}</p>
                     </div>
                 </div>
                 <div className="flex gap-2">
                     <GitMerge className="w-4 h-4 opacity-50 shrink-0" />
                     <div>
                         <p className="text-xs font-bold opacity-80 mb-0.5">{t.guideSynergy}</p>
                         <p className="text-[10px] opacity-50 leading-tight">{t.guideSynergyDesc}</p>
                     </div>
                 </div>
             </div>
        </motion.div>

      {/* Hexagon Theory Concept Box - Updated Style */}
      <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`absolute bottom-12 left-12 max-w-[360px] z-10 p-6 rounded-3xl border backdrop-blur-md hidden lg:block transition-all duration-700 ${
              theme === 'dark' 
              ? 'bg-white/5 border-white/10 text-white/80' 
              : 'bg-white/40 border-slate-200 text-slate-700'
          }`}
      >
          <div className="flex items-center gap-2 mb-2 opacity-70">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                  {t.conceptHexagonTitle}
              </h3>
          </div>
          <p className="text-base font-medium leading-relaxed font-serif italic">
              {t.conceptHexagonContent}
          </p>
          <div className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-400/20'}`} />
      </motion.div>

      {/* Mobile Music Player */}
      <div className="md:hidden px-6 pb-2 flex justify-center z-40 relative">
           <AmbientPlayer theme={theme} label={t.music} nextLabel={t.nextTrack} />
      </div>

      {/* Main Content Area - Contains only the 3D Scene to prevent z-index issues with fixed modals */}
      <main className="flex-grow relative w-full flex items-center justify-center p-0 md:p-4 perspective-[1000px] overflow-hidden">
        
        {/* Dynamic Visual Container - Z-30 (Front) */}
        {/* ADDED pointer-events-none here to allow clicks to pass through to the z-20 layer */}
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full h-full flex items-center justify-center z-30 pointer-events-none ${getContainerShift()}`}>
            <HexagonVisual 
              processes={processes}
              selectedProcesses={selectedProcesses} 
              onToggleProcess={handleToggleProcess}
              onLongPressProcess={handleLongPressProcess}
              isBreathing={isBreathing}
              toggleBreathing={() => setIsBreathing(!isBreathing)}
              highlightedProcessId={highlightedProcessId}
              theme={theme}
              lang={lang}
            />
        </div>

        {/* Floating Blobs Foreground */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 mix-blend-screen opacity-50">
             <div 
                className={`absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[140px] animate-breathe transition-colors duration-[3000ms] ${currentPreset.blobs[0]}`} 
                style={{ 
                    transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`
                }} 
             />
             <div 
                className={`absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[140px] animate-breathe-delayed transition-colors duration-[3000ms] ${currentPreset.blobs[1]}`} 
                style={{ 
                    transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`
                }} 
             />
             <div 
                className={`absolute top-20%] right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] animate-breathe-slow transition-colors duration-[3000ms] ${currentPreset.blobs[2]}`} 
                style={{ 
                    transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`
                }} 
             />
        </div>
      </main>

      {/* MODALS - Moved out of <main> to avoid perspective/z-index stacking issues */}
      
      {/* 1. Detail Panel */}
      <DetailPanel 
        process={selectedProcesses.length === 1 ? selectedProcesses[0] : null} 
        onClose={handleStartOver}
        onBack={handleBack}
        lang={lang}
        theme={theme}
      />

      {/* 2. Synergy Panel */}
      <SynergyPanel
        nodes={selectedProcesses.length === 2 ? selectedProcesses : []}
        onClose={handleStartOver}
        lang={lang}
        theme={theme}
      />

      {/* 3. Defusion Lab */}
      <DefusionLab 
          isOpen={isDefusionLabOpen}
          onClose={() => setIsDefusionLabOpen(false)}
          lang={lang}
          theme={theme}
      />

      {/* 4. Mindfulness Studio */}
      <MindfulnessStudio 
          isOpen={isMindfulnessOpen}
          onClose={() => setIsMindfulnessOpen(false)}
          lang={lang}
          theme={theme}
      />

      {/* 5. Reference Library */}
      <ReferenceLibrary 
          isOpen={isReferencesOpen}
          onClose={() => setIsReferencesOpen(false)}
          lang={lang}
          theme={theme}
      />

      {/* 6. Study Guide */}
      <StudyGuide 
          isOpen={isStudyGuideOpen}
          onClose={() => setIsStudyGuideOpen(false)}
          lang={lang}
          theme={theme}
      />

      {/* 7. Recovery Compass */}
      <RecoveryCompass 
          isOpen={isRecoveryOpen}
          onClose={() => setIsRecoveryOpen(false)}
          lang={lang}
          theme={theme}
      />

      {/* 8. Alcohol Support */}
      <AlcoholSupport 
          isOpen={isAlcoholOpen}
          onClose={() => setIsAlcoholOpen(false)}
          lang={lang}
          theme={theme}
          onHighlight={setHighlightedProcessId}
      />

      {/* 9. Games Arcade */}
      <GamesArcade
        isOpen={isGamesOpen}
        onClose={() => setIsGamesOpen(false)}
        lang={lang}
        theme={theme}
      />

      {/* Copyright Notice */}
      <div className={`absolute bottom-3 right-4 z-10 text-right pointer-events-none select-none ${theme === 'dark' ? 'text-white/25' : 'text-slate-400/60'}`}>
        <p className="text-[10px] leading-snug tracking-wide">
          {t.copyrightLine}
        </p>
        <p className="text-[10px] leading-snug tracking-wide">
          <a
            href={`mailto:${t.copyrightContact}`}
            className={`pointer-events-auto transition-opacity hover:opacity-80 ${theme === 'dark' ? 'text-white/25' : 'text-slate-400/60'}`}
          >
            {t.copyrightContact}
          </a>
        </p>
      </div>

      {/* Admin Panel Button — visible only to super_admin */}
      {profile?.role === 'super_admin' && (
        <button
          onClick={() => setIsAdminOpen(true)}
          className={`absolute bottom-3 left-4 z-10 p-1.5 rounded-lg transition-all opacity-30 hover:opacity-80 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-black/5'}`}
          title="Admin Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </button>
      )}

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
