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
        <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-[#0f172a] text-slate-100">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[140px] bg-indigo-900 opacity-60" />
                <div className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[140px] bg-emerald-900 opacity-60" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] bg-purple-900 opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center max-w-2xl w-full px-6 gap-8"
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.7 }}
                    className="text-center mb-2"
                >
                    <h1 className="text-5xl font-serif tracking-wider text-white">HEXAFLEX</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-50 mt-1">
                        {t.subtitle}
                    </p>
                </motion.div>

                {/* Concept Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="p-6 rounded-3xl border bg-white/5 border-white/10 text-white/80 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2 mb-3 opacity-70">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">
                                {t.conceptActTitle}
                            </h3>
                        </div>
                        <p className="text-sm font-medium leading-relaxed font-serif italic">
                            {t.conceptActContent}
                        </p>
                        <div className="mt-4 h-0.5 w-8 rounded-full bg-white/20" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="p-6 rounded-3xl border bg-white/5 border-white/10 text-white/80 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2 mb-3 opacity-70">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">
                                {t.conceptHexagonTitle}
                            </h3>
                        </div>
                        <p className="text-sm font-medium leading-relaxed font-serif italic">
                            {t.conceptHexagonContent}
                        </p>
                        <div className="mt-4 h-0.5 w-8 rounded-full bg-white/20" />
                    </motion.div>
                </div>

                {/* Enter Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    onClick={onEnter}
                    className="flex items-center gap-3 px-10 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                >
                    <span>{lang === 'sv' ? 'Utforska Hexaflex' : 'Enter Hexaflex'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </motion.div>

            {/* Copyright */}
            <div className="absolute bottom-3 right-4 text-white/20 text-[10px] pointer-events-none select-none">
                {t.copyrightLine}
            </div>
        </div>
    );
};

export default IntroPage;
