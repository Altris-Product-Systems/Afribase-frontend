'use client';

import React from 'react';
import { Activity, Plus, Clock, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function CronPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Cron Jobs
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Schedule recurring tasks and automate background processes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            Create Cron Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No cron jobs configured"
          description="Set up scheduled tasks to run at defined intervals. Ideal for database cleanups, report generation, and automated workflows."
          icon={Activity}
          actionLabel="Create Cron Job"
          onAction={() => console.log('Create cron job')}
          secondaryActionLabel="Cron Docs"
          onSecondaryAction={() => console.log('Cron docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Clock size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Scheduling</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Define cron expressions or use simple intervals to trigger your jobs.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <RefreshCw size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Retry Logic</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Configure automatic retries and error handling for resilient automation.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Activity size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Execution Logs</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Monitor run history and debug issues with detailed execution logs.</p>
        </div>
      </div>
    </div>
  );
}
