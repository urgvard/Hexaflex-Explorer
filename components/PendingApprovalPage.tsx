import React from 'react';
import { motion } from 'framer-motion';
import { Clock, LogOut, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PendingApprovalPageProps {
    email: string;
}

const PendingApprovalPage: React.FC<PendingApprovalPageProps> = ({ email }) => {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#0f172a] p-8">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-emerald-900/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 max-w-md w-full text-center"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="w-20 h-20 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <Clock className="w-10 h-10 text-amber-400" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">Pending Approval</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Your account request has been received. The administrator will review and approve your access shortly.
                </p>

                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 mb-8 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-left">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Registered as</p>
                        <p className="text-slate-200 text-sm font-medium">{email}</p>
                    </div>
                </div>

                <p className="text-slate-500 text-sm mb-8">
                    You'll be able to log in once your account is approved. No further action needed on your part.
                </p>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mx-auto"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </motion.div>
        </div>
    );
};

export default PendingApprovalPage;
