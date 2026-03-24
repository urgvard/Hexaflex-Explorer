
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fetchRPGProfile } from '../../services/geminiService';
import { UI_TEXT } from '../../constants';
import { Language, Theme, RPGProfile, RPGStat } from '../../types';
import { ArrowLeft, X, Shield, Sword, RefreshCw, Zap } from 'lucide-react';

interface RPGWheelProps {
    lang: Language;
    theme: Theme;
    onBack: () => void;
    onClose: () => void;
}

const RPGWheel: React.FC<RPGWheelProps> = ({ lang, theme, onBack, onClose }) => {
    const [role, setRole] = useState('');
    const [challenge, setChallenge] = useState('');
    const [profile, setProfile] = useState<RPGProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const t = UI_TEXT[lang];

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role || !challenge) return;
        setLoading(true);
        try {
            const data = await fetchRPGProfile(role, challenge, lang);
            setProfile(data);
        } finally {
            setLoading(false);
        }
    };

    // Helper for Polygon Points
    const getPolyPoints = (stats: RPGProfile['stats']) => {
        const order = ['present-moment', 'values', 'committed-action', 'defusion', 'acceptance', 'self-as-context'];
        const total = order.length;
        const radius = 100;
        const center = 110;
        
        return order.map((key, i) => {
            const stat = stats[key];
            const value = stat?.score || 50;
            const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
            const r = (value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    };

    // Theme Colors
    const textLight = theme === 'dark' ? 'text-white' : 'text-slate-800';
    const bgCard = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';

    return (
        <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} overflow-hidden`}>
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-indigo-600 text-white shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-widest">{t.gameRPGTitle}</h2>
                        <p className="text-[10px] opacity-80">Character Sheet Generator</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {!profile ? (
                    <div className="max-w-md mx-auto mt-8">
                        <h3 className="text-2xl font-black mb-6 text-center">{t.rpgIntroTitle}</h3>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2 opacity-70">{t.rpgRoleLabel}</label>
                                <input 
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    placeholder={t.rpgRolePlaceholder}
                                    className={`w-full p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2 opacity-70">{t.rpgBossLabel}</label>
                                <input 
                                    value={challenge}
                                    onChange={e => setChallenge(e.target.value)}
                                    placeholder={t.rpgBossPlaceholder}
                                    className={`w-full p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading || !role || !challenge}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex justify-center items-center gap-2"
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : <><Sword className="w-5 h-5"/> {t.gameRoll}</>}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Left: Character Card */}
                        <div className={`p-6 rounded-3xl border shadow-xl ${bgCard} flex flex-col items-center text-center`}>
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-indigo-500">
                                <Shield className="w-12 h-12 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-black mb-1">{profile.className}</h2>
                            <div className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-6">Current Quest: {profile.quest}</div>

                            {/* Radar Chart SVG */}
                            <div className="relative w-64 h-64 mb-6">
                                <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                                    {/* Web Background */}
                                    {[20, 40, 60, 80, 100].map(r => (
                                        <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="currentColor" strokeOpacity="0.1" />
                                    ))}
                                    {/* Stat Polygon */}
                                    <polygon 
                                        points={getPolyPoints(profile.stats)} 
                                        fill="rgba(79, 70, 229, 0.5)" 
                                        stroke="#4f46e5" 
                                        strokeWidth="2" 
                                    />
                                </svg>
                                {/* Labels (Simplified positioning) */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[10px] font-bold">PRESENCE</div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-[10px] font-bold">CONTEXT</div>
                            </div>
                        </div>

                        {/* Right: Stat Breakdown */}
                        <div className="space-y-4">
                            {Object.entries(profile.stats).map(([key, rawStat]) => {
                                const stat = rawStat as RPGStat;
                                return (
                                <motion.div 
                                    key={key} 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-4 rounded-xl border ${bgCard}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold uppercase text-xs tracking-wider text-indigo-500">{stat.statName}</h4>
                                        <span className="font-black text-lg">{stat.score}/100</span>
                                    </div>
                                    <p className={`text-sm mb-2 opacity-80 italic`}>"{stat.description}"</p>
                                    <div className="flex items-center gap-2 text-xs font-bold bg-indigo-500/10 p-2 rounded text-indigo-600">
                                        <Zap className="w-3 h-3" /> Buff: {stat.buff}
                                    </div>
                                </motion.div>
                            )})}
                            <button onClick={() => setProfile(null)} className="w-full py-3 text-sm font-bold text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors">
                                {t.gameReroll}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RPGWheel;
