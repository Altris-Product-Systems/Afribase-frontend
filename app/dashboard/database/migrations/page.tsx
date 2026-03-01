'use client';

import React from 'react';
import { ChevronRight, Plus, ArrowUpDown, FileCode } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function MigrationsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Migrations
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Track and manage database schema changes with version-controlled migrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            New Migration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No migrations yet"
          description="Create your first migration to start tracking schema changes. Migrations help you evolve your database schema safely and collaboratively."
          icon={ChevronRight}
          actionLabel="New Migration"
          onAction={() => console.log('New migration')}
          secondaryActionLabel="Migration Docs"
          onSecondaryAction={() => console.log('Migration docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <FileCode size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Version Control</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Every schema change is tracked and can be rolled back safely.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <ArrowUpDown size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Up & Down</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Define both forward and rollback steps for every schema change.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <ChevronRight size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">CLI Integration</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Generate and apply migrations from the CLI or directly in the dashboard.</p>
        </div>
      </div>
    </div>
  );
}
