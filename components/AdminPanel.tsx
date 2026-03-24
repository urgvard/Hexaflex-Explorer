import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ToggleLeft, ToggleRight, Check, X, Clock, ShieldCheck, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { supabase, Profile, AppSettings } from '../lib/supabase';

interface AdminPanelProps {
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [togglingPayments, setTogglingPayments] = useState(false);
    const [expandedSection, setExpandedSection] = useState<'pending' | 'approved' | 'all' | null>('pending');

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [profilesRes, settingsRes] = await Promise.all([
            supabase.from('profiles').select('*').order('created_at', { ascending: false }),
            supabase.from('app_settings').select('*').eq('id', 1).single(),
        ]);
        if (profilesRes.data) setProfiles(profilesRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const approveUser = async (userId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('profiles').update({
            role: 'approved',
            approved_at: new Date().toISOString(),
            approved_by: user?.email ?? 'admin',
        }).eq('id', userId);
        setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: 'approved' } : p));
    };

    const rejectUser = async (userId: string) => {
        await supabase.from('profiles').update({ role: 'rejected' }).eq('id', userId);
        setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: 'rejected' } : p));
    };

    const togglePayments = async () => {
        if (!settings) return;
        setTogglingPayments(true);
        const newValue = !settings.payments_enabled;
        await supabase.from('app_settings').update({
            payments_enabled: newValue,
            updated_at: new Date().toISOString(),
        }).eq('id', 1);
        setSettings(prev => prev ? { ...prev, payments_enabled: newValue } : prev);
        setTogglingPayments(false);
    };

    const pending = profiles.filter(p => p.role === 'pending');
    const approved = profiles.filter(p => p.role === 'approved');
    const rejected = profiles.filter(p => p.role === 'rejected');

    const RoleBadge = ({ role }: { role: Profile['role'] }) => {
        const styles: Record<string, string> = {
            super_admin: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
            approved: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
            pending: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
            rejected: 'bg-red-900/40 text-red-300 border-red-700/40',
        };
        return (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${styles[role]}`}>
                {role.replace('_', ' ')}
            </span>
        );
    };

    const UserRow = ({ profile, showActions }: { profile: Profile; showActions: boolean }) => (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-800/40 border border-slate-700/30"
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{profile.full_name || 'No name'}</p>
                <p className="text-xs text-slate-400 truncate">{profile.email}</p>
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
                <RoleBadge role={profile.role} />
                {showActions && (
                    <>
                        <button onClick={() => approveUser(profile.id)}
                            className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-700/50 border border-emerald-700/40 text-emerald-400 transition-colors"
                            title="Approve">
                            <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => rejectUser(profile.id)}
                            className="p-1.5 rounded-lg bg-red-900/40 hover:bg-red-700/50 border border-red-700/40 text-red-400 transition-colors"
                            title="Reject">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );

    const Section = ({ title, icon, count, sectionKey, users, showActions }: {
        title: string; icon: React.ReactNode; count: number;
        sectionKey: 'pending' | 'approved' | 'all'; users: Profile[]; showActions: boolean;
    }) => (
        <div className="border border-slate-700/40 rounded-xl overflow-hidden">
            <button
                onClick={() => setExpandedSection(expandedSection === sectionKey ? null : sectionKey)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-semibold text-slate-200">{title}</span>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{count}</span>
                </div>
                {expandedSection === sectionKey ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            <AnimatePresence>
                {expandedSection === sectionKey && (
                    <motion.div
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                            {users.length === 0
                                ? <p className="text-slate-500 text-sm text-center py-4">None</p>
                                : users.map(p => <UserRow key={p.id} profile={p} showActions={showActions} />)
                            }
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-[#0f172a] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-900/40 border border-purple-700/40 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold">Admin Panel</h2>
                            <p className="text-xs text-slate-500">Hexaflex Explorer</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
                    {loading ? (
                        <p className="text-slate-400 text-center py-8">Loading...</p>
                    ) : (
                        <>
                            {/* Payment Toggle */}
                            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Payment Gate</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {settings?.payments_enabled
                                                ? 'Users must subscribe to access the app'
                                                : 'Free access — payments disabled'}
                                        </p>
                                    </div>
                                    <button onClick={togglePayments} disabled={togglingPayments}
                                        className="transition-colors disabled:opacity-50">
                                        {settings?.payments_enabled
                                            ? <ToggleRight className="w-10 h-10 text-emerald-400" />
                                            : <ToggleLeft className="w-10 h-10 text-slate-500" />}
                                    </button>
                                </div>
                            </div>

                            {/* Stats Bar */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Pending', value: pending.length, color: 'text-amber-400' },
                                    { label: 'Approved', value: approved.length, color: 'text-emerald-400' },
                                    { label: 'Rejected', value: rejected.length, color: 'text-red-400' },
                                ].map(s => (
                                    <div key={s.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 text-center">
                                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* User Sections */}
                            <Section title="Pending Approval" icon={<Clock className="w-4 h-4 text-amber-400" />}
                                count={pending.length} sectionKey="pending" users={pending} showActions={true} />
                            <Section title="Approved Users" icon={<Check className="w-4 h-4 text-emerald-400" />}
                                count={approved.length} sectionKey="approved" users={approved} showActions={false} />
                            <Section title="All Users" icon={<Users className="w-4 h-4 text-slate-400" />}
                                count={profiles.length} sectionKey="all" users={profiles} showActions={false} />
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminPanel;
