'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Plus, Database, ChevronRight, Eye, ShieldAlert } from 'lucide-react';

interface AuthPoliciesProps {
    projectId: string;
}

export default function AuthPolicies({ projectId }: AuthPoliciesProps) {
    const [activeTab, setActiveTab] = useState<'public' | 'auth' | 'private'>('public');

    const policies = [
        { id: 1, table: 'profiles', name: 'Public profiles are viewable by everyone', action: 'SELECT', role: 'anon', condition: 'true', type: 'public' },
        { id: 2, table: 'profiles', name: 'Users can update their own profiles', action: 'UPDATE', role: 'authenticated', condition: 'auth.uid() = id', type: 'auth' },
        { id: 3, table: 'posts', name: 'Individuals can delete their own posts', action: 'DELETE', role: 'authenticated', condition: 'auth.uid() = author_id', type: 'auth' },
        { id: 4, table: 'posts', name: 'Drafts are only visible to authors', action: 'SELECT', role: 'authenticated', condition: 'auth.uid() = author_id OR status = "published"', type: 'auth' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h2 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500" size={32} />
                        Auth Policies (RLS)
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
                        Define fine-grained access control rules for your database tables. Row Level Security ensure that users can only access data they are permitted to see.
                    </p>
                </div>
                <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black rounded-xl transition-all shadow-lg uppercase tracking-widest flex items-center gap-2">
                    <Plus size={16} /> New Policy
                </button>
            </div>

            {/* RLS Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">Global Status</div>
                        <div className="text-xl font-black text-white">RLS ENABLED</div>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                        <Database className="text-zinc-400" size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protected Tables</div>
                        <div className="text-xl font-black text-white">12</div>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                        <Lock className="text-zinc-400" size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Policies</div>
                        <div className="text-xl font-black text-white">24</div>
                    </div>
                </div>
            </div>

            {/* Policies List */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('public')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'public' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Public Access
                    </button>
                    <button
                        onClick={() => setActiveTab('auth')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'auth' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Authenticated
                    </button>
                    <button
                        onClick={() => setActiveTab('private')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'private' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Private/System
                    </button>
                </div>

                <div className="divide-y divide-white/5">
                    {policies.map(policy => (
                        <div key={policy.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/[0.02] transition-colors cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    {policy.role === 'anon' ? <Unlock className="text-zinc-600" size={18} /> : <Lock className="text-emerald-500" size={18} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-zinc-800 border border-white/5 rounded text-[8px] font-mono text-zinc-400 uppercase tracking-tighter">TABLE: {policy.table}</span>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${policy.action === 'SELECT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : policy.action === 'DELETE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{policy.action}</span>
                                    </div>
                                    <h4 className="text-white font-bold text-sm mb-2 font-mono tracking-tight group-hover:text-emerald-400 transition-colors">{policy.name}</h4>
                                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                                        <code className="text-[10px] text-zinc-500 font-mono italic">USING ({policy.condition})</code>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2.5 bg-zinc-900 border border-white/10 rounded-xl text-zinc-500 hover:text-white transition-colors">
                                    <Eye size={16} />
                                </button>
                                <button className="px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                                    Edit Rule
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-zinc-900/30 border-t border-white/5 flex flex-col items-center text-center">
                    <ShieldAlert className="text-emerald-500/20 mb-4" size={48} />
                    <p className="text-zinc-500 text-xs font-medium max-w-sm mb-6">
                        Policies are applied directly to the PostgreSQL database at the storage level. No malicious client can bypass these rules.
                    </p>
                    <button className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
                        Learn about RLS & JWT <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
