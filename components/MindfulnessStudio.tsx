

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMindfulnessSession, fetchSpeech } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { Language, Theme, MindfulnessSession } from '../types';
import { X, Sparkles, Wind, Play, Speaker, Mic, BookOpen, Activity, Loader2 } from 'lucide-react';

interface MindfulnessStudioProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
}

const MindfulnessStudio: React.FC<MindfulnessStudioProps> = ({ isOpen, onClose, lang, theme }) => {
  const [userFeeling, setUserFeeling] = useState('');
  const [session, setSession] = useState<MindfulnessSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const t = UI_TEXT[lang];

  // Initialize Audio Context
  useEffect(() => {
      // @ts-ignore
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      return () => {
          if (audioCtxRef.current?.state !== 'closed') {
              audioCtxRef.current?.close();
          }
      };
  }, []);

  const playAiVoice = async (text: string) => {
      if (!audioCtxRef.current) return;
      if (audioCtxRef.current.state === 'suspended') {
          await audioCtxRef.current.resume();
      }

      setLoadingAudio(true);
      try {
          const base64Audio = await fetchSpeech(text, lang);
          if (!base64Audio) return;

          // Decode raw PCM
          const binaryString = window.atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }

          // Manual decoding logic from system instructions
          // Gemini return 24kHz mono usually
          const dataInt16 = new Int16Array(bytes.buffer);
          const numChannels = 1;
          const sampleRate = 24000;
          const frameCount = dataInt16.length / numChannels;
          
          const buffer = audioCtxRef.current.createBuffer(numChannels, frameCount, sampleRate);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i] / 32768.0;
          }

          // Stop previous
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch(e){}
          }

          const source = audioCtxRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtxRef.current.destination);
          audioSourceRef.current = source;
          source.start(0);

      } catch (err) {
          console.error("Audio playback error", err);
      } finally {
          setLoadingAudio(false);
      }
  };

  useEffect(() => {
      if (!isOpen) {
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch(e){}
          }
          setIsPlaying(false);
          setSession(null);
          setUserFeeling('');
      }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFeeling.trim()) return;
    setLoading(true);
    setSession(null);
    try {
        const res = await fetchMindfulnessSession(userFeeling, lang);
        setSession(res);
    } finally {
        setLoading(false);
    }
  };

  const handleTagClick = (feeling: string) => {
      setUserFeeling(feeling);
  };

  const startSession = async () => {
      setIsPlaying(true);
      setCurrentStep(0);
      if (session && session.steps && session.steps.length > 0) {
          await playAiVoice(session.steps[0].instruction);
      }
  };

  const nextStep = async () => {
      if (!session) return;
      if (currentStep < session.steps.length - 1) {
          const next = currentStep + 1;
          setCurrentStep(next);
          await playAiVoice(session.steps[next].instruction);
      } else {
          setIsPlaying(false);
          await playAiVoice(lang === 'en' ? "Session complete." : "Sessionen avslutad.");
      }
  };

  // Auto-advance logic
  useEffect(() => {
      let timer: number;
      if (isPlaying && session?.steps?.[currentStep]) {
          const stepDuration = (session.steps[currentStep].duration || 10) * 1000;
          timer = window.setTimeout(() => {
              nextStep();
          }, stepDuration); // Note: Simple timer. Ideally we wait for audio to finish + duration.
      }
      return () => clearTimeout(timer);
  }, [isPlaying, currentStep, session]);

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
          setUserFeeling((prev) => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
  };

  // Theme Styles
  const modalBg = theme === 'dark' ? 'bg-slate-900 border-teal-500/30' : 'bg-white border-teal-200';
  const headerBg = theme === 'dark' ? 'bg-teal-900/20 border-teal-500/20' : 'bg-teal-50 border-teal-100';
  const textTitle = theme === 'dark' ? 'text-teal-100' : 'text-teal-800';
  const textSub = theme === 'dark' ? 'text-teal-400/60' : 'text-teal-600/70';
  const inputBg = theme === 'dark' ? 'bg-black/40 border-white/10 text-white placeholder-white/20' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400';
  const buttonBg = theme === 'dark' ? 'bg-teal-600 hover:bg-teal-500 text-white' : 'bg-teal-100 hover:bg-teal-200 text-teal-800';
  const tagBg = theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-teal-200' : 'bg-teal-50 hover:bg-teal-100 text-teal-700';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`pointer-events-auto relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${modalBg}`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center shrink-0 ${headerBg}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/20 rounded-lg">
                        <Wind className="w-5 h-5 md:w-6 md:h-6 text-teal-500" />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${textTitle}`}>{t.mindfulnessStudio}</h2>
                        <p className={`text-xs uppercase tracking-wider ${textSub}`}>{t.mindfulnessSubtitle}</p>
                    </div>
                </div>
                <button onClick={onClose} className={`p-2 rounded-full transition-colors relative z-50 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-black/5 text-slate-400 hover:text-slate-700'}`}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
                
                {!isPlaying ? (
                    <>
                        {/* Intro / Setup Phase */}
                        <div className="mb-8 space-y-6">
                            {!session && (
                                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-teal-500" /> {t.mindfulnessStudio}</h3>
                                    <p className="text-sm leading-relaxed opacity-80 mb-3">{t.mindfulnessIntro}</p>
                                    <p className="text-sm leading-relaxed opacity-80 font-medium italic">{t.mindfulnessGoal}</p>
                                </div>
                            )}
                        </div>

                        {!session && (
                            <div className="space-y-8">
                                {/* Mood Tags */}
                                <div>
                                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 opacity-70 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>Quick Select</p>
                                    <div className="flex flex-wrap gap-3">
                                        {(Object.values(t.mindfulnessTags) as string[]).map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => handleTagClick(tag)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border border-transparent transition-all hover:scale-105 ${tagBg}`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="relative">
                                    <label className={`block text-xs uppercase tracking-wider font-bold mb-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                                        {t.mindfulnessInputLabel}
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <input 
                                                type="text" 
                                                value={userFeeling}
                                                onChange={(e) => setUserFeeling(e.target.value)}
                                                placeholder={t.mindfulnessPlaceholder}
                                                className={`w-full rounded-2xl px-6 py-4 pr-12 text-base focus:outline-none focus:border-teal-500 transition-colors ${inputBg}`}
                                            />
                                            <button 
                                                type="button"
                                                onClick={startVoiceInput}
                                                className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-teal-500/50 hover:text-teal-500 hover:bg-teal-500/10'}`}
                                            >
                                                <Mic className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={!userFeeling || loading}
                                            className={`px-6 rounded-2xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 ${buttonBg}`}
                                        >
                                            {loading ? <Sparkles className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Generated Session Preview (Educational Context) */}
                        {session && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-8"
                            >
                                <div>
                                    <h3 className={`text-2xl font-serif italic mb-2 ${textTitle}`}>{session.title}</h3>
                                    <div className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold ${theme === 'dark' ? 'bg-teal-500/20 text-teal-200' : 'bg-teal-100 text-teal-800'}`}>
                                        {t.technique}: {session.technique}
                                    </div>
                                </div>

                                {/* The "Why" Box */}
                                <div className={`p-6 rounded-2xl border text-left ${theme === 'dark' ? 'bg-white/5 border-teal-500/30' : 'bg-teal-50 border-teal-200'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <BookOpen className="w-5 h-5 text-teal-500" />
                                        <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'}`}>{t.scienceBehind}</span>
                                    </div>
                                    <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>
                                        {session.educationalContext}
                                    </p>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => setSession(null)}
                                        className={`px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {t.back}
                                    </button>
                                    <button 
                                        onClick={startSession}
                                        className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02] ${buttonBg}`}
                                    >
                                        <Play className="w-5 h-5" /> {t.beginPractice}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 h-full min-h-[400px]">
                        
                        {/* Visualization Orb */}
                        <div className="relative w-72 h-72 mb-12 flex items-center justify-center">
                            {/* Outer Glow - Speed depends on pacing */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ 
                                    duration: session?.steps?.[currentStep]?.pacing === 'fast' ? 4 : (session?.steps?.[currentStep]?.pacing === 'steady' ? 0 : 10),
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className={`absolute inset-0 rounded-full blur-3xl ${theme === 'dark' ? 'bg-teal-500/30' : 'bg-teal-400/40'}`}
                            />
                            
                            {/* Inner Circle */}
                            <motion.div 
                                animate={{ scale: session?.steps?.[currentStep]?.pacing === 'steady' ? 1 : [1, 1.15, 1] }}
                                transition={{ 
                                    duration: session?.steps?.[currentStep]?.pacing === 'fast' ? 4 : 10, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className={`w-48 h-48 rounded-full border-2 flex items-center justify-center relative z-10 backdrop-blur-md shadow-[0_0_30px_rgba(20,184,166,0.2)]
                                    ${theme === 'dark' ? 'border-teal-500/50 bg-teal-900/40' : 'border-teal-300 bg-white/60'}`}
                            >
                                {loadingAudio ? (
                                    <Loader2 className={`w-12 h-12 animate-spin opacity-80 ${theme === 'dark' ? 'text-teal-200' : 'text-teal-600'}`} />
                                ) : (
                                    <Wind className={`w-12 h-12 opacity-80 ${theme === 'dark' ? 'text-teal-200' : 'text-teal-600'}`} />
                                )}
                            </motion.div>
                        </div>

                        {/* Instruction Text */}
                        <div className="text-center max-w-md mb-12 min-h-[100px] flex items-center justify-center">
                            <AnimatePresence mode='wait'>
                                <motion.p
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`text-2xl md:text-3xl font-medium leading-relaxed font-serif ${textTitle}`}
                                >
                                    {session?.steps?.[currentStep]?.instruction}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-4 mt-auto">
                             <button 
                                onClick={() => {
                                    if (audioSourceRef.current) {
                                        try { audioSourceRef.current.stop(); } catch(e){}
                                    }
                                    setIsPlaying(false);
                                }}
                                className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider border transition-all hover:bg-white/5 ${theme === 'dark' ? 'border-white/20 text-white/60' : 'border-slate-300 text-slate-500 hover:bg-slate-100'}`}
                            >
                                {t.stopSession}
                            </button>
                            <button
                                onClick={() => session && playAiVoice(session.steps[currentStep].instruction)}
                                className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                                title="Replay Audio"
                            >
                                <Speaker className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MindfulnessStudio;
