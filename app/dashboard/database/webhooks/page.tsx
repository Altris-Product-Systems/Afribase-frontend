'use client';

import React from 'react';
import { Webhook, Plus, Zap, Bell } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function WebhooksPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Webhooks
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Trigger external services when database events occur with HTTP webhooks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            Create Webhook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="No webhooks configured"
          description="Webhooks send HTTP POST requests to your endpoints when database events (INSERT, UPDATE, DELETE) happen on specified tables."
          icon={Webhook}
          actionLabel="Create Webhook"
          onAction={() => console.log('Create webhook')}
          secondaryActionLabel="Webhook Docs"
          onSecondaryAction={() => console.log('Webhook docs')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Webhook size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Event Triggers</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Hook into INSERT, UPDATE, and DELETE events on any table.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Zap size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Custom Payloads</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Webhooks include the full row data and event metadata in JSON format.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Bell size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Retry Delivery</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Failed webhook deliveries are automatically retried with exponential backoff.</p>
        </div>
      </div>
    </div>
  );
}
