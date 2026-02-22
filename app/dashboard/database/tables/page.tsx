'use client';

import React from 'react';
import { Database, Plus, Search, Filter } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function TablesPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Table Editor
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Manage your database tables, view data, and adjust schemas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            New Table
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2 border-b border-white/5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
          <input 
            type="text" 
            placeholder="Search tables..." 
            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <button className="h-9 px-4 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
          <Filter size={14} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4">
        <EmptyState
          title="No tables found"
          description="You haven't created any tables yet. Start by defining your schema to begin storing data."
          icon={Database}
          actionLabel="Create New Table"
          onAction={() => console.log('Create table')}
          secondaryActionLabel="Import CSV"
          onSecondaryAction={() => console.log('Import')}
        />
      </div>
    </div>
  );
}
