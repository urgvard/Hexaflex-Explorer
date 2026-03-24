
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI_TEXT } from '../constants';
import { Language, Theme } from '../types';
import { X, Gamepad2, Hammer, ArrowRight, Dna, Shield, Utensils, AlertTriangle } from 'lucide-react';
import IkeaBuilder from './games/IkeaBuilder';
import BrainTwister from './games/BrainTwister';
import RPGWheel from './games/RPGWheel';
import DinnerParty from './games/DinnerParty';
import DefusionAds from './games/DefusionAds';

interface GamesArcadeProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
}

const GamesArcade: React.FC<GamesArcadeProps> = ({ isOpen, onClose, lang, theme }) => {
  const [activeGame, setActiveGame] = useState<'ikea' | 'twister' | 'rpg' | 'dinner' | 'ads' | null>(null);
  const t = UI_TEXT[lang];

  // Theme Logic
  const modalBg = theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200';
  const headerBg = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50';

  const GameCard = ({ id, title, desc, icon: Icon, color, decorColor }: any) => (
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveGame(id)}
        className={`text-left p-6 rounded-3xl border transition-all group flex flex-col h-64 justify-between relative overflow-hidden shadow-sm hover:shadow-md ${theme === 'dark' ? `bg-${color}-900/10 border-${color}-500/20 hover:border-${color}-400` : `bg-${color}-50 border-${color}-200 hover:border-${color}-400`}`}
      >
        <div className={`absolute top-0 right-0 w-40 h-40 ${decorColor} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity`} />
        
        <div className="relative z-10">
            <div className={`mb-4 inline-block p-3 rounded-2xl shadow-sm ${theme === 'dark' ? `bg-${color}-500/20 text-${color}-200` : `bg-${color}-500 text-white`}`}>
                <Icon className="w-7 h-7" />
            </div>
            <h3 className={`text-2xl font-black mb-2 leading-tight ${theme === 'dark' ? 'text-white' : `text-${color}-900`}`}>
                {title}
            </h3>
            <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? `text-${color}-100/70` : 'text-slate-600'}`}>
                {desc}
            </p>
        </div>

        <div className={`relative z-10 flex items-center gap-2 font-bold text-xs uppercase tracking-widest mt-auto pt-6 ${theme === 'dark' ? `text-${color}-300` : `text-${color}-600`}`}>
            {t.gamePlay} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`pointer-events-auto relative w-full max-w-6xl h-[90vh] border rounded-3xl shadow-2xl overflow-hidden flex flex-col ${modalBg}`}
          >
            {/* Active Game Render */}
            {activeGame === 'ikea' ? (
                <IkeaBuilder lang={lang} theme={theme} onBack={() => setActiveGame(null)} onClose={onClose} />
            ) : activeGame === 'twister' ? (
                <BrainTwister lang={lang} theme={theme} onBack={() => setActiveGame(null)} onClose={onClose} />
            ) : activeGame === 'rpg' ? (
                <RPGWheel lang={lang} theme={theme} onBack={() => setActiveGame(null)} onClose={onClose} />
            ) : activeGame === 'dinner' ? (
                <DinnerParty lang={lang} theme={theme} onBack={() => setActiveGame(null)} onClose={onClose} />
            ) : activeGame === 'ads' ? (
                <DefusionAds lang={lang} theme={theme} onBack={() => setActiveGame(null)} onClose={onClose} />
            ) : (
                <>
                    {/* Header */}
                    <div className={`p-6 border-b flex justify-between items-center shrink-0 ${headerBg}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                                <Gamepad2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.gamesTitle}</h2>
                                <p className={`text-xs uppercase tracking-wider opacity-60 ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>{t.gamesSubtitle}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white/60' : 'hover:bg-black/5 text-slate-400'}`}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Game Menu Grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                        
                        <GameCard 
                            id="ikea" 
                            title={t.gameIkeaTitle} 
                            desc={t.gameIkeaDesc} 
                            icon={Hammer} 
                            color="blue" 
                            decorColor="bg-yellow-400"
                        />

                        <GameCard 
                            id="twister" 
                            title={t.gameTwisterTitle} 
                            desc={t.gameTwisterDesc} 
                            icon={Dna} 
                            color="red" 
                            decorColor="bg-green-400"
                        />

                        <GameCard 
                            id="rpg" 
                            title={t.gameRPGTitle} 
                            desc={t.gameRPGDesc} 
                            icon={Shield} 
                            color="indigo" 
                            decorColor="bg-violet-400"
                        />

                        <GameCard 
                            id="dinner" 
                            title={t.gameDinnerTitle} 
                            desc={t.gameDinnerDesc} 
                            icon={Utensils} 
                            color="orange" 
                            decorColor="bg-amber-400"
                        />

                        <GameCard 
                            id="ads" 
                            title={t.gameAdsTitle} 
                            desc={t.gameAdsDesc} 
                            icon={AlertTriangle} 
                            color="yellow" 
                            decorColor="bg-red-500"
                        />

                        {/* Placeholder */}
                        <div className={`p-6 rounded-3xl border border-dashed flex items-center justify-center opacity-40 min-h-[200px] ${theme === 'dark' ? 'border-white/10 text-white' : 'border-slate-300 text-slate-400'}`}>
                            <span className="text-xs uppercase tracking-widest font-bold">Pizza of Sanity (Coming Soon)</span>
                        </div>
                    </div>
                </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GamesArcade;
