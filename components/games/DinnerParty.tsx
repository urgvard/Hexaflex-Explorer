
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDinnerScenario } from '../../services/geminiService';
import { UI_TEXT } from '../../constants';
import { Language, Theme, DinnerScenario } from '../../types';
import { ArrowLeft, X, Utensils, RefreshCw } from 'lucide-react';

interface DinnerPartyProps {
    lang: Language;
    theme: Theme;
    onBack: () => void;
    onClose: () => void;
}

const DinnerParty: React.FC<DinnerPartyProps> = ({ lang, theme, onBack, onClose }) => {
    const [stressor, setStressor] = useState('');
    const [scenario, setScenario] = useState<DinnerScenario | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
    const t = UI_TEXT[lang];

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stressor) return;
        setLoading(true);
        try {
            const data = await fetchDinnerScenario(stressor, lang);
            setScenario(data);
        } finally {
            setLoading(false);
        }
    };

    // Visual placement for 6 guests around a circle
    const guestPositions = [
        { id: 'present-moment', label: 'Present', top: '10%', left: '50%' },
        { id: 'values', label: 'Values', top: '25%', left: '85%' },
        { id: 'committed-action', label: 'Action', top: '75%', left: '85%' },
        { id: 'self-as-context', label: 'Context', top: '90%', left: '50%' },
        { id: 'acceptance', label: 'Accept', top: '75%', left: '15%' },
        { id: 'defusion', label: 'Defusion', top: '25%', left: '15%' },
    ];

    const bgClass = theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-orange-50 text-slate-900';

    return (
        <div className={`flex flex-col h-full ${bgClass} overflow-hidden`}>
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-orange-600 text-white shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-widest">{t.gameDinnerTitle}</h2>
                        <p className="text-[10px] opacity-80">Hosting your Hexaflex</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
                {!scenario ? (
                    <div className="max-w-md w-full mt-12 text-center">
                        <Utensils className="w-16 h-16 mx-auto mb-6 text-orange-500" />
                        <h3 className="text-2xl font-black mb-4">{t.dinnerIntroTitle}</h3>
                        <p className="mb-8 opacity-70">{t.dinnerIntroDesc}</p>
                        <form onSubmit={handleInvite}>
                            <input 
                                value={stressor}
                                onChange={e => setStressor(e.target.value)}
                                placeholder={t.dinnerInputPlaceholder}
                                className={`w-full p-4 rounded-xl border text-center text-xl mb-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                            />
                            <button 
                                type="submit"
                                disabled={loading || !stressor}
                                className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : t.gameSeatGuests}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="relative w-full max-w-2xl aspect-square md:aspect-video flex items-center justify-center">
                        
                        {/* The Table */}
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-orange-300 bg-white/10 flex flex-col items-center justify-center text-center p-4 relative z-10 shadow-xl">
                            <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">{t.dinnerHostMood}</div>
                            <div className="font-serif italic text-lg md:text-xl">"{scenario.hostMood}"</div>
                        </div>

                        {/* The Guests */}
                        {guestPositions.map((pos) => {
                            const guest = scenario.guests[pos.id as keyof typeof scenario.guests];
                            const isSelected = selectedGuest === pos.id;

                            return (
                                <motion.div
                                    key={pos.id}
                                    className="absolute"
                                    style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                                >
                                    <motion.button
                                        onClick={() => setSelectedGuest(isSelected ? null : pos.id)}
                                        className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex flex-col items-center justify-center p-2 shadow-lg transition-all z-20 relative bg-white ${isSelected ? 'border-orange-500 scale-110' : 'border-slate-200 hover:scale-105'}`}
                                    >
                                        <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">{pos.label}</div>
                                        <div className="text-xs font-bold leading-tight text-slate-800 line-clamp-2">{guest?.role}</div>
                                    </motion.button>

                                    {/* Speech Bubble */}
                                    <AnimatePresence>
                                        {isSelected && guest && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white text-slate-900 p-4 rounded-xl shadow-2xl border-2 border-orange-500 z-50 text-center"
                                            >
                                                <div className="font-bold text-sm mb-1 text-orange-600">{guest.name}</div>
                                                <div className="text-xs italic opacity-60 mb-3">"{guest.action}"</div>
                                                <div className="text-sm font-serif">"{guest.quote}"</div>
                                                
                                                {/* Little Triangle */}
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-orange-500 transform rotate-45" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DinnerParty;
