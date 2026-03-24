


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStudyQuestion, fetchStudyFeedback } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { Language, Theme, StudyQuestion, StudyFeedback } from '../types';
import { X, GraduationCap, Lightbulb, ChevronRight, CheckCircle2, RefreshCw, Mic } from 'lucide-react';

interface StudyGuideProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
}

const StudyGuide: React.FC<StudyGuideProps> = ({ isOpen, onClose, lang, theme }) => {
  const [question, setQuestion] = useState<StudyQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<StudyFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const t = UI_TEXT[lang];

  // Colors based on theme
  const panelClasses = theme === 'dark' 
      ? 'bg-slate-900 border-indigo-500/30' 
      : 'bg-white border-indigo-200 shadow-xl';
  const textTitle = theme === 'dark' ? 'text-indigo-200' : 'text-indigo-800';
  const textBody = theme === 'dark' ? 'text-white/80' : 'text-slate-700';
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800';
  const accentBtn = theme === 'dark' 
      ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
      : 'bg-indigo-600 hover:bg-indigo-700 text-white';

  const handleStart = async () => {
    setLoading(true);
    setStarted(true);
    setQuestion(null);
    setFeedback(null);
    setUserAnswer('');
    try {
        const q = await fetchStudyQuestion(lang);
        setQuestion(q);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!question || !userAnswer.trim()) return;
    setLoading(true);
    try {
        const fb = await fetchStudyFeedback(question.question, userAnswer, lang);
        setFeedback(fb);
    } finally {
        setLoading(false);
    }
  };

  const handleNext = () => {
    handleStart();
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
          setUserAnswer((prev) => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-[70px] right-4 md:right-32 z-[120] pointer-events-none">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: -20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: -20 }}
             className={`pointer-events-auto w-[350px] md:w-[400px] border rounded-2xl overflow-hidden flex flex-col relative ${panelClasses}`}
          >
             {/* Close Button */}
             <button onClick={onClose} className={`absolute top-3 right-3 p-1.5 rounded-full z-10 opacity-60 hover:opacity-100 relative z-50 cursor-pointer ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}>
                <X className="w-4 h-4" />
             </button>

             {/* Header */}
             <div className={`p-5 pb-0 flex items-center gap-3`}>
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h2 className={`text-base font-bold ${textTitle}`}>{t.studyTitle}</h2>
                    <p className={`text-[10px] uppercase tracking-wider opacity-60 ${textBody}`}>{t.studySubtitle}</p>
                </div>
             </div>

             <div className="p-5">
                {!started ? (
                    <div className="text-center py-4">
                        <p className={`text-sm mb-6 ${textBody}`}>{t.studyIntro}</p>
                        <button 
                            onClick={handleStart}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${accentBtn}`}
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto"/> : t.studyStart}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {loading && !question && (
                             <div className="flex flex-col items-center justify-center py-8 opacity-60">
                                <RefreshCw className="w-6 h-6 animate-spin mb-2 text-indigo-400" />
                                <span className="text-xs uppercase tracking-widest">{t.loading}</span>
                            </div>
                        )}

                        {question && !feedback && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase mb-2 ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {question.category}
                                </div>
                                <h3 className={`text-sm font-medium leading-relaxed mb-4 ${textBody}`}>
                                    {question.question}
                                </h3>

                                <div className="relative">
                                    <textarea 
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder={t.studyAnswerPlaceholder}
                                        className={`w-full rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px] mb-3 ${inputBg}`}
                                    />
                                    <button 
                                        onClick={startVoiceInput}
                                        className={`absolute bottom-5 right-3 p-2 rounded-full transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'opacity-40 hover:opacity-100 hover:bg-black/5'}`}
                                    >
                                        <Mic className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="group relative">
                                        {question.hint && (
                                            <>
                                                <Lightbulb className="w-4 h-4 opacity-50 cursor-help hover:text-yellow-400 transition-colors" />
                                                <div className="absolute bottom-full left-0 mb-2 w-48 p-2 rounded bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {question.hint}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={!userAnswer.trim() || loading}
                                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 ${accentBtn}`}
                                    >
                                        {loading ? <RefreshCw className="w-3 h-3 animate-spin"/> : <>{t.studySubmit} <ChevronRight className="w-3 h-3" /></>}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {feedback && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-sm">
                                <div className={`p-4 rounded-xl border mb-4 ${theme === 'dark' ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>{t.studyFeedbackTitle}</span>
                                    </div>
                                    <p className={`mb-3 leading-relaxed ${theme === 'dark' ? 'text-emerald-100/90' : 'text-emerald-800/90'}`}>
                                        {feedback.feedback}
                                    </p>
                                    <p className={`text-xs italic opacity-80 ${theme === 'dark' ? 'text-emerald-200' : 'text-emerald-700'}`}>
                                        "{feedback.encouragement}"
                                    </p>
                                </div>
                                <button 
                                    onClick={handleNext}
                                    className={`w-full py-2 rounded-xl font-bold text-xs transition-colors border ${theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                                >
                                    {t.studyNext}
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudyGuide;
