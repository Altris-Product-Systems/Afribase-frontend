'use client';

import React from 'react';
import { Server, Settings, Zap, Shield } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function PoolerPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Connection Pooler
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Manage database connection pooling for optimal performance and scalability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="Connection Pooler"
          description="Connection pooling reduces overhead by reusing database connections. Configure pool size, timeout settings, and connection modes."
          icon={Server}
          actionLabel="Configure Pooler"
          onAction={() => console.log('Configure pooler')}
          secondaryActionLabel="Pooler Docs"
          onSecondaryAction={() => console.log('Pooler docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Zap size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Transaction Mode</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Connections are returned to the pool after each transaction for maximum concurrency.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Settings size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Pool Settings</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Configure pool size, idle timeout, and connection lifetime limits.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Shield size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">SSL Mode</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">All pooled connections are encrypted with SSL for secure data transfer.</p>
        </div>
      </div>
    </div>
  );
}
