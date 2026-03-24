
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAnnoyingAd } from '../../services/geminiService';
import { UI_TEXT } from '../../constants';
import { Language, Theme, PopUpAd } from '../../types';
import { ArrowLeft, X, AlertTriangle } from 'lucide-react';

interface DefusionAdsProps {
    lang: Language;
    theme: Theme;
    onBack: () => void;
    onClose: () => void;
}

const DefusionAds: React.FC<DefusionAdsProps> = ({ lang, theme, onBack, onClose }) => {
    const [thought, setThought] = useState('');
    const [ad, setAd] = useState<PopUpAd | null>(null);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const t = UI_TEXT[lang];

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!thought) return;
        setLoading(true);
        try {
            const data = await fetchAnnoyingAd(thought, lang);
            setAd(data);
            setTimeLeft(5); // 5 second forced wait (Acceptance)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleSkip = () => {
        setAd(null);
        setThought('');
    };

    return (
        <div className="flex flex-col h-full bg-slate-100 text-slate-900 font-sans overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold">{t.adIntroTitle}</h2>
                        <p className="text-[10px] text-slate-500">Defusion Training</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {!ad ? (
                    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">{t.adIntroDesc}</h3>
                        <form onSubmit={handleGenerate}>
                            <input 
                                value={thought}
                                onChange={e => setThought(e.target.value)}
                                placeholder={t.adInputPlaceholder}
                                className="w-full p-4 border-2 border-slate-200 rounded-lg mb-4 focus:border-blue-500 outline-none"
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !thought}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {loading ? t.adButtonLoading : t.gameGenerate}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        {/* The Annoying Pop-up */}
                        <motion.div 
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-yellow-300 border-4 border-red-600 p-1 rounded-none shadow-[20px_20px_0px_rgba(0,0,0,0.5)] max-w-lg w-full relative"
                        >
                            {/* Fake Window Controls */}
                            <div className="bg-blue-800 text-white px-2 py-1 text-xs font-bold flex justify-between items-center mb-4 cursor-help">
                                <span>INTERNET EXPLORER - SPAM</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-4 bg-slate-300 border border-black shadow-inner">_</div>
                                    <div className="w-4 h-4 bg-slate-300 border border-black shadow-inner">□</div>
                                    <div className="w-4 h-4 bg-slate-300 border border-black shadow-inner flex items-center justify-center text-black leading-none">x</div>
                                </div>
                            </div>

                            <div className="bg-white p-6 text-center border-2 border-slate-300 shadow-inner">
                                <div className="animate-pulse text-red-600 mb-4">
                                    <AlertTriangle className="w-16 h-16 mx-auto" />
                                </div>
                                
                                <h1 className="text-4xl md:text-5xl font-black text-red-600 mb-4 uppercase leading-none tracking-tighter" style={{ textShadow: "2px 2px 0px yellow" }}>
                                    {ad.headline}
                                </h1>
                                
                                <p className="text-xl font-bold mb-8 bg-yellow-100 p-2 inline-block -rotate-1">
                                    {ad.body}
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button className="bg-green-600 text-white text-2xl font-black py-4 border-b-8 border-green-800 active:border-b-0 active:translate-y-2 transition-all uppercase">
                                        {ad.buttonText}
                                    </button>
                                    
                                    <button 
                                        onClick={handleSkip}
                                        disabled={timeLeft > 0}
                                        className={`text-sm underline cursor-pointer ${timeLeft > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 font-bold'}`}
                                    >
                                        {timeLeft > 0 ? `${t.gameSkipAd} (${timeLeft}s)...` : t.gameSkipAd}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DefusionAds;
