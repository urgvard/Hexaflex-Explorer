import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, Sun, Moon, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignUpPageProps {
    onBackToLogin: () => void;
    onSignedUp: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onBackToLogin, onSignedUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const theme = {
        bg: isDarkMode ? 'bg-[#020617]' : 'bg-slate-50',
        textMain: isDarkMode ? 'text-white' : 'text-slate-900',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        inputBg: isDarkMode ? 'bg-[#1e293b] border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400',
        inputIcon: isDarkMode ? 'text-slate-500' : 'text-slate-400',
        toggleBtn: isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-400 hover:text-slate-600 shadow-sm hover:bg-slate-100',
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        });

        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
        } else {
            onSignedUp();
        }
    };

    return (
        <div className="flex min-h-screen w-full font-sans overflow-hidden bg-[#0f172a]">
            {/* Left Side - Brand */}
            <div className="hidden md:flex w-1/2 bg-[#0f172a] relative items-center justify-center overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-emerald-900/30 rounded-full blur-[120px]" />
                <div className="relative z-10 flex flex-col items-center p-12">
                    <div className="relative w-80 h-80 mb-8">
                        <motion.svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}>
                            <defs>
                                <filter id="glow-logo" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>
                            <g filter="url(#glow-logo)" style={{ mixBlendMode: 'screen' }}>
                                <circle cx="200" cy="110" r="85" fill="#99f6e4" fillOpacity="0.5" />
                                <circle cx="278" cy="155" r="85" fill="#c4b5fd" fillOpacity="0.5" />
                                <circle cx="278" cy="245" r="85" fill="#fde68a" fillOpacity="0.5" />
                                <circle cx="200" cy="290" r="85" fill="#fecaca" fillOpacity="0.5" />
                                <circle cx="122" cy="245" r="85" fill="#e9d5ff" fillOpacity="0.5" />
                                <circle cx="122" cy="155" r="85" fill="#bfdbfe" fillOpacity="0.5" />
                            </g>
                            <path d="M200 180 C210 180, 215 170, 215 160 C215 150, 210 145, 200 145 C190 145, 185 150, 185 160 C185 170, 190 180, 200 180 Z M200 185 C180 185, 165 210, 165 230 L165 240 L180 240 C180 240, 190 230, 200 230 C210 230, 220 240, 220 240 L235 240 L235 230 C235 210, 220 185, 200 185 Z"
                                fill="white" fillOpacity="0.8" transform="translate(0, 10)" />
                        </motion.svg>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="text-center">
                        <h1 className="text-6xl font-serif text-white tracking-widest uppercase mb-4 drop-shadow-lg">Hexaflex</h1>
                        <p className="text-sm text-emerald-100 uppercase tracking-[0.4em] font-medium opacity-80">Psychological Flexibility</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative transition-colors duration-500 overflow-y-auto ${theme.bg}`}>
                <button onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-300 ${theme.toggleBtn}`}>
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center md:text-left mb-6">
                        <h2 className={`text-3xl font-bold tracking-tight ${theme.textMain}`}>Request Access</h2>
                        <p className={`mt-3 ${theme.textMuted}`}>Create an account. Your request will be reviewed and approved before you can log in.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignUp}>
                        <div>
                            <label className={`block text-xs font-bold uppercase mb-2 ml-1 ${theme.textMuted}`}>Full Name</label>
                            <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${theme.inputIcon}`}>
                                    <User className="h-5 w-5" />
                                </div>
                                <input type="text" required
                                    className={`block w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${theme.inputBg}`}
                                    placeholder="Your name"
                                    value={fullName}
                                    onChange={(e) => { setFullName(e.target.value); setError(''); }} />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase mb-2 ml-1 ${theme.textMuted}`}>Email</label>
                            <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${theme.inputIcon}`}>
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input type="email" required
                                    className={`block w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${theme.inputBg}`}
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }} />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase mb-2 ml-1 ${theme.textMuted}`}>Password</label>
                            <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${theme.inputIcon}`}>
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input type="password" required minLength={8}
                                    className={`block w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${theme.inputBg}`}
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }} />
                            </div>
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/30 rounded-lg py-2 px-3">
                                {error}
                            </motion.p>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg">
                            {loading ? 'Sending request...' : 'Request Access'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <button onClick={onBackToLogin}
                        className={`flex items-center gap-2 text-sm transition-colors ${theme.textMuted} hover:text-emerald-400`}>
                        <ArrowLeft className="w-4 h-4" /> Back to login
                    </button>

                    <div className={`text-center text-xs mt-8 ${theme.textMuted}`}>
                        <p>&copy; {new Date().getFullYear()} Jesper Kähr. All rights reserved.</p>
                        <a href="mailto:jesper.kahr@protonmail.com" className="hover:opacity-80 transition-opacity">jesper.kahr@protonmail.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
