
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActProcess, GeminiInsight, ActionPlan, LoadingState, Language, Theme } from '../types';
import { fetchActInsights, fetchContextualizedInfo, fetchActionPlan, fetchSocraticQuestion } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { X, Sparkles, Brain, Quote, RefreshCw, Send, ListChecks, MessageCircleQuestion, User, ArrowLeft, Mic } from 'lucide-react';

interface DetailPanelProps {
  process: ActProcess | null;
  onClose: () => void;
  lang: Language;
  theme: Theme;
  onBack?: () => void;
}

type Tab = 'essence' | 'context' | 'action' | 'reflect';

// Helper to determine panel position based on Hexagon position
const getPanelPosition = (position: string, isMobile: boolean) => {
    if (isMobile) return 'inset-x-0 bottom-0 top-16 rounded-t-3xl border-t';
    
    // Desktop: Floating cards aligned tightly to the vertical median line
    // Using 51% to place it just next to the exact center (50%) with a tiny gap
    const base = 'w-96 top-32 bottom-12 rounded-3xl border shadow-2xl';
    
    switch (position) {
        case 'top-left':
        case 'bottom-left':
        case 'top': 
             // Panel sits on the LEFT side, its right edge at 51% from the right (just left of center)
             return `${base} right-[51%]`;
        case 'top-right':
        case 'bottom-right':
        case 'bottom': 
             // Panel sits on the RIGHT side, its left edge at 51% from the left (just right of center)
             return `${base} left-[51%]`;
        default:
             return `${base} left-[51%]`;
    }
};

// Helper to determine the vertical position of the arrow based on node position
const getArrowTopPercentage = (position: string) => {
    switch(position) {
        case 'top': return '16%';
        case 'top-left': 
        case 'top-right': return '34%';
        case 'bottom-left':
        case 'bottom-right': return '66%';
        case 'bottom': return '84%';
        default: return '50%';
    }
};

// Helper for the connector arrow rotation/position
const getArrowStyle = (position: string) => {
    const top = getArrowTopPercentage(position);
    switch (position) {
        case 'top-left':
        case 'bottom-left':
        case 'top':
             // Panel is on left, arrow points right towards center (where hex will be)
             return { right: '-32px', top, transform: 'translateY(-50%) rotate(0deg)' }; 
        case 'top-right':
        case 'bottom-right':
        case 'bottom':
             // Panel is on right, arrow points left towards center (where hex will be)
             return { left: '-32px', top, transform: 'translateY(-50%) rotate(180deg)' }; 
        default:
             return { left: '-32px', top, transform: 'translateY(-50%)' };
    }
};

const DetailPanel: React.FC<DetailPanelProps> = ({ process, onClose, lang, theme, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('essence');
  
  // Data States
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [loadingEssence, setLoadingEssence] = useState<LoadingState>(LoadingState.IDLE);
  const [userContext, setUserContext] = useState('');
  const [contextualizedText, setContextualizedText] = useState<string | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [socraticQuestion, setSocraticQuestion] = useState<string | null>(null);
  const [userReflection, setUserReflection] = useState('');
  const [loadingSocratic, setLoadingSocratic] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);

  // Responsive Check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const t = UI_TEXT[lang];

  // Visual Styles - "Quiet and Soft"
  const panelClasses = theme === 'dark' 
      ? 'bg-slate-900/95 backdrop-blur-3xl border-white/10 text-white' 
      : 'bg-white/95 backdrop-blur-3xl border-white/60 text-slate-800';
  
  const textMuted = theme === 'dark' ? 'text-white/50' : 'text-slate-400';
  const inputBg = theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white border-slate-200/60';
  const cardBg = theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white/60 border-white/60 shadow-sm';

  useEffect(() => {
    if (process) {
      setActiveTab('essence');
      setInsight(null);
      setContextualizedText(null);
      setUserContext('');
      setUserReflection('');
      setActionPlan(null);
      setSocraticQuestion(null);
      
      setLoadingEssence(LoadingState.LOADING);
      fetchActInsights(process.title, process.fullDescription, lang)
        .then((data) => {
          setInsight(data);
          setLoadingEssence(LoadingState.SUCCESS);
        })
        .catch(() => setLoadingEssence(LoadingState.ERROR));
    }
  }, [process, lang]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'action' && !actionPlan && process) {
        setLoadingAction(true);
        fetchActionPlan(process.title, lang).then(res => {
            setActionPlan(res);
            setLoadingAction(false);
        });
    }
    if (tab === 'reflect' && !socraticQuestion && process) {
        setLoadingSocratic(true);
        fetchSocraticQuestion(process.title, lang).then(res => {
            setSocraticQuestion(res);
            setLoadingSocratic(false);
        });
    }
  };

  const handleContextSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!process || !userContext.trim()) return;
      setLoadingContext(true);
      const res = await fetchContextualizedInfo(process.title, userContext, lang);
      setContextualizedText(res);
      setLoadingContext(false);
  };

  const startVoiceInput = (setter: React.Dispatch<React.SetStateAction<string>>) => {
      if (isListening) return;

      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
          alert(lang === 'sv' ? "Röstigenkänning stöds inte i denna webbläsare." : "Voice recognition not supported in this browser.");
          return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'sv' ? 'sv-SE' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setter((prev) => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
  };

  if (!process) return null;

  const positionClass = getPanelPosition(process.position, isMobile);
  const arrowStyle = getArrowStyle(process.position);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : (process.position.includes('left') ? -20 : 20), scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed z-40 flex flex-col overflow-hidden ${positionClass} ${panelClasses}`}
        style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }}
      >
        {/* Connector Arrow (Desktop Only) */}
        {!isMobile && (
            <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute pointer-events-none z-50 flex items-center justify-center filter drop-shadow-lg" 
                style={{ ...arrowStyle, color: process.color }}
            >
                {/* Bold Custom Arrow Shape */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-0">
                    <path d="M14 12l-10 8V4l10 8z" /> 
                </svg>
            </motion.div>
        )}

        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: process.color }} />

        {/* Header - Minimalist */}
        <div className="p-6 pb-2 shrink-0 relative">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <button onClick={onBack || onClose} className={`p-2 rounded-full md:hidden ${textMuted}`}>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex flex-col">
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-1 opacity-70`} style={{ color: process.color }}>
                            {process.position.replace('-', ' ')}
                        </span>
                        <h2 className="text-2xl font-serif tracking-tight font-medium" style={{ color: theme === 'light' ? '#1e293b' : 'white' }}>{process.title}</h2>
                    </div>
                 </div>
                 <button onClick={onClose} className={`p-2 rounded-full transition-colors hidden md:block hover:bg-black/5 ${textMuted}`}>
                    <X className="w-6 h-6" />
                 </button>
            </div>
        </div>

        {/* Soft Navigation Tabs */}
        <div className="px-6 pb-4">
            <div className={`flex p-1 rounded-2xl ${theme === 'dark' ? 'bg-black/20' : 'bg-slate-100/50'}`}>
                {[
                    { id: 'essence', icon: Sparkles, label: t.tabs.essence },
                    { id: 'context', icon: User, label: t.tabs.personalize },
                    { id: 'action', icon: ListChecks, label: t.tabs.action },
                    { id: 'reflect', icon: MessageCircleQuestion, label: t.tabs.reflect },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as Tab)}
                        className={`flex-1 flex items-center justify-center py-2 gap-2 rounded-xl transition-all duration-300 ${
                            activeTab === tab.id 
                                ? (theme === 'dark' ? 'bg-white/10 text-white shadow-lg' : 'bg-white text-slate-800 shadow-sm') 
                                : `text-transparent ${textMuted} hover:text-current`
                        }`}
                        title={tab.label}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-current' : textMuted}`} />
                        {activeTab === tab.id && <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 scrollbar-hide">
            
            {/* TAB: ESSENCE */}
            {activeTab === 'essence' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <p className={`text-base leading-relaxed font-light font-serif ${theme === 'dark' ? 'text-white/80' : 'text-slate-600'}`}>
                        {process.fullDescription}
                    </p>
                    
                    {loadingEssence === LoadingState.LOADING && (
                        <div className="flex flex-col items-center gap-2 py-8 opacity-50">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span className="text-xs tracking-widest uppercase">{t.loading}</span>
                        </div>
                    )}

                    {insight && (
                        <div className="space-y-4">
                            <div className={`p-5 rounded-2xl border ${cardBg}`}>
                                <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                                    <Brain className="w-3 h-3" /> {t.perspective}
                                </h4>
                                <p className={`italic text-sm leading-loose ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>"{insight.metaphor}"</p>
                            </div>

                            <div className={`p-5 rounded-2xl border relative overflow-hidden group ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-100 bg-blue-50/30'}`}>
                                <div className={`absolute top-0 left-0 w-1 h-full bg-blue-400 opacity-50`} />
                                <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                                    {t.tryThis}
                                </h4>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}`}>{insight.exercise}</p>
                            </div>

                            <div className="pt-4 text-center">
                                <Quote className={`w-4 h-4 mx-auto mb-3 opacity-30`} />
                                <p className={`font-serif text-lg italic ${theme === 'dark' ? 'text-white/90' : 'text-slate-700'}`}>"{insight.quote}"</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* TAB: CONTEXT */}
            {activeTab === 'context' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className={`p-5 rounded-2xl border ${cardBg}`}>
                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 opacity-70`}>{t.tabs.personalize}</h3>
                        <p className={`text-sm mb-4 ${textMuted} font-light`}>{t.prismIntro}</p>
                        
                        <form onSubmit={handleContextSubmit} className="relative">
                            <input 
                                type="text" 
                                value={userContext}
                                onChange={(e) => setUserContext(e.target.value)}
                                placeholder={t.contextPlaceholder}
                                className={`w-full rounded-xl px-4 py-3 pr-20 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all ${inputBg} ${theme === 'light' ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-white/20'}`}
                            />
                            <div className="absolute right-2 top-2 flex items-center gap-1">
                                <button 
                                    type="button"
                                    onClick={() => startVoiceInput(setUserContext)}
                                    className={`p-1.5 rounded-lg transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-purple-500 hover:bg-purple-500/10'}`}
                                >
                                    <Mic className="w-4 h-4" />
                                </button>
                                <button type="submit" disabled={!userContext || loadingContext} className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500 text-purple-500 hover:text-white transition-all disabled:opacity-50">
                                    {loadingContext ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </form>
                    </div>

                    {contextualizedText && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-purple-900/10 border-purple-500/10' : 'bg-purple-50/50 border-purple-100'} border`}
                        >
                             <p className={`text-sm leading-loose font-serif ${theme === 'dark' ? 'text-purple-100/90' : 'text-slate-700'}`}>{contextualizedText}</p>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* TAB: ACTION */}
            {activeTab === 'action' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                     <div className="flex items-center justify-between mb-2">
                         <h3 className={`text-xs font-bold uppercase tracking-widest opacity-70`}>{t.microHabits}</h3>
                     </div>
                     
                     {loadingAction && (
                         <div className="space-y-3">
                             {[1,2,3].map(i => <div key={i} className={`h-16 rounded-xl animate-pulse ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`} />)}
                         </div>
                     )}

                     {actionPlan && (
                        <div className="space-y-3">
                            {actionPlan.steps.map((step, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${cardBg}`}
                                >
                                    <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold opacity-50" style={{ color: process.color }}>
                                        {idx + 1}
                                    </div>
                                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}`}>{step}</p>
                                </motion.div>
                            ))}
                        </div>
                     )}
                </motion.div>
            )}

             {/* TAB: REFLECT */}
             {activeTab === 'reflect' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                     {loadingSocratic && <div className={`text-center py-8 opacity-50 animate-pulse`}>Generating thought...</div>}

                     {socraticQuestion && (
                        <div className="mb-6 mt-2 text-center relative px-4">
                            <h3 className={`text-lg font-serif italic leading-relaxed ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>
                                {socraticQuestion}
                            </h3>
                            <div className="w-12 h-0.5 bg-current opacity-20 mx-auto mt-4" />
                        </div>
                     )}

                     <div className={`flex-1 w-full rounded-2xl p-4 ${inputBg} relative`}>
                        <textarea 
                            value={userReflection}
                            onChange={(e) => setUserReflection(e.target.value)}
                            placeholder={t.reflectionPlaceholder}
                            className={`w-full h-32 bg-transparent border-none focus:ring-0 resize-none text-sm leading-relaxed ${theme === 'dark' ? 'text-white placeholder-white/20' : 'text-slate-800 placeholder-slate-400'}`} 
                        />
                        <button 
                            onClick={() => startVoiceInput(setUserReflection)}
                            className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'opacity-40 hover:opacity-100 hover:bg-black/5'}`}
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                     </div>
                </motion.div>
            )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailPanel;