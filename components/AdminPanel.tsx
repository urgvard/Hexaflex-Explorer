import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, ToggleLeft, ToggleRight, Check, X, Clock, ShieldCheck, ChevronDown, ChevronUp, KeyRound, Eye, EyeOff } from 'lucide-react';
import { supabase, Profile, AppSettings } from '../lib/supabase';

interface AdminPanelProps {
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [togglingPayments, setTogglingPayments] = useState(false);
    const [expandedSection, setExpandedSection] = useState<'pending' | 'approved' | 'all' | 'password' | null>('pending');

    // Password change state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [savingPassword, setSavingPassword] = useState(false);

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

    const handlePasswordChange = async () => {
        if (newPassword.length < 8) {
            setPasswordMsg({ text: 'Password must be at least 8 characters.', ok: false });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ text: 'Passwords do not match.', ok: false });
            return;
        }
        setSavingPassword(true);
        setPasswordMsg(null);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setSavingPassword(false);
        if (error) {
            setPasswordMsg({ text: error.message, ok: false });
        } else {
            setPasswordMsg({ text: 'Password updated successfully!', ok: true });
            setNewPassword('');
            setConfirmPassword('');
        }
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

    // Plain div — no motion on each row to prevent re-render flicker
    const UserRow = ({ profile, showActions }: { profile: Profile; showActions: boolean }) => (
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-800/40 border border-slate-700/30">
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
        </div>
    );

    type SectionKey = 'pending' | 'approved' | 'all' | 'password';

    // Accordion using CSS max-height instead of Framer Motion height animation (prevents jumping)
    const AccordionSection = ({ title, icon, count, sectionKey, children }: {
        title: string;
        icon: React.ReactNode;
        count?: number;
        sectionKey: SectionKey;
        children: React.ReactNode;
    }) => {
        const isOpen = expandedSection === sectionKey;
        return (
            <div className="border border-slate-700/40 rounded-xl overflow-hidden">
                <button
                    onClick={() => setExpandedSection(isOpen ? null : sectionKey)}
                    className="w-full flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-sm font-semibold text-slate-200">{title}</span>
                        {count !== undefined && (
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{count}</span>
                        )}
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <div
                    style={{
                        maxHeight: isOpen ? '400px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 0.25s ease',
                    }}
                >
                    {children}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ type: 'spring', stiffness: 350, damping: 35 }}
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

                <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
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

                            {/* Pending Users */}
                            <AccordionSection title="Pending Approval" icon={<Clock className="w-4 h-4 text-amber-400" />} count={pending.length} sectionKey="pending">
                                <div className="p-3 space-y-2 max-h-56 overflow-y-auto">
                                    {pending.length === 0
                                        ? <p className="text-slate-500 text-sm text-center py-4">No pending users</p>
                                        : pending.map(p => <UserRow key={p.id} profile={p} showActions={true} />)
                                    }
                                </div>
                            </AccordionSection>

                            {/* Approved Users */}
                            <AccordionSection title="Approved Users" icon={<Check className="w-4 h-4 text-emerald-400" />} count={approved.length} sectionKey="approved">
                                <div className="p-3 space-y-2 max-h-56 overflow-y-auto">
                                    {approved.length === 0
                                        ? <p className="text-slate-500 text-sm text-center py-4">No approved users</p>
                                        : approved.map(p => <UserRow key={p.id} profile={p} showActions={false} />)
                                    }
                                </div>
                            </AccordionSection>

                            {/* All Users */}
                            <AccordionSection title="All Users" icon={<Users className="w-4 h-4 text-slate-400" />} count={profiles.length} sectionKey="all">
                                <div className="p-3 space-y-2 max-h-56 overflow-y-auto">
                                    {profiles.map(p => <UserRow key={p.id} profile={p} showActions={false} />)}
                                </div>
                            </AccordionSection>

                            {/* Change Password */}
                            <AccordionSection title="Change Password" icon={<KeyRound className="w-4 h-4 text-indigo-400" />} sectionKey="password">
                                <div className="p-4 space-y-3">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="New password (min. 8 characters)"
                                            className="w-full bg-slate-800/60 border border-slate-600/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(s => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full bg-slate-800/60 border border-slate-600/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                                    />
                                    {passwordMsg && (
                                        <p className={`text-xs ${passwordMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {passwordMsg.text}
                                        </p>
                                    )}
                                    <button
                                        onClick={handlePasswordChange}
                                        disabled={savingPassword || !newPassword || !confirmPassword}
                                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
                                    >
                                        {savingPassword ? 'Saving...' : 'Update Password'}
                                    </button>
                                </div>
                            </AccordionSection>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminPanel;
