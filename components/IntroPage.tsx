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
        <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-between bg-[#0f172a] text-slate-100 py-10 px-8">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] bg-indigo-900 opacity-70" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] bg-emerald-900 opacity-70" />
                <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full blur-[120px] bg-purple-900 opacity-50" />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 text-center shrink-0"
            >
                <h1 className="text-5xl font-serif tracking-wider text-white">HEXAFLEX</h1>
                <p className="text-xs font-bold uppercase tracking-[0.35em] opacity-40 mt-2">{t.subtitle}</p>
            </motion.div>

            {/* Concept Cards — balanced middle section */}
            <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 my-8">
                <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.7 }}
                    className="flex flex-col p-8 rounded-3xl border bg-white/5 border-white/10 text-white/85 backdrop-blur-md"
                >
                    <div className="flex items-center gap-3 mb-4 opacity-80">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">{t.conceptActTitle}</h3>
                    </div>
                    <p className="text-base font-medium leading-relaxed font-serif italic flex-1">
                        {t.conceptActContent}
                    </p>
                    <div className="mt-5 h-0.5 w-10 rounded-full bg-white/20" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.7 }}
                    className="flex flex-col p-8 rounded-3xl border bg-white/5 border-white/10 text-white/85 backdrop-blur-md"
                >
                    <div className="flex items-center gap-3 mb-4 opacity-80">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">{t.conceptHexagonTitle}</h3>
                    </div>
                    <p className="text-base font-medium leading-relaxed font-serif italic flex-1">
                        {t.conceptHexagonContent}
                    </p>
                    <div className="mt-5 h-0.5 w-10 rounded-full bg-white/20" />
                </motion.div>
            </div>

            {/* Enter Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                onClick={onEnter}
                className="relative z-10 flex items-center gap-3 px-12 py-4 rounded-full bg-white/10 border border-white/20 text-white text-base font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 group shrink-0"
            >
                <span>{lang === 'sv' ? 'Utforska Hexaflex' : 'Enter Hexaflex'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Copyright */}
            <div className="absolute bottom-3 right-4 text-white/20 text-[10px] pointer-events-none select-none">
                {t.copyrightLine}
            </div>
        </div>
    );
};

export default IntroPage;
