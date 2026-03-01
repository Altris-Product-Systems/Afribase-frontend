'use client';

import React from 'react';
import { Radio, Users, Zap, MessageSquare } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function RealtimePage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Realtime
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Build live, collaborative experiences with real-time subscriptions and presence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-10">
        <EmptyState
          title="Realtime is ready"
          description="Subscribe to database changes, broadcast messages between clients, and track online presence — all through WebSockets."
          icon={Radio}
          actionLabel="View Docs"
          onAction={() => console.log('View docs')}
          secondaryActionLabel="Realtime Inspector"
          onSecondaryAction={() => console.log('Realtime inspector')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Radio size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">DB Changes</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Subscribe to INSERT, UPDATE, and DELETE events on any table in real time.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <MessageSquare size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Broadcast</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Send messages between connected clients without persisting to the database.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">Presence</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Track which users are online and share ephemeral state between them.</p>
        </div>
      </div>
    </div>
  );
}
