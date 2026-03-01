'use client';

import React from 'react';
import { Rss, Plus, Server, BarChart3 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function LogDrainsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Log Drains
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Stream your platform logs to external logging services and SIEM tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            Add Log Drain
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No log drains configured"
          description="Forward your logs to third-party services like Datadog, Logflare, or custom HTTP endpoints for centralized monitoring."
          icon={Rss}
          actionLabel="Add Log Drain"
          onAction={() => console.log('Add log drain')}
          secondaryActionLabel="Log Drains Docs"
          onSecondaryAction={() => console.log('Log drains docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Rss size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Streaming</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Real-time log forwarding to your preferred observability platform.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Server size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Custom Endpoints</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Send logs to any HTTP endpoint with custom headers and formatting.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <BarChart3 size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Analytics</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Aggregate and analyze your logs with powerful third-party tools.</p>
        </div>
      </div>
    </div>
  );
}
