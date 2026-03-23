
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchIkeaAssemblyGuide } from '../../services/geminiService';
import { UI_TEXT } from '../../constants';
import { Language, Theme, IkeaManual } from '../../types';
import { ArrowLeft, X, Hammer, RefreshCw, Smile } from 'lucide-react';

interface IkeaBuilderProps {
    lang: Language;
    theme: Theme;
    onBack: () => void;
    onClose: () => void;
}

const IkeaBuilder: React.FC<IkeaBuilderProps> = ({ lang, theme, onBack, onClose }) => {
    const [problem, setProblem] = useState('');
    const [loading, setLoading] = useState(false);
    const [manual, setManual] = useState<IkeaManual | null>(null);
    const [stepIndex, setStepIndex] = useState(0);
    const t = UI_TEXT[lang];

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!problem.trim()) return;
        setLoading(true);
        try {
            const data = await fetchIkeaAssemblyGuide(problem, lang);
            setManual(data);
            setStepIndex(0);
        } finally {
            setLoading(false);
        }
    };

    // Helper to render the specific visual metaphor icon
    const renderMetaphorIcon = (type: string) => {
        const style = "w-24 h-24 stroke-1 mb-6 text-slate-800";
        switch (type) {
            case 'wrench': // Allen Key
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={style}>
                         <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" className="opacity-0" />
                         <path d="M7 3v13h10" strokeWidth="2.5" />
                    </svg>
                );
            case 'screws': // Bag of Screws
                return (
                    <div className="flex gap-2 justify-center mb-6">
                        <div className="w-4 h-12 border border-slate-800 bg-slate-100 rounded-sm relative"><div className="absolute top-1 left-0 right-0 h-px bg-slate-800"/><div className="absolute top-2 left-0 right-0 h-px bg-slate-800"/></div>
                        <div className="w-4 h-12 border border-slate-800 bg-slate-100 rounded-sm relative rotate-12"><div className="absolute top-1 left-0 right-0 h-px bg-slate-800"/><div className="absolute top-2 left-0 right-0 h-px bg-slate-800"/></div>
                        <div className="w-4 h-12 border border-slate-800 bg-slate-100 rounded-sm relative -rotate-6"><div className="absolute top-1 left-0 right-0 h-px bg-slate-800"/><div className="absolute top-2 left-0 right-0 h-px bg-slate-800"/></div>
                    </div>
                );
            case 'tears': // Crying face
                return <Smile className={`${style} rotate-180`} />;
            case 'hammer':
            default:
                return <Hammer className={style} />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 font-mono relative">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-[#0051ba] text-white shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold tracking-widest uppercase">Hëxäflëx</h2>
                        <p className="text-[10px] opacity-70">Assembly Instructions</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
                
                {!manual ? (
                    <div className="w-full max-w-lg mt-12 text-center">
                        <div className="w-32 h-32 mx-auto mb-8 border-4 border-slate-900 rounded-full flex items-center justify-center relative">
                            <div className="w-20 h-4 bg-slate-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                            <div className="w-4 h-20 bg-slate-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                        </div>
                        
                        <h1 className="text-3xl font-black uppercase mb-4 tracking-tighter">{t.ikeaIntroTitle}</h1>
                        <p className="text-slate-600 mb-8 font-sans">{t.ikeaIntroDesc}</p>
                        
                        <form onSubmit={handleGenerate} className="relative">
                            <input 
                                type="text"
                                value={problem}
                                onChange={e => setProblem(e.target.value)}
                                placeholder={t.ikeaProblemPlaceholder}
                                className="w-full border-4 border-slate-900 p-4 text-xl font-bold uppercase placeholder:text-slate-300 focus:outline-none focus:bg-yellow-50"
                            />
                            <button 
                                type="submit"
                                disabled={loading || !problem}
                                className="absolute right-2 top-2 bottom-2 bg-[#ffda1a] text-[#0051ba] px-6 font-bold uppercase hover:bg-[#ffe14a] disabled:opacity-50 transition-colors"
                            >
                                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : t.gameAssemble}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl bg-white border-2 border-slate-200 shadow-xl min-h-[500px] flex flex-col relative">
                        {/* Manual Header */}
                        <div className="p-8 border-b-2 border-slate-100 flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 leading-none">{manual.productName}</h1>
                                <p className="text-slate-500 font-sans italic">{manual.description}</p>
                            </div>
                            <div className="border-4 border-slate-900 p-2 font-bold text-xl w-16 h-16 flex items-center justify-center rounded-full shrink-0">
                                {stepIndex + 1}
                            </div>
                        </div>

                        {/* Manual Step Content */}
                        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={stepIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="w-full"
                                >
                                    {/* Visual Diagram */}
                                    <div className="w-full aspect-video border-2 border-slate-900 mb-8 relative bg-white flex items-center justify-center p-8">
                                        {/* "Figure" Label */}
                                        <div className="absolute top-2 left-2 text-xs font-bold uppercase tracking-widest">Fig. {stepIndex + 1}</div>
                                        
                                        {renderMetaphorIcon(manual.steps[stepIndex].visualMetaphor)}
                                        
                                        {/* Decorative Lines */}
                                        <div className="absolute inset-x-8 bottom-8 h-px bg-slate-200" />
                                        <div className="absolute inset-y-8 left-8 w-px bg-slate-200" />
                                    </div>

                                    <h3 className="text-2xl font-bold uppercase mb-4">{manual.steps[stepIndex].title}</h3>
                                    <p className="text-lg font-sans leading-relaxed max-w-lg mx-auto">
                                        {manual.steps[stepIndex].instruction}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Footer */}
                        <div className="p-8 border-t-2 border-slate-100 bg-slate-50 flex justify-between items-center">
                             {stepIndex > 0 ? (
                                <button 
                                    onClick={() => setStepIndex(prev => prev - 1)}
                                    className="font-bold uppercase tracking-widest text-sm hover:underline"
                                >
                                    {t.gamePrevStep}
                                </button>
                             ) : (
                                <div />
                             )}

                             {stepIndex < manual.steps.length - 1 ? (
                                 <button 
                                    onClick={() => setStepIndex(prev => prev + 1)}
                                    className="bg-[#0051ba] text-white px-8 py-3 font-bold uppercase hover:bg-[#00419a] transition-colors"
                                 >
                                    {t.gameNextStep}
                                 </button>
                             ) : (
                                 <button 
                                    onClick={() => setManual(null)}
                                    className="bg-[#ffda1a] text-[#0051ba] px-8 py-3 font-bold uppercase hover:bg-[#ffe14a] transition-colors"
                                 >
                                    {t.gameFinish}
                                 </button>
                             )}
                        </div>

                        {/* Disclaimer */}
                        <div className="absolute bottom-1 left-0 right-0 text-center">
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest pb-1 max-w-xs mx-auto truncate">{manual.missingPartDisclaimer}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IkeaBuilder;
