'use client';

import React from 'react';
import { ShieldCheck, Lock, Unlock, Zap, Shield } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function PoliciesPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Auth Policies
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Define fine-grained Row Level Security (RLS) policies for your database access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Lock size={16} strokeWidth={3} />
            Enable RLS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
        <div className="lg:col-span-2">
          <EmptyState
            title="No policies defined"
            description="Protect your data by defining who can read, update or delete rows. Policies use SQL expressions to filter access."
            icon={ShieldCheck}
            actionLabel="Create Policy"
            onAction={() => console.log('Create policy')}
            secondaryActionLabel="RLS Documentation"
            onSecondaryAction={() => console.log('Docs')}
          />
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">RLS Status</h4>
              <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-rose-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Database Vulnerable</span>
                </div>
                <Unlock size={14} className="text-rose-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <Zap size={14} />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-white uppercase">Fastest Access</h5>
                  <p className="text-[9px] text-zinc-500 leading-tight">Policies are executed at the database level for maximum performance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <Shield size={14} />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-white uppercase">Secure Defaults</h5>
                  <p className="text-[9px] text-zinc-500 leading-tight">By default, all rows are hidden until you grant explicit access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
