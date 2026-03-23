import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ActProcess, Theme, Language } from '../types';
import { UI_TEXT, DAILY_CUES } from '../constants';
import { Sparkles } from 'lucide-react';

interface DailyPromptProps {
  theme: Theme;
  lang: Language;
  onOpenProcess: (processId: string) => void;
  className?: string;
}

const DailyPrompt: React.FC<DailyPromptProps> = ({ theme, lang, onOpenProcess, className = '' }) => {
  const [cue, setCue] = useState<{ processId: string, text: string } | null>(null);
  const t = UI_TEXT[lang];

  useEffect(() => {
    // Select a random cue on mount
    const randomCue = DAILY_CUES[Math.floor(Math.random() * DAILY_CUES.length)];
    setCue({
        processId: randomCue.processId,
        text: lang === 'en' ? randomCue.text.en : randomCue.text.sv
    });
  }, [lang]);

  if (!cue) return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      onClick={() => onOpenProcess(cue.processId)}
      className={`p-6 rounded-3xl border backdrop-blur-md text-left transition-all duration-300 hover:scale-[1.02] group h-full flex flex-col justify-center ${
          theme === 'dark' 
          ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10' 
          : 'bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60'
      } ${className}`}
    >
      <div className="flex items-center gap-2 mb-2 opacity-70">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold uppercase tracking-widest">
            {t.dailyCueTitle}
        </h3>
      </div>
      <p className="text-base font-medium leading-relaxed font-serif italic">
          "{cue.text}"
      </p>
      <div className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-full ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-400/20'}`} />
    </motion.button>
  );
};

export default DailyPrompt;