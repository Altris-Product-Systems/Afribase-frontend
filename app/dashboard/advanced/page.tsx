'use client';

import React from 'react';
import { Cpu, Code, Braces, Sparkles } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function AdvancedPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            AI / GraphQL / Types
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Advanced configuration for AI integrations, GraphQL schema, and type generation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="Advanced features"
          description="Configure AI vector embeddings, manage your GraphQL schema, and generate TypeScript types from your database tables."
          icon={Cpu}
          actionLabel="Get Started"
          onAction={() => console.log('Get started')}
          secondaryActionLabel="Advanced Docs"
          onSecondaryAction={() => console.log('Advanced docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Sparkles size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">AI & Vectors</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Store and query vector embeddings for AI-powered semantic search.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Braces size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">GraphQL</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Auto-generated GraphQL API from your database schema with filtering and pagination.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Code size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Type Generation</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Generate TypeScript definitions from your database for end-to-end type safety.</p>
        </div>
      </div>
    </div>
  );
}
