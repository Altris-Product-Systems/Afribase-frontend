'use client';

import React from 'react';
import { BarChart3, TrendingUp, Database, Zap } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function UsagePage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Usage
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Track resource consumption, API calls, and bandwidth across your projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No usage data yet"
          description="Usage metrics will appear here once your projects start handling requests. Monitor database size, bandwidth, API calls, and more."
          icon={BarChart3}
          actionLabel="View Plans"
          onAction={() => console.log('View plans')}
          secondaryActionLabel="Usage Docs"
          onSecondaryAction={() => console.log('Usage docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Database size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Database Size</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Monitor your database storage consumption and growth trends.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Bandwidth</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Track data transfer across your APIs, storage, and real-time connections.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Zap size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Function Invocations</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">See how many times your edge functions have been executed.</p>
        </div>
      </div>
    </div>
  );
}
