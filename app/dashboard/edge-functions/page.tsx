'use client';

import React from 'react';
import { Zap, Terminal, Code, Activity } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function EdgeFunctionsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Edge Functions
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Deploy serverless functions globally for low-latency compute.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Zap size={16} strokeWidth={3} />
            Create Function
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No Edge Functions"
          description="Scale your logic to the edge. Edge Functions are Deno-based and triggered via HTTP requests or database hooks."
          icon={Zap}
          actionLabel="Create Function"
          onAction={() => {}}
          secondaryActionLabel="Deno Docs"
          onSecondaryAction={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Code size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Deno Runtime</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Standardized web APIs and built-in security for modern serverless development.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Activity size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Monitoring</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Real-time invocation logs, performance metrics, and error tracking.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Terminal size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">CLI Deploy</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Use the Afribase CLI to deploy functions directly from your local environment.</p>
        </div>
      </div>
    </div>
  );
}
