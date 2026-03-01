'use client';

import React from 'react';
import { Archive, Plus, Clock, Download } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function BackupsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Backups
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Schedule automatic backups and restore your database to any point in time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            Create Backup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No backups yet"
          description="Enable automatic daily backups or create manual snapshots. Restore your database to any previous state with one click."
          icon={Archive}
          actionLabel="Create Backup"
          onAction={() => console.log('Create backup')}
          secondaryActionLabel="Backup Docs"
          onSecondaryAction={() => console.log('Backup docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Clock size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Scheduled Backups</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Automatic daily backups with configurable retention policies.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Archive size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Point-in-Time</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Restore your database to any specific second within the retention window.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Download size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Download</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Export backups as SQL dumps for local development or migration.</p>
        </div>
      </div>
    </div>
  );
}
