'use client';

import React, { useState, useEffect } from 'react';
import { getProjectUsers, ProjectUser } from '@/lib/api';
import { Users, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Shield, ExternalLink, RefreshCcw } from 'lucide-react';

interface AuthUsersProps {
    projectId: string;
}

export default function AuthUsers({ projectId }: AuthUsersProps) {
    const [users, setUsers] = useState<ProjectUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

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
                                                        {!user.confirmedAt && <span className="bg-orange-500/10 text-orange-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-orange-500/20">Unconfirmed</span>}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors flex items-center gap-1">
                                                        {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-white/5 rounded-lg">
                                                {getUserProviderIcon(user.provider)}
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{user.provider || 'email'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-zinc-300">{formatDate(user.lastSignInAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-zinc-500">{formatDate(user.createdAt)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-zinc-600 hover:text-white transition-colors">
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
                    <p className="text-zinc-500 text-sm font-medium">Use the Afriibase SDK to add Google, GitHub and magic links to your React, Vue or Flutter apps.</p>
                </div>
                <button className="px-6 py-3 bg-zinc-950 border border-white/10 text-white text-[10px] font-black rounded-xl hover:border-emerald-500/50 transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer group">
                    SDK Documentation <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
