'use client';

import React from 'react';
import { Shield, Plus, Lock, Globe } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function NetworkPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Network Restrictions
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Control access to your database with IP allowlisting and network policies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            Add Restriction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No network restrictions"
          description="Restrict database access to specific IP addresses or CIDR ranges. By default, your database is accessible from anywhere."
          icon={Shield}
          actionLabel="Add Restriction"
          onAction={() => console.log('Add restriction')}
          secondaryActionLabel="Network Docs"
          onSecondaryAction={() => console.log('Network docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Shield size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">IP Allowlisting</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Only allow connections from trusted IP addresses and ranges.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Lock size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">CIDR Ranges</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Define network blocks using CIDR notation for granular control.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Globe size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Audit Trail</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Track changes to your network policies with full audit logs.</p>
        </div>
      </div>
    </div>
  );
}
