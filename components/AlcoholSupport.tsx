

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAlcoholExercises, fetchAlcoholMindfulnessScript, fetchSpeech } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { Language, Theme, AlcoholExercise } from '../types';
import { X, Wine, BrainCircuit, Mic2, RefreshCw, CheckCircle2, Play, Pause, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface AlcoholSupportProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
  onHighlight: (processId: string | null) => void;
}

type Tab = 'exercises' | 'script';

const AlcoholSupport: React.FC<AlcoholSupportProps> = ({ isOpen, onClose, lang, theme, onHighlight }) => {
  const [activeTab, setActiveTab] = useState<Tab>('exercises');
  const [exercises, setExercises] = useState<AlcoholExercise[] | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const t = UI_TEXT[lang];

  // Theme Styles
  const modalBg = theme === 'dark' ? 'bg-slate-900 border-rose-900/50' : 'bg-white border-rose-100';
  const headerBg = theme === 'dark' ? 'bg-rose-900/20 border-rose-500/20' : 'bg-rose-50 border-rose-100';
  const accentText = theme === 'dark' ? 'text-rose-200' : 'text-rose-700';
  const primaryBtn = theme === 'dark' ? 'bg-rose-700 hover:bg-rose-600 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white';
  const cardBg = theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 shadow-sm hover:shadow-md';
  const activeTabClass = theme === 'dark' ? 'bg-white/10 text-white shadow-md' : 'bg-white text-slate-800 shadow-sm';
  const inactiveTabClass = theme === 'dark' ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600';

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

  const handleGenerateExercises = async () => {
    setLoading(true);
    try {
        const data = await fetchAlcoholExercises(lang);
        setExercises(data.exercises);
    } finally {
        setLoading(false);
    }
  };

  const handleGenerateScript = async () => {
      setLoading(true);
      try {
          const text = await fetchAlcoholMindfulnessScript(lang);
          setScript(text);
      } finally {
          setLoading(false);
      }
  };

  const toggleSpeech = async (text: string) => {
      if (isSpeaking) {
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch(e){}
          }
          setIsSpeaking(false);
          return;
      }

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

          const dataInt16 = new Int16Array(bytes.buffer);
          const numChannels = 1;
          const sampleRate = 24000;
          const frameCount = dataInt16.length / numChannels;
          
          const buffer = audioCtxRef.current.createBuffer(numChannels, frameCount, sampleRate);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i] / 32768.0;
          }

          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch(e){}
          }

          const source = audioCtxRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtxRef.current.destination);
          
          source.onended = () => setIsSpeaking(false);
          
          audioSourceRef.current = source;
          source.start(0);
          setIsSpeaking(true);

      } catch (err) {
          console.error("Audio playback error", err);
      } finally {
          setLoadingAudio(false);
      }
  };

  // Stop speech and reset highlight when closing
  useEffect(() => {
      if (!isOpen) {
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch(e){}
          }
          setIsSpeaking(false);
          onHighlight(null);
      }
  }, [isOpen, onHighlight]);

  const toggleExpand = (processId: string) => {
      if (expandedExercise === processId) {
          setExpandedExercise(null);
          onHighlight(null);
      } else {
          setExpandedExercise(processId);
          onHighlight(processId);
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
            <div className={`p-6 pb-4 border-b flex justify-between items-center shrink-0 ${headerBg}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-xl">
                        <Wine className={`w-6 h-6 ${accentText}`} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.alcoholSupport}</h2>
                        <p className={`text-xs uppercase tracking-wider opacity-60 ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>Hexaflex Recovery Toolkit</p>
                    </div>
                </div>
                <button onClick={onClose} className={`p-2 rounded-full transition-colors relative z-50 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/10 text-white/60' : 'hover:bg-black/5 text-slate-400'}`}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Tabs */}
            <div className={`px-6 pt-4 pb-2 flex gap-2 ${theme === 'dark' ? 'bg-black/20' : 'bg-slate-50/50'}`}>
                <button 
                    onClick={() => setActiveTab('exercises')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'exercises' ? activeTabClass : inactiveTabClass}`}
                >
                    <BrainCircuit className="w-4 h-4" /> {t.alcoholTabExercises}
                </button>
                <button 
                    onClick={() => setActiveTab('script')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'script' ? activeTabClass : inactiveTabClass}`}
                >
                    <Mic2 className="w-4 h-4" /> {t.alcoholTabScript}
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Intro */}
                {!exercises && !script && !loading && (
                    <div className="text-center py-12">
                        <p className={`mb-8 max-w-md mx-auto leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
                            {t.alcoholIntro}
                        </p>
                        {activeTab === 'exercises' ? (
                            <button 
                                onClick={handleGenerateExercises}
                                className={`px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 ${primaryBtn}`}
                            >
                                {t.alcoholGenerateExercises}
                            </button>
                        ) : (
                            <button 
                                onClick={handleGenerateScript}
                                className={`px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 ${primaryBtn}`}
                            >
                                {t.alcoholGenerateScript}
                            </button>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-60">
                         <RefreshCw className="w-8 h-8 animate-spin mb-4 text-rose-500" />
                         <span className="text-xs uppercase tracking-widest">{t.loading}</span>
                    </div>
                )}

                {/* TAB: EXERCISES */}
                {activeTab === 'exercises' && exercises && !loading && (
                    <div className="grid grid-cols-1 gap-4">
                        {exercises.map((ex) => (
                            <motion.div 
                                key={ex.processId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${cardBg}`}
                            >
                                <button 
                                    onClick={() => toggleExpand(ex.processId)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <div>
                                        <div className={`text-[10px] font-bold uppercase mb-1 opacity-50 tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>
                                            {ex.processId.replace('-', ' ')}
                                        </div>
                                        <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-rose-100' : 'text-slate-800'}`}>
                                            {ex.title}
                                        </h3>
                                    </div>
                                    <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                                        {expandedExercise === ex.processId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {expandedExercise === ex.processId && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`p-5 pt-0 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                                <div className="mt-4 flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}`}>
                                                        {ex.instruction}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                        <button 
                            onClick={handleGenerateExercises}
                            className={`w-full py-4 mt-4 rounded-xl font-bold text-sm transition-colors border ${theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-white/60' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
                        >
                            <RefreshCw className="w-4 h-4 inline-block mr-2" />
                            Regenerate
                        </button>
                    </div>
                )}

                {/* TAB: SCRIPT */}
                {activeTab === 'script' && script && !loading && (
                    <div className="h-full flex flex-col">
                        <div className="mb-6 shrink-0 flex items-center gap-4">
                            <button 
                                onClick={() => toggleSpeech(script)}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all ${isSpeaking ? 'bg-red-500 text-white' : primaryBtn}`}
                                disabled={loadingAudio}
                            >
                                {loadingAudio ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSpeaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />)}
                                {loadingAudio ? 'Generating Voice...' : (isSpeaking ? 'Pause Audio' : 'Play Script')}
                            </button>
                             <button 
                                onClick={handleGenerateScript}
                                className={`p-3 rounded-xl border transition-colors ${theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>

                        <div className={`flex-1 p-6 rounded-2xl border whitespace-pre-wrap leading-loose font-serif ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white/90' : 'bg-rose-50/50 border-rose-100 text-slate-800'}`}>
                            {script}
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

export default AlcoholSupport;
