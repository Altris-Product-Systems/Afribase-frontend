'use client';

import React, { useState, useEffect } from 'react';
import { getProjectUsers, ProjectUser } from '@/lib/api';
import { Users, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Shield, ExternalLink, RefreshCcw, X, Copy, Check, Globe } from 'lucide-react';

interface AuthUsersProps {
    projectId: string;
}

export default function AuthUsers({ projectId }: AuthUsersProps) {
    const [users, setUsers] = useState<ProjectUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, [projectId]);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getProjectUsers(projectId);
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
            setMessage({ type: 'error', text: 'Failed to retrieve project users.' });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Never';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUserProviderIcon = (provider: string) => {
        switch (provider?.toLowerCase()) {
            case 'google': return <GlobeIcon className="text-blue-500" />;
            case 'github': return <GithubIcon className="text-white" />;
            case 'email': return <Mail size={14} className="text-zinc-400" />;
            default: return <Shield size={14} className="text-emerald-500" />;
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Inline icons since lucide might not have these specific brands directly
    const GlobeIcon = ({ className }: { className?: string }) => (
        <svg className={`w-3.5 h-3.5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    );

    const GithubIcon = ({ className }: { className?: string }) => (
        <svg className={`w-3.5 h-3.5 ${className}`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );

    if (isLoading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-zinc-950/50 rounded-3xl border border-white/5 animate-pulse">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 text-sm font-medium">Retrieving project users...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h2 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
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
                        <button className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black rounded-xl transition-all shadow-lg uppercase tracking-widest">
                            Add User
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
                                            <Search size={40} className="mb-4 opacity-20" />
                                            <p className="text-sm font-medium">No users found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:border-emerald-500/30 transition-colors">
                                                    {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        {user.email || 'Anonymous'}
                                                        {!user.confirmed_at && <span className="bg-orange-500/10 text-orange-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-orange-500/20">Unconfirmed</span>}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors flex items-center gap-1">
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
                                                            {getUserProviderIcon(p)}
                                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{p}</span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-zinc-300">{formatDate(user.last_sign_in_at || '')}</span>
                                            </div>
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
                    <div className="flex items-center gap-1 text-[10px] font-black text-zinc-500 uppercase tracking-widest cursor-not-allowed">
                        Prev <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 mx-2" /> 1 <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 mx-2" /> Next
                    </div>
                </div>
            </div>

            {/* Integration Guide */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-white/5 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-xl flex-shrink-0">
                    <span className="text-black font-black text-2xl">A</span>
                </div>
                <div className="flex-1 space-y-1 text-center md:text-left">
                    <h4 className="text-white font-bold">Implement Sign In in minutes</h4>
                    <p className="text-zinc-500 text-sm font-medium">Use the Afribase SDK to add Google, GitHub and magic links to your React, Vue or Flutter apps.</p>
                </div>
                <button className="px-6 py-3 bg-zinc-950 border border-white/10 text-white text-[10px] font-black rounded-xl hover:border-emerald-500/50 transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer group">
                    SDK Documentation <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            {/* Side Drawer for User Details */}
            {selectedUser && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
                        onClick={() => setSelectedUser(null)}
                    />
                    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-zinc-950 border-l border-white/10 z-[101] shadow-2xl animate-slide-in-right flex flex-col">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">User Details</h3>
                                    <p className="text-zinc-500 text-xs font-medium">Full record for user {selectedUser.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            {/* Basic Info Card */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Basic Information</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-zinc-600 uppercase">User ID</span>
                                            <button
                                                onClick={() => copyToClipboard(selectedUser.id, 'id')}
                                                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                {copiedId === 'id' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                <span className="text-[10px] font-mono">{selectedUser.id}</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-zinc-600 uppercase">Email</span>
                                            <span className="text-sm font-bold text-zinc-200">{selectedUser.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-zinc-600 uppercase">Status</span>
                                            {selectedUser.confirmed_at ? (
                                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded border border-emerald-500/20">Active</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded border border-amber-500/20">Pending Confirmation</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Card */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Activity & Status</h4>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase">Created At</p>
                                            <p className="text-sm font-bold text-zinc-300">{formatDate(selectedUser.created_at)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase">Updated At</p>
                                            <p className="text-sm font-bold text-zinc-300">{formatDate(selectedUser.updated_at)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase">Confirmed At</p>
                                            <p className="text-sm font-bold text-zinc-300">{formatDate(selectedUser.confirmed_at || selectedUser.email_confirmed_at || '')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase">Last Sign In</p>
                                            <p className="text-sm font-bold text-zinc-300">{formatDate(selectedUser.last_sign_in_at || '')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Providers & Identities */}
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
                                            <p className="text-xs text-zinc-600">No identities found for this account.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Raw Data (JSON) */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Metadata (Raw JSON)</h4>
                                <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(JSON.stringify(selectedUser, null, 2), 'json')}
                                            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {copiedId === 'json' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <pre className="text-[10px] font-mono text-emerald-500/80 overflow-x-auto max-h-[400px] leading-relaxed custom-scrollbar">
                                        {JSON.stringify(selectedUser, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex gap-3">
                            <button className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                Ban User
                            </button>
                            <button className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                Delete User
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
