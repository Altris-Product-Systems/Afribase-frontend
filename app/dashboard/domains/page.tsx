'use client';

import React from 'react';
import { Globe, Plus, Shield, Link2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function DomainsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Custom Domains
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Connect your own domains to serve APIs and applications from a branded URL.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            Add Domain
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No custom domains"
          description="Map your own domain to your project. Includes automatic SSL certificates and DNS verification."
          icon={Globe}
          actionLabel="Add Domain"
          onAction={() => console.log('Add domain')}
          secondaryActionLabel="Domain Docs"
          onSecondaryAction={() => console.log('Domain docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Globe size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Custom URLs</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Use your own domain for API endpoints and hosted services.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Shield size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Auto SSL</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Free SSL certificates are provisioned and renewed automatically.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Link2 size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">DNS Verification</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Simple CNAME-based verification to prove domain ownership.</p>
        </div>
      </div>
    </div>
  );
}
