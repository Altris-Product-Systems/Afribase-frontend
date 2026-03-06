'use client';

import React from 'react';
import { Database, Plus, Terminal, Search } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function DatabasePage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Database
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Manage your relational data and perform complex queries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            New Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No tables found"
          description="Your database is ready but has no tables yet. Create a new table or use the SQL editor to get started."
          icon={Database}
          actionLabel="Create New Table"
          onAction={() => // console.log('Create table')}
          secondaryActionLabel="Open SQL Editor"
          onSecondaryAction={() => // console.log('SQL Editor')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Terminal size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">SQL Editor</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Write and execute raw SQL queries against your database with full IntelliSense support.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Search size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Table Explorer</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Visually explore your data, edit rows, and manage relationships without writing code.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Database size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Schema Visualizer</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Automatically generate an ER diagram of your database schema for better visualization.</p>
        </div>
      </div>
    </div>
  );
}
