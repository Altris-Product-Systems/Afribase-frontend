'use client';

import React from 'react';
import { Terminal, Play, Save, History, Search } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function SqlEditorPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            SQL Editor
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Run raw SQL queries directly against your database with performance insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 active:scale-95 uppercase tracking-widest">
            <History size={16} />
            History
          </button>
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Play size={16} fill="currentColor" />
            Run Query
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[500px]">
        {/* Sidebar for SQL Files */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Saved Queries</span>
            <button className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={12} />
            <input 
              type="text" 
              placeholder="Filter..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-lg pl-9 pr-4 py-1.5 text-[10px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div className="space-y-1 text-center py-10 opacity-50">
            <p className="text-[10px] text-zinc-500 font-bold uppercase">No saved queries</p>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          <EmptyState
            title="Empty Query Editor"
            description="Write your SQL here to explore your data. You can save snippets for future use or browse the schema."
            icon={Terminal}
            actionLabel="New Query snippet"
            onAction={() => console.log('New query')}
            secondaryActionLabel="Browse documentation"
            onSecondaryAction={() => console.log('Docs')}
          />
        </div>
      </div>
    </div>
  );
}

import { Plus } from 'lucide-react';
