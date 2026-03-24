

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI_TEXT, REFERENCES } from '../constants';
import { Language, Theme } from '../types';
import { X, ExternalLink, Library, Book, Globe, FileText } from 'lucide-react';

interface ReferenceLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
}

const ReferenceLibrary: React.FC<ReferenceLibraryProps> = ({ isOpen, onClose, lang, theme }) => {
  const t = UI_TEXT[lang];

  // Group references by type
  const organizations = REFERENCES.filter(r => r.type === 'organization');
  const books = REFERENCES.filter(r => r.type === 'book');
  const research = REFERENCES.filter(r => ['article', 'tool'].includes(r.type));

  // Theme Styles
  const modalBg = theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200';
  const headerBg = theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100';
  const textTitle = theme === 'dark' ? 'text-slate-100' : 'text-slate-800';
  const textSub = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const sectionTitle = theme === 'dark' ? 'text-blue-200' : 'text-blue-800';
  const cardBg = theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-50 hover:bg-slate-100 border-slate-200';
  const linkText = theme === 'dark' ? 'text-blue-300' : 'text-blue-600';

  const renderSection = (title: string, items: typeof REFERENCES, icon: React.ReactNode) => (
      <div className="mb-8 last:mb-0">
          <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${sectionTitle} opacity-80`}>
              {icon} {title}
          </h3>
          <div className="grid grid-cols-1 gap-3">
              {items.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${cardBg}`}
                  >
                      <div>
                          <div className={`font-medium text-sm md:text-base mb-0.5 group-hover:underline ${textTitle}`}>
                              {item.title}
                          </div>
                          {item.author && (
                              <div className={`text-xs ${textSub}`}>
                                  {item.author}
                              </div>
                          )}
                      </div>
                      <ExternalLink className={`w-4 h-4 opacity-50 group-hover:opacity-100 ${linkText}`} />
                  </a>
              ))}
          </div>
      </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-end p-4 pt-28 md:pr-8 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20, x: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20, x: 20 }}
            className={`pointer-events-auto relative w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-140px)] ${modalBg}`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center shrink-0 ${headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Library className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${textTitle}`}>{t.libraryTitle}</h2>
                        <p className={`text-xs uppercase tracking-wider ${textSub}`}>{t.librarySubtitle}</p>
                    </div>
                </div>
                <button onClick={onClose} className={`p-2 rounded-full transition-colors relative z-50 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-black/5 text-slate-400 hover:text-slate-700'}`}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
                {renderSection(t.sectionOrgs, organizations, <Globe className="w-4 h-4" />)}
                {renderSection(t.sectionBooks, books, <Book className="w-4 h-4" />)}
                {renderSection(t.sectionResearch, research, <FileText className="w-4 h-4" />)}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReferenceLibrary;
