import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Sun, Moon, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
    onSignUpClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignUpClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [micAllowed, setMicAllowed] = useState(false);

    const requestMic = async () => {
        if (micAllowed) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setMicAllowed(true);
        } catch (err) {
            console.error('Mic permission denied:', err);
            setMicAllowed(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        setLoading(false);

        if (signInError) {
            setError('Invalid email or password.');
        }
        // On success, App.tsx will detect the session change and handle navigation
    };

    const theme = {
        bg: isDarkMode ? 'bg-[#020617]' : 'bg-slate-50',
        textMain: isDarkMode ? 'text-white' : 'text-slate-900',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        inputBg: isDarkMode ? 'bg-[#1e293b] border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400',
        inputIcon: isDarkMode ? 'text-slate-500' : 'text-slate-400',
        cardBg: isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-slate-50 border-slate-200',
        cardText: isDarkMode ? 'text-slate-300' : 'text-slate-600',
        toggleBtn: isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-400 hover:text-slate-600 shadow-sm hover:bg-slate-100',
    };

    return (
        <div className="flex min-h-screen w-full font-sans overflow-hidden bg-[#0f172a]">
            {/* Left Side - Brand & Logo */}
            <div className="hidden md:flex w-1/2 bg-[#0f172a] relative items-center justify-center overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-emerald-900/30 rounded-full blur-[120px]" />

                <div className="relative z-10 flex flex-col items-center p-12">
                    <div className="relative w-80 h-80 mb-8">
                        <motion.svg
                            viewBox="0 0 400 400"
                            className="w-full h-full drop-shadow-2xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <defs>
                                <filter id="glow-logo" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
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
                            <path
                                d="M200 180 C210 180, 215 170, 215 160 C215 150, 210 145, 200 145 C190 145, 185 150, 185 160 C185 170, 190 180, 200 180 Z M200 185 C180 185, 165 210, 165 230 L165 240 L180 240 C180 240, 190 230, 200 230 C210 230, 220 240, 220 240 L235 240 L235 230 C235 210, 220 185, 200 185 Z"
                                fill="white" fillOpacity="0.8" transform="translate(0, 10)"
                            />
                        </motion.svg>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-6xl font-serif text-white tracking-widest uppercase mb-4 drop-shadow-lg">Hexaflex</h1>
                        <p className="text-sm text-emerald-100 uppercase tracking-[0.4em] font-medium opacity-80">Psychological Flexibility</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative transition-colors duration-500 overflow-y-auto ${theme.bg}`}>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-300 ${theme.toggleBtn}`}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center md:text-left mb-6">
                        <h2 className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${theme.textMain}`}>Welcome</h2>
                        <p className={`mt-3 transition-colors duration-300 ${theme.textMuted}`}>Enter your credentials to access the explorer.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-2 ml-1 transition-colors duration-300 ${theme.textMuted}`}>Email</label>
                                <div className="relative">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${theme.inputIcon}`}>
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        autoComplete="email"
                                        className={`block w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${theme.inputBg}`}
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase mb-2 ml-1 transition-colors duration-300 ${theme.textMuted}`}>Password</label>
                                <div className="relative">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${theme.inputIcon}`}>
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className={`block w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm ${theme.inputBg}`}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mic Permission */}
                        <div className="pt-2">
                            <div className={`border rounded-2xl p-5 text-center transition-colors duration-300 ${theme.cardBg}`}>
                                <p className={`text-sm font-medium mb-4 ${theme.cardText}`}>Allow this app to request access to:</p>
                                <div
                                    onClick={requestMic}
                                    className={`flex items-center justify-center gap-3 p-3 rounded-xl cursor-pointer select-none transition-all duration-200 border ${micAllowed ? 'bg-emerald-500/10 border-emerald-500/30' : 'border-transparent hover:bg-black/5'} group`}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${micAllowed ? 'bg-emerald-500 border-emerald-500' : (isDarkMode ? 'bg-slate-800 border-slate-600 group-hover:border-slate-500' : 'bg-white border-slate-300 group-hover:border-slate-400')}`}>
                                        {micAllowed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                    </div>
                                    <span className={`text-sm font-bold transition-colors ${micAllowed ? 'text-emerald-500' : theme.textMuted} ${!micAllowed && 'group-hover:opacity-80'}`}>
                                        Microphone
                                    </span>
                                </div>
                                <p className={`text-[10px] mt-4 leading-relaxed max-w-[200px] mx-auto opacity-70 ${theme.textMuted}`}>
                                    This enhances the functionality of the app.
                                </p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`text-sm font-medium text-center p-3 rounded-lg border ${isDarkMode ? 'text-red-400 bg-red-900/20 border-red-500/20' : 'text-red-500 bg-red-50 border-red-100'}`}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'}`}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && (
                                <span className="absolute right-4 inset-y-0 flex items-center">
                                    <ArrowRight className="h-5 w-5 text-emerald-200 group-hover:text-white transition-colors" />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className={`text-center text-sm ${theme.textMuted}`}>
                        Don't have an account?{' '}
                        <button onClick={onSignUpClick} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            Request access
                        </button>
                    </p>

                    <div className={`text-center text-xs mt-8 transition-colors duration-300 ${theme.textMuted}`}>
                        <p>&copy; {new Date().getFullYear()} Hexaflex Explorer.</p>
                        <p className="mt-1">Jesper Kähr. All rights reserved.</p>
                        <a href="mailto:jesper.kahr@protonmail.com" className="hover:opacity-80 transition-opacity">
                            jesper.kahr@protonmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
