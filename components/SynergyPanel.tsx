
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActProcess, SynergyInsight, Language, Theme } from '../types';
import { fetchSynergy } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { X, Network, Zap } from 'lucide-react';

interface SynergyPanelProps {
  nodes: ActProcess[];
  onClose: () => void;
  lang: Language;
  theme: Theme;
}

const SynergyPanel: React.FC<SynergyPanelProps> = ({ nodes, onClose, lang, theme }) => {
  const [data, setData] = useState<SynergyInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = UI_TEXT[lang];

  useEffect(() => {
    if (nodes.length !== 2) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setData(null);
    fetchSynergy(nodes[0].title, nodes[1].title, lang)
        .then(result => {
            if (!controller.signal.aborted) setData(result);
        })
        .catch(() => {
            if (!controller.signal.aborted) setError(lang === 'sv' ? 'Kunde inte ladda insikt. Försök igen.' : 'Could not load insight. Please try again.');
        })
        .finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
    return () => controller.abort();
  }, [nodes, lang]);

  if (nodes.length !== 2) return null;

  // Theme logic
  const panelClasses = theme === 'dark' 
    ? 'bg-slate-900/90 border-white/20 text-white' 
    : 'bg-white/90 border-slate-200 text-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]';

  const titleGradient = theme === 'dark'
    ? 'bg-gradient-to-r from-white to-white/70'
    : 'bg-gradient-to-r from-slate-900 to-slate-700';

  const cardBg = theme === 'dark' ? 'bg-white/5' : 'bg-slate-50 border border-slate-100';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed bottom-0 left-0 right-0 md:left-1/2 md:transform md:-translate-x-1/2 md:w-[600px] md:bottom-8 glass-panel border-t md:border shadow-2xl z-50 rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col max-h-[85vh] ${panelClasses}`}
        role="dialog"
        aria-modal="true"
        aria-label="Synergy insight"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${nodes[0].color}, ${nodes[1].color})` }} />
        
        <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${theme === 'dark' ? 'bg-black/20 hover:bg-white/10 text-white/50' : 'bg-white hover:bg-black/5 text-slate-400'}`}
            aria-label="Close synergy panel"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-4">
                <span className={`text-[11px] font-serif tracking-[0.25em] font-bold select-none ${theme === 'dark' ? 'text-white/30' : 'text-slate-400/70'}`}>
                    HEXAFLEX
                </span>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>{t.synergyBridge}</span>
                    <Network className={`w-4 h-4 ${theme === 'dark' ? 'text-white/60' : 'text-slate-400'}`} />
                </div>
            </div>

            <div className="flex items-center justify-between mb-6 px-2 md:px-4">
                <div className="text-center flex-1">
                    <div className={`text-[10px] uppercase mb-1 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>{t.processA}</div>
                    <div className="font-bold text-sm md:text-base leading-tight" style={{ color: nodes[0].color }}>{nodes[0].title}</div>
                </div>
                <div className={`h-px w-8 md:w-12 shrink-0 mx-2 ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'}`} />
                <div className="text-center flex-1">
                    <div className={`text-[10px] uppercase mb-1 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>{t.processB}</div>
                    <div className="font-bold text-sm md:text-base leading-tight" style={{ color: nodes[1].color }}>{nodes[1].title}</div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-2 ${theme === 'dark' ? 'border-white' : 'border-slate-800'}`} />
                    <span className={`text-xs animate-pulse ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>{t.loading}</span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            fetchSynergy(nodes[0].title, nodes[1].title, lang)
                                .then(setData)
                                .catch(() => setError(lang === 'sv' ? 'Misslyckades. Försök igen.' : 'Failed. Please try again.'))
                                .finally(() => setLoading(false));
                        }}
                        className={`text-xs px-4 py-2 rounded-full border transition-colors ${theme === 'dark' ? 'border-white/20 text-white/60 hover:bg-white/10' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                    >
                        {lang === 'sv' ? 'Försök igen' : 'Retry'}
                    </button>
                </div>
            ) : data ? (
                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className={`text-xl md:text-2xl font-black text-transparent bg-clip-text ${titleGradient} mb-4 leading-tight`}>
                            {data.relationshipName}
                        </h3>
                    </div>
                    
                    <div className={`rounded-xl p-5 text-center ${cardBg}`}>
                        <p className={`leading-relaxed text-sm md:text-base ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}`}>{data.explanation}</p>
                    </div>

                    <div className={`flex items-start gap-3 p-4 rounded-xl border ${theme === 'dark' ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'}`}>
                        <Zap className={`w-5 h-5 shrink-0 mt-0.5 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`} />
                        <div>
                            <div className={`text-xs font-bold uppercase mb-1 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>{t.synergyTip}</div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>{data.practicalTip}</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SynergyPanel;
