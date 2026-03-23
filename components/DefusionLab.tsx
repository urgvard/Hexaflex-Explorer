
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDefusionTactics } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { Language, Theme, DeepDefusionResponse } from '../types';
import { X, Eraser, Wind, Mic, Eye, Music, BrainCircuit, ArrowRight, RotateCcw } from 'lucide-react';

interface DefusionLabProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
}

type Step = 'input' | 'analyzing' | 'insight' | 'practice' | 'release';

const DefusionLab: React.FC<DefusionLabProps> = ({ isOpen, onClose, lang, theme }) => {
  const [step, setStep] = useState<Step>('input');
  const [thought, setThought] = useState('');
  const [data, setData] = useState<DeepDefusionResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<number | null>(null);
  const t = UI_TEXT[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;
    setStep('analyzing');
    try {
        const res = await fetchDefusionTactics(thought, lang);
        setData(res);
        setStep('insight');
    } catch (error) {
        setStep('input'); // fallback
    }
  };

  const handleRestart = () => {
      setThought('');
      setData(null);
      setStep('input');
      setSelectedTechnique(null);
  };

  const startVoiceInput = () => {
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
          setThought((prev) => prev ? `${prev} ${transcript}` : transcript);
      };
      recognition.start();
  };

  // Theme Styles
  const modalBg = theme === 'dark' ? 'bg-slate-900 border-emerald-500/30' : 'bg-white border-emerald-200';
  const headerBg = theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100';
  const textTitle = theme === 'dark' ? 'text-emerald-100' : 'text-emerald-800';
  const textBody = theme === 'dark' ? 'text-white/80' : 'text-slate-700';
  const inputBg = theme === 'dark' ? 'bg-black/40 border-white/10 text-white placeholder-white/20' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400';
  const cardBg = theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100';
  const primaryBtn = theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white';

  const getCategoryIcon = (cat: string) => {
      switch(cat) {
          case 'visual': return <Eye className="w-4 h-4" />;
          case 'auditory': return <Music className="w-4 h-4" />;
          case 'pragmatic': return <BrainCircuit className="w-4 h-4" />;
          default: return <Wind className="w-4 h-4" />;
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`pointer-events-auto relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${modalBg}`}
          >
            {/* Header */}
            <div className={`p-4 md:p-6 border-b flex justify-between items-center shrink-0 ${headerBg}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                        <Eraser className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${textTitle}`}>{t.defusionLab}</h2>
                        <p className={`text-xs uppercase tracking-wider opacity-60 ${textTitle}`}>{t.defusionLabSubtitle}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                     {step !== 'input' && (
                        <button onClick={handleRestart} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white/60' : 'hover:bg-black/5 text-slate-400'}`}>
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors relative z-50 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-black/5 text-slate-400 hover:text-slate-700'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                <AnimatePresence mode='wait'>
                    
                    {/* STEP 1: INPUT */}
                    {step === 'input' && (
                        <motion.div 
                            key="input"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col h-full justify-center"
                        >
                            <div className="text-center mb-8">
                                <h3 className={`text-2xl font-serif mb-3 ${textBody}`}>What is the hook?</h3>
                                <p className={`opacity-70 ${textBody}`}>{t.defusionIntro}</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
                                <div className="relative">
                                    <textarea 
                                        value={thought}
                                        onChange={(e) => setThought(e.target.value)}
                                        placeholder={t.inputPlaceholder}
                                        className={`w-full rounded-2xl px-6 py-6 text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none min-h-[160px] shadow-inner ${inputBg}`}
                                    />
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={startVoiceInput}
                                            className={`p-3 rounded-full transition-colors ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-emerald-500/60 hover:text-emerald-500 hover:bg-emerald-500/10'}`}
                                        >
                                            <Mic className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!thought}
                                    className={`w-full mt-4 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 ${primaryBtn}`}
                                >
                                    {t.defusionAnalyze} <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 2: ANALYZING */}
                    {step === 'analyzing' && (
                        <motion.div 
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full items-center justify-center text-center space-y-6"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 animate-ping absolute inset-0" />
                                <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/10 backdrop-blur-md relative z-10">
                                    <BrainCircuit className="w-10 h-10 text-emerald-500 animate-pulse" />
                                </div>
                            </div>
                            <p className={`text-lg font-medium animate-pulse ${textBody}`}>{t.loading}</p>
                        </motion.div>
                    )}

                    {/* STEP 3: INSIGHT (Reframe) */}
                    {step === 'insight' && data && (
                        <motion.div 
                            key="insight"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="space-y-8"
                        >
                            {/* Analysis Section */}
                            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 opacity-60 ${textTitle}`}>Analysis</h4>
                                <p className={`text-lg leading-relaxed ${textBody}`}>{data.analysis}</p>
                            </div>

                            {/* Reframe Section - The "Shift" */}
                            <div className="text-center py-4">
                                <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 opacity-60 ${textTitle}`}>{t.defusionReframeHeader}</h4>
                                <div className="relative inline-block">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className={`text-2xl md:text-3xl font-serif italic px-8 py-6 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-slate-800 border-emerald-500/30 text-white' : 'bg-white border-emerald-100 text-slate-800'}`}
                                    >
                                        "{data.reframe} <span className="text-emerald-500 font-bold">...{thought}</span>"
                                    </motion.div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep('practice')}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] ${primaryBtn}`}
                            >
                                {t.defusionExperiment} <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: PRACTICE (Techniques) */}
                    {step === 'practice' && data && (
                        <motion.div 
                            key="practice"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                             <div className="text-center mb-2">
                                <h3 className={`text-xl font-bold ${textBody}`}>{t.defusionTechniquesHeader}</h3>
                                <p className={`opacity-60 text-sm ${textBody}`}>Select a method to distance yourself.</p>
                             </div>

                             <div className="grid grid-cols-1 gap-4">
                                {data.techniques.map((tech, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => setSelectedTechnique(idx)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                            selectedTechnique === idx 
                                            ? (theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500' : 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500')
                                            : cardBg
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl shrink-0 ${theme === 'dark' ? 'bg-white/10 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'}`}>
                                                {getCategoryIcon(tech.category)}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold mb-1 ${selectedTechnique === idx ? 'text-emerald-500' : textBody}`}>
                                                    {tech.title}
                                                </h4>
                                                <p className={`text-sm leading-relaxed opacity-80 ${textBody}`}>
                                                    {tech.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                             </div>

                             <button 
                                onClick={() => setStep('release')}
                                disabled={selectedTechnique === null}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
                                    selectedTechnique !== null 
                                    ? `${primaryBtn} hover:scale-[1.02]` 
                                    : 'bg-gray-400/20 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {t.defusionRelease} <Wind className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 5: RELEASE (Interaction) */}
                    {step === 'release' && (
                        <motion.div 
                            key="release"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center py-10"
                        >
                            <h3 className={`text-xl font-bold mb-8 opacity-60 uppercase tracking-widest ${textBody}`}>{t.defusionFinalStep}</h3>
                            
                            {/* The Floating Thought */}
                            <motion.div
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.2}
                                whileHover={{ scale: 1.05, cursor: 'grab' }}
                                whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                                onClick={(e) => {
                                    // Visual effect on click to simulate popping/dissolving
                                    const target = e.currentTarget as HTMLElement;
                                    target.style.filter = "blur(8px)";
                                    target.style.opacity = "0";
                                    setTimeout(() => handleRestart(), 1500);
                                }}
                                className={`relative p-8 md:p-12 rounded-full border-2 border-dashed flex items-center justify-center max-w-sm aspect-square transition-all duration-1000 ${
                                    theme === 'dark' 
                                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-100' 
                                    : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                }`}
                            >
                                <span className="text-xl md:text-2xl font-serif italic pointer-events-none select-none">
                                    {thought}
                                </span>
                                <div className="absolute -bottom-12 left-0 right-0 text-xs opacity-40 uppercase tracking-widest">
                                    Click to Dissolve
                                </div>
                            </motion.div>
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

export default DefusionLab;
