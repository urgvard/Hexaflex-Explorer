import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface IntroPageProps {
    onEnter: () => void;
    lang: Language;
}

const IntroPage: React.FC<IntroPageProps> = ({ onEnter, lang }) => {
    const t = UI_TEXT[lang];

    return (
        <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#0f172a] text-slate-100">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] bg-indigo-900 opacity-70" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] bg-emerald-900 opacity-70" />
                <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full blur-[120px] bg-purple-900 opacity-50" />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 flex flex-col items-center pt-12 pb-6 shrink-0"
            >
                <h1 className="text-6xl font-serif tracking-wider text-white">HEXAFLEX</h1>
                <p className="text-xs font-bold uppercase tracking-[0.35em] opacity-40 mt-2">
                    {t.subtitle}
                </p>
            </motion.div>

            {/* Concept Cards — fills remaining space */}
            <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 px-10 pb-6 min-h-0">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.7 }}
                    className="flex flex-col p-10 rounded-3xl border bg-white/5 border-white/10 text-white/85 backdrop-blur-md overflow-y-auto"
                >
                    <div className="flex items-center gap-3 mb-5 opacity-80">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">
                            {t.conceptActTitle}
                        </h3>
                    </div>
                    <p className="text-lg font-medium leading-relaxed font-serif italic flex-1">
                        {t.conceptActContent}
                    </p>
                    <div className="mt-6 h-0.5 w-12 rounded-full bg-white/20" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.7 }}
                    className="flex flex-col p-10 rounded-3xl border bg-white/5 border-white/10 text-white/85 backdrop-blur-md overflow-y-auto"
                >
                    <div className="flex items-center gap-3 mb-5 opacity-80">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">
                            {t.conceptHexagonTitle}
                        </h3>
                    </div>
                    <p className="text-lg font-medium leading-relaxed font-serif italic flex-1">
                        {t.conceptHexagonContent}
                    </p>
                    <div className="mt-6 h-0.5 w-12 rounded-full bg-white/20" />
                </motion.div>
            </div>

            {/* Enter Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="relative z-10 flex justify-center pb-10 shrink-0"
            >
                <button
                    onClick={onEnter}
                    className="flex items-center gap-3 px-12 py-4 rounded-full bg-white/10 border border-white/20 text-white text-lg font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                >
                    <span>{lang === 'sv' ? 'Utforska Hexaflex' : 'Enter Hexaflex'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>

            {/* Copyright */}
            <div className="absolute bottom-3 right-4 text-white/20 text-[10px] pointer-events-none select-none">
                {t.copyrightLine}
            </div>
        </div>
    );
};

export default IntroPage;
