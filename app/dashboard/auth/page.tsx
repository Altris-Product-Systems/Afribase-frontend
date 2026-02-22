'use client';

import React from 'react';
import { Users, ShieldCheck, Mail, Key } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function AuthPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Authentication
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Securely manage your users, social login, and access control policies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No users found"
          description="Authentication is configured but no users have signed up yet. You can manually add a user or start integrating our Auth SDK."
          icon={Users}
          actionLabel="Add User"
          onAction={() => console.log('Add user')}
          secondaryActionLabel="Auth Settings"
          onSecondaryAction={() => console.log('Auth settings')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Mail size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Providers</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Enable Email, Google, Slack, and other social login providers.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Policies</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Define fine-grained Row Level Security (RLS) for your data.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Key size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Sessions</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Monitor active user sessions and manage access tokens.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">User Groups</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Organize users into groups and assign global permissions.</p>
        </div>
      </div>
    </div>
  );
}
