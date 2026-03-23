
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBrainTwisterMove } from '../../services/geminiService';
import { UI_TEXT } from '../../constants';
import { Language, Theme, TwisterMove } from '../../types';
import { ArrowLeft, X, Dna, Play, RotateCcw } from 'lucide-react';

interface BrainTwisterProps {
    lang: Language;
    theme: Theme;
    onBack: () => void;
    onClose: () => void;
}

const BrainTwister: React.FC<BrainTwisterProps> = ({ lang, theme, onBack, onClose }) => {
    const [gameState, setGameState] = useState<'intro' | 'spinning' | 'playing' | 'gameover'>('intro');
    const [move, setMove] = useState<TwisterMove | null>(null);
    const [round, setRound] = useState(1);
    const [streak, setStreak] = useState(0);
    const t = UI_TEXT[lang];

    const handleSpin = async () => {
        setGameState('spinning');
        // Delay to simulate spinning tension
        const minSpinTime = new Promise(resolve => setTimeout(resolve, 2000));
        const fetchMove = fetchBrainTwisterMove(round, lang);
        
        const [_, newMove] = await Promise.all([minSpinTime, fetchMove]);
        
        setMove(newMove);
        setGameState('playing');
    };

    const handleSuccess = () => {
        setStreak(prev => prev + 1);
        setRound(prev => prev + 1);
        handleSpin();
    };

    const handleFail = () => {
        setGameState('gameover');
    };

    const resetGame = () => {
        setRound(1);
        setStreak(0);
        setMove(null);
        setGameState('intro');
    };

    // Colors
    const bgClass = 'bg-[#f0f9ff]'; // Light blueish
    const accentRed = '#ef4444'; 
    const accentBlue = '#3b82f6';

    return (
        <div className={`flex flex-col h-full ${bgClass} text-slate-900 font-sans relative overflow-hidden`}>
            
            {/* Retro Polka Dot Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'radial-gradient(#3b82f6 2px, transparent 2px), radial-gradient(#ef4444 2px, transparent 2px)', 
                     backgroundSize: '30px 30px',
                     backgroundPosition: '0 0, 15px 15px'
                 }} 
            />

            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white/80 backdrop-blur-md shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <div>
                        <h2 className="text-lg font-black tracking-tighter uppercase text-slate-800">{t.gameTwisterTitle}</h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.gameRound} {round} • {t.gameStreak} {streak}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-700">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-0">
                
                <AnimatePresence mode="wait">
                    
                    {/* INTRO SCREEN */}
                    {gameState === 'intro' && (
                        <motion.div 
                            key="intro"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center max-w-md"
                        >
                            <div className="w-32 h-32 mx-auto mb-8 relative">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full rounded-full border-8 border-dashed border-red-500 flex items-center justify-center"
                                >
                                    <div className="w-20 h-20 rounded-full bg-blue-500 opacity-20" />
                                </motion.div>
                                <Dna className="absolute inset-0 m-auto w-12 h-12 text-slate-800" />
                            </div>

                            <h1 className="text-4xl font-black mb-4 tracking-tight text-slate-900 leading-none">{t.twisterIntroTitle}</h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                {t.twisterIntroDesc}
                            </p>

                            <button 
                                onClick={handleSpin}
                                className="px-10 py-4 bg-red-500 text-white text-xl font-black uppercase tracking-widest rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                            >
                                <Play className="w-6 h-6 fill-current" /> {t.gameSpin}
                            </button>
                        </motion.div>
                    )}

                    {/* SPINNING ANIMATION */}
                    {gameState === 'spinning' && (
                        <motion.div 
                            key="spinning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                             <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                className="w-48 h-48 rounded-full border-[16px] border-t-red-500 border-r-green-500 border-b-blue-500 border-l-yellow-500 mb-8 shadow-xl"
                             />
                             <h2 className="text-2xl font-black uppercase tracking-widest animate-pulse text-slate-400">{t.twisterSpinning}</h2>
                        </motion.div>
                    )}

                    {/* PLAYING (SHOW MOVE) */}
                    {gameState === 'playing' && move && (
                        <motion.div 
                            key="playing"
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="w-full max-w-xl bg-white border-4 border-slate-900 rounded-3xl shadow-[10px_10px_0px_rgba(0,0,0,0.2)] p-8 text-center relative"
                        >
                            {/* Tape Effect */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/80 rotate-1 shadow-sm" />

                            <div className="mb-6">
                                <span className="inline-block px-4 py-1 bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-xs rounded-full">
                                    {t.gameRound} {round}
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-slate-900">
                                <span className="text-red-500 block text-2xl md:text-3xl mb-2 uppercase tracking-wide">{move.limb}</span>
                                ON
                                <span className="text-blue-600 block text-3xl md:text-4xl mt-2 uppercase tracking-wide">{move.targetNode}</span>
                            </h2>
                            
                            <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-slate-300 mb-8">
                                <p className="text-lg md:text-xl font-medium italic text-slate-600">
                                    "{move.distraction}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={handleFail}
                                    className="py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-500 hover:bg-slate-100 transition-colors uppercase text-sm"
                                >
                                    {t.twisterCollapsed}
                                </button>
                                <button 
                                    onClick={handleSuccess}
                                    className="py-4 rounded-xl bg-green-500 text-white font-bold shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-[4px] transition-all uppercase text-sm"
                                >
                                    {t.twisterHeld}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* GAMEOVER */}
                    {gameState === 'gameover' && (
                        <motion.div 
                            key="gameover"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-md"
                        >
                            <h2 className="text-6xl font-black mb-2 text-slate-900">{t.twisterOuch}</h2>
                            <p className="text-xl text-slate-600 mb-8">You collapsed under the pressure of existence.</p>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-8">
                                <div className="text-sm uppercase font-bold text-slate-400 mb-1">Final Score</div>
                                <div className="text-4xl font-black text-slate-800">{streak} {t.gameRound}s</div>
                            </div>

                            <button 
                                onClick={resetGame}
                                className="px-10 py-4 bg-slate-900 text-white text-xl font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-slate-700 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                            >
                                <RotateCcw className="w-6 h-6" /> {t.gameTryAgain}
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default BrainTwister;
