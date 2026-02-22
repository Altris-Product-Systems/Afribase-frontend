'use client';

import React from 'react';
import { Activity, Search, Filter, Trash2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function LogsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Platform Logs
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Monitor infrastructure health and troubleshoot issues in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
            <Filter size={14} />
            Filter
          </button>
          <button className="h-10 w-10 flex items-center justify-center border border-white/5 rounded-xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No logs found"
          description="Your platform is running smoothly. Logs will appear here as your services are accessed and infrastructure events occur."
          icon={Activity}
          actionLabel="Real-time Stream"
          onAction={() => console.log('Stream')}
          secondaryActionLabel="Log Settings"
          onSecondaryAction={() => console.log('Log settings')}
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5 animate-pulse">
        <div className="h-12 bg-white/[0.02] border-b border-white/5 px-6 flex items-center gap-6">
          <div className="w-24 h-3 bg-zinc-800 rounded" />
          <div className="w-32 h-3 bg-zinc-800 rounded" />
          <div className="flex-1 h-3 bg-zinc-800 rounded" />
        </div>
        <div className="p-8 space-y-4 bg-[#0c0c0e]">
          <div className="h-4 bg-zinc-800/30 rounded w-3/4" />
          <div className="h-4 bg-zinc-800/30 rounded w-1/2" />
          <div className="h-4 bg-zinc-800/30 rounded w-2/3" />
          <div className="h-4 bg-zinc-800/30 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
