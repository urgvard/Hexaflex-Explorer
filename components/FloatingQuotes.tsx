
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INSPIRATIONAL_QUOTES, QUOTE_ROTATION_MS } from '../constants';
import { Language, Theme } from '../types';
import { Quote } from 'lucide-react';

interface FloatingQuotesProps {
  lang: Language;
  theme: Theme;
  className?: string;
}

const FloatingQuotes: React.FC<FloatingQuotesProps> = ({ lang, theme, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Pick a random start index
    setCurrentIndex(Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length));

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }, QUOTE_ROTATION_MS);

    return () => clearInterval(id);
  }, []);

  const currentQuote = INSPIRATIONAL_QUOTES[currentIndex];
  const quoteText = lang === 'sv' ? currentQuote.sv : currentQuote.en;

  // Theme Styles
  const containerClasses = theme === 'dark' 
      ? 'bg-white/5 border-white/10 text-white/90' 
      : 'bg-white/40 border-slate-200 text-slate-800';

  const iconColor = theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500';

  return (
    <div className={`${className} z-0 max-w-[300px] md:max-w-[360px] pointer-events-none select-none`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`p-5 rounded-2xl border backdrop-blur-md shadow-sm relative overflow-hidden ${containerClasses}`}
        >
          {/* Decorative Icon */}
          <Quote className={`w-5 h-5 mb-2 opacity-50 ${iconColor}`} />
          
          {/* Quote Text */}
          <p className="text-base font-serif italic leading-relaxed tracking-wide">
            "{quoteText}"
          </p>

          {/* Subtle Progress Bar */}
          <motion.div
            className={`absolute bottom-0 left-0 h-0.5 ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-400/30'}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: QUOTE_ROTATION_MS / 1000, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FloatingQuotes;
