'use client';

import React from 'react';
import { Code, Copy, ExternalLink, Shield, Key } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function ApiDocsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            API Documentation
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Connect to your database via RESTful and GraphQL endpoints instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 active:scale-95 uppercase tracking-widest">
            <ExternalLink size={16} />
            Postman
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <EmptyState
            title="Auto-generated API"
            description="Your API is automatically generated based on your table schema. Create your first table to see interactive documentation and code snippets."
            icon={Code}
            actionLabel="View Table Editor"
            onAction={() => window.location.href='/dashboard/database/tables'}
            secondaryActionLabel="API Reference"
            onSecondaryAction={() => // console.log('Docs')}
          />
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500">
              <Shield size={20} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Authentication</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">All requests must include a valid JWT or an anon key in the Authorization header.</p>
            <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400">
              <Key size={12} />
              Setup API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
