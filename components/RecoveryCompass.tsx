import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRecoveryInsight } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { Language, Theme, RecoveryInsight } from '../types';
import { X, Anchor, ArrowRight, RefreshCw, Compass, ShieldAlert, HeartHandshake, Mic } from 'lucide-react';

interface RecoveryCompassProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
}

const RecoveryCompass: React.FC<RecoveryCompassProps> = ({ isOpen, onClose, lang, theme }) => {
  const [urge, setUrge] = useState('');
  const [feeling, setFeeling] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<RecoveryInsight | null>(null);
  const [listeningField, setListeningField] = useState<'urge' | 'feeling' | null>(null);
  
  const t = UI_TEXT[lang];

  // Theme Logic: Dark Slate/Indigo aesthetic for "Depth/Recovery"
  const modalBg = theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const accentColor = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600';
  const buttonBg = theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white';
  const inputBg = theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800';

  const startVoiceInput = (field: 'urge' | 'feeling', setter: React.Dispatch<React.SetStateAction<string>>) => {
      if (listeningField) return;

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

      recognition.onstart = () => setListeningField(field);
      recognition.onend = () => setListeningField(null);
      recognition.onerror = () => setListeningField(null);
      
      recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setter((prev) => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urge.trim() || !feeling.trim()) return;
    
    setLoading(true);
    try {
        const data = await fetchRecoveryInsight(urge, feeling, lang);
        setInsight(data);
    } finally {
        setLoading(false);
    }
  };

  const handleReset = () => {
      setInsight(null);
      setUrge('');
      setFeeling('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`pointer-events-auto relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${modalBg}`}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-current/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl">
                        <Anchor className={`w-6 h-6 ${accentColor}`} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.recoveryCompass}</h2>
                        <p className={`text-xs uppercase tracking-wider opacity-60 ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>{t.recoverySubtitle}</p>
                    </div>
                </div>
                <button onClick={onClose} className={`p-2 rounded-full transition-colors relative z-50 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/10 text-white/60' : 'hover:bg-black/5 text-slate-400'}`}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
                <AnimatePresence mode='wait'>
                    {!insight ? (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <p className={`mb-6 text-sm leading-relaxed opacity-80 ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                                {t.recoveryIntro}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 opacity-70 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                        {t.recoveryInputUrge}
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={urge}
                                            onChange={(e) => setUrge(e.target.value)}
                                            className={`w-full p-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                                            placeholder="..."
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => startVoiceInput('urge', setUrge)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${listeningField === 'urge' ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-indigo-500/40 hover:text-indigo-500 hover:bg-indigo-500/10'}`}
                                        >
                                            <Mic className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 opacity-70 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                        {t.recoveryInputFeeling}
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={feeling}
                                            onChange={(e) => setFeeling(e.target.value)}
                                            className={`w-full p-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                                            placeholder="..."
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => startVoiceInput('feeling', setFeeling)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${listeningField === 'feeling' ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-indigo-500/40 hover:text-indigo-500 hover:bg-indigo-500/10'}`}
                                        >
                                            <Mic className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={loading || !urge || !feeling}
                                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 ${buttonBg}`}
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                {t.recoveryAnalyze}
                                            </>
                                        ) : (
                                            <>
                                                {t.guideExplore} <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Analysis Card */}
                            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-red-900/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                                        {t.recoveryTheLoop}: <span className="underline decoration-wavy decoration-red-400">{insight.blockedNode}</span>
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-red-100/90' : 'text-red-900/80'}`}>
                                    {insight.analysis}
                                </p>
                            </div>

                            {/* Pivot Card */}
                            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Compass className="w-5 h-5 text-indigo-500" />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                        {t.recoveryThePivot}
                                    </span>
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                    {insight.pivotTitle}
                                </h3>
                                <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-indigo-100/80' : 'text-slate-700'}`}>
                                    {insight.pivotDescription}
                                </p>
                                
                                <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-white shadow-sm'}`}>
                                    <HeartHandshake className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} />
                                    <div>
                                        <div className={`text-[10px] font-bold uppercase mb-0.5 opacity-60`}>{t.recoveryAction}</div>
                                        <div className={`font-medium text-sm`}>{insight.pivotAction}</div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleReset}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors border ${theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                            >
                                {t.startOver}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RecoveryCompass;