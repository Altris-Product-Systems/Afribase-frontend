'use client';

import React, { useState, useEffect } from 'react';
import { getProjectUsers, createProjectUser, banProjectUser, deleteProjectUser, ProjectUser } from '@/lib/api';
import { Users, Search, Filter, MoreHorizontal, Mail, Calendar, Shield, ExternalLink, RefreshCcw, X, Copy, Check, Globe, Plus, Eye, EyeOff, Trash2, Ban, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthUsersProps {
    projectId: string;
}

export default function AuthUsers({ projectId }: AuthUsersProps) {
    const [users, setUsers] = useState<ProjectUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Add User Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newConfirm, setNewConfirm] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Actions
    const [actionLoading, setActionLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [projectId]);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getProjectUsers(projectId);
            setUsers(data);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to retrieve project users.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!newEmail || !newPassword) {
            toast.error('Email and password are required.');
            return;
        }
        setIsCreating(true);
        try {
            const created = await createProjectUser(projectId, {
                email: newEmail,
                password: newPassword,
                confirm: newConfirm,
            });
            setUsers(prev => [created, ...prev]);
            setShowAddModal(false);
            setNewEmail('');
            setNewPassword('');
            toast.success(`User ${created.email} created successfully!`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to create user.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleBanToggle = async (user: ProjectUser) => {
        setActionLoading(true);
        const isBanned = !!user.banned_until && new Date(user.banned_until) > new Date();
        try {
            const updated = await banProjectUser(projectId, user.id, isBanned ? 'none' : '8760h');
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            setSelectedUser(updated);
            toast.success(isBanned ? `User ${user.email} has been unbanned.` : `User ${user.email} has been banned for 1 year.`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update ban status.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (user: ProjectUser) => {
        setActionLoading(true);
        try {
            await deleteProjectUser(projectId, user.id, false);
            setUsers(prev => prev.filter(u => u.id !== user.id));
            setSelectedUser(null);
            setShowDeleteConfirm(false);
            toast.success(`User ${user.email} has been permanently deleted.`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to delete user.');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getUserProviderIcon = (provider: string) => {
        switch (provider?.toLowerCase()) {
            case 'google': return <GlobeIcon className="text-blue-400" />;
            case 'github': return <GithubIcon className="text-zinc-300" />;
            case 'email': return <Mail size={14} className="text-zinc-400" />;
            default: return <Shield size={14} className="text-emerald-500" />;
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const GlobeIcon = ({ className }: { className?: string }) => (
        <svg className={`w-3.5 h-3.5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    );

    const GithubIcon = ({ className }: { className?: string }) => (
        <svg className={`w-3.5 h-3.5 ${className}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );

    if (isLoading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-zinc-950/50 rounded-3xl border border-white/5">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 text-sm font-medium">Retrieving project users...</p>
            </div>
        );
    }

    const isBanned = (user: ProjectUser) => !!user.banned_until && new Date(user.banned_until) > new Date();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
                        <Users className="text-emerald-500" size={32} />
                        Project Users
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
                        Manage everyone who has signed up to your application. View their login method, status, and metadata.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Total Users</span>
                        <span className="text-xl font-black text-white">{users.length}</span>
                    </div>
                    <button
                        onClick={loadUsers}
                        className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-emerald-400 transition-colors"
                    >
                        <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Table & Controls */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                {/* Controls */}
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search users by email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-xs font-black text-zinc-400 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest">
                            <Filter size={14} /> Filter
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black rounded-xl transition-all shadow-lg uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Add User
                        </button>
                    </div>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.01]">
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Provider</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Last Sign In</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Created</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-zinc-600">
                                            <Users size={40} className="mb-4 opacity-20" />
                                            <p className="text-sm font-medium">No users found matching your criteria</p>
                                            <p className="text-xs mt-1 text-zinc-700">Users who sign up to your app will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className={`group hover:bg-white/[0.02] transition-colors ${isBanned(user) ? 'opacity-60' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:border-emerald-500/30 transition-colors">
                                                    {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                                                        {user.email || 'Anonymous'}
                                                        {!user.confirmed_at && !user.email_confirmed_at && (
                                                            <span className="bg-orange-500/10 text-orange-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-orange-500/20">Unconfirmed</span>
                                                        )}
                                                        {isBanned(user) && (
                                                            <span className="bg-red-500/10 text-red-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-red-500/20">Banned</span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
                                                        {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-white/5 rounded-lg">
                                                {(() => {
                                                    const p = user.app_metadata?.provider || user.identities?.[0]?.provider || 'email';
                                                    return (
                                                        <>
                                                            {getUserProviderIcon(p as string)}
                                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{p as string}</span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-zinc-300">{formatDate(user.last_sign_in_at)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-zinc-500">{formatDate(user.created_at)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 text-zinc-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        Showing {filteredUsers.length} of {users.length} users
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        Prev <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 mx-2" /> 1 <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 mx-2" /> Next
                    </div>
                </div>
            </div>

            {/* Integration Guide */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-white/5 flex flex-col md:flex-row items-center gap-6">
                <img src="/AFR.png" alt="Afribase Logo" className="h-16 w-auto object-contain drop-shadow-lg flex-shrink-0" />
                <div className="flex-1 space-y-1 text-center md:text-left">
                    <h4 className="text-white font-bold">Implement Sign In in minutes</h4>
                    <p className="text-zinc-500 text-sm font-medium">Use the Afribase SDK to add Google, GitHub and magic links to your React, Vue or Flutter apps.</p>
                </div>
                <button className="px-6 py-3 bg-zinc-950 border border-white/10 text-white text-[10px] font-black rounded-xl hover:border-emerald-500/50 transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer group">
                    SDK Documentation <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* ── Add User Modal ─────────────────────────────────────────── */}
            {showAddModal && (
                <>
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" onClick={() => setShowAddModal(false)} />
                    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl z-[101] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white">Create User</h3>
                                <p className="text-zinc-500 text-xs mt-1">Manually add a user to this project</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder-zinc-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder-zinc-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div
                                    onClick={() => setNewConfirm(!newConfirm)}
                                    className={`w-11 h-6 rounded-full relative transition-all ${newConfirm ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                                >
                                    <div className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow transition-transform ${newConfirm ? 'translate-x-5' : ''}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-200">Auto-confirm email</p>
                                    <p className="text-[10px] text-zinc-600">Skip email verification for this user</p>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateUser}
                                disabled={isCreating || !newEmail || !newPassword}
                                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {isCreating ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Plus size={14} />}
                                {isCreating ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ── User Detail Drawer ─────────────────────────────────────── */}
            {selectedUser && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => { setSelectedUser(null); setShowDeleteConfirm(false); }} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-zinc-950 border-l border-white/10 z-[101] shadow-2xl flex flex-col">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                    <Users size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">User Details</h3>
                                    <p className="text-zinc-500 text-xs font-medium truncate max-w-[220px]">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedUser(null); setShowDeleteConfirm(false); }} className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Basic Information</h4>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase">User ID</span>
                                        <button onClick={() => copyToClipboard(selectedUser.id, 'id')} className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
                                            {copiedId === 'id' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                            <span className="text-[10px] font-mono">{selectedUser.id.slice(0, 24)}...</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase">Email</span>
                                        <span className="text-sm font-bold text-zinc-200">{selectedUser.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase">Status</span>
                                        {isBanned(selectedUser) ? (
                                            <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-black uppercase rounded border border-red-500/20">Banned</span>
                                        ) : selectedUser.confirmed_at || selectedUser.email_confirmed_at ? (
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded border border-emerald-500/20">Active</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded border border-amber-500/20">Pending Confirmation</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Activity & Status</h4>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { label: 'Created At', value: formatDate(selectedUser.created_at) },
                                            { label: 'Updated At', value: formatDate(selectedUser.updated_at) },
                                            { label: 'Confirmed At', value: formatDate(selectedUser.confirmed_at || selectedUser.email_confirmed_at) },
                                            { label: 'Last Sign In', value: formatDate(selectedUser.last_sign_in_at) },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="space-y-1">
                                                <p className="text-[10px] font-black text-zinc-600 uppercase">{label}</p>
                                                <p className="text-xs font-bold text-zinc-300">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Identities */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Connected Identities</h4>
                                <div className="space-y-3">
                                    {selectedUser.identities?.length > 0 ? (
                                        selectedUser.identities.map((identity) => (
                                            <div key={identity.identity_id} className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5">
                                                        {getUserProviderIcon(identity.provider)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white capitalize">{identity.provider}</p>
                                                        <p className="text-[10px] font-medium text-zinc-500">{identity.email || 'No email attached'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Last Sync</p>
                                                    <p className="text-[10px] font-bold text-zinc-400">{formatDate(identity.last_sign_in_at)}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center bg-zinc-900/20 border border-white/5 border-dashed rounded-2xl">
                                            <p className="text-xs text-zinc-600">No external identities found for this account.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Raw Metadata */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Metadata (Raw JSON)</h4>
                                <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                        </div>
                                        <button onClick={() => copyToClipboard(JSON.stringify(selectedUser, null, 2), 'json')} className="p-1.5 text-zinc-500 hover:text-white transition-colors">
                                            {copiedId === 'json' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <pre className="text-[10px] font-mono text-emerald-500/80 overflow-x-auto max-h-[300px] leading-relaxed">
                                        {JSON.stringify({ user_metadata: selectedUser.user_metadata, app_metadata: selectedUser.app_metadata }, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex-shrink-0 space-y-3">
                            {showDeleteConfirm ? (
                                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertTriangle size={16} />
                                        <p className="text-xs font-black uppercase tracking-widest">Confirm Permanent Deletion</p>
                                    </div>
                                    <p className="text-xs text-zinc-500">This will permanently delete <span className="text-white font-bold">{selectedUser.email}</span> and all their data.</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all hover:text-white">Cancel</button>
                                        <button onClick={() => handleDelete(selectedUser)} disabled={actionLoading} className="flex-1 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1">
                                            {actionLoading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 size={12} />}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleBanToggle(selectedUser)}
                                        disabled={actionLoading}
                                        className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {actionLoading ? <div className="w-3 h-3 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" /> : <Ban size={14} />}
                                        {isBanned(selectedUser) ? 'Unban User' : 'Ban User'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={14} /> Delete User
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
