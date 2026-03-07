'use call';

import React from 'react';
import { Activity, Radio, Users, Shield, Zap, MessageSquare } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function RealtimeDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Activity size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Live Stream</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Reactive <span className="text-emerald-500">Realtime</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Listen to database changes in real-time, broadcast messages, and track user presence with ultra-low latency.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Realtime Engine</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Radio size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tighter">Postgres Changes</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">Instantly receive events when data is inserted, updated, or deleted in your PostgreSQL tables.</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tighter">Broadcasting</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">Send arbitrary messages across all connected clients on named channels with sub-100ms latency.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Implementation</h2>
                <div className="space-y-8">
                    <Step number="01" title="Initialize a Channel">
                        Connect to a specific topic or database table.
                        <CodeBlock code={`const channel = afribase.channel('room-1');`} language="typescript" />
                    </Step>

                    <Step number="02" title="Subscribe to Events">
                        Define exactly what events you want to listen for.
                        <CodeBlock code={`channel
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'messages' 
  }, (payload) => {
    console.log('New message!', payload);
  })
  .subscribe();`} language="typescript" />
                    </Step>
                </div>
            </section>

            <Callout type="tip">
                Realtime updates are **secure by default**. Our engine automatically honors your PostgreSQL Row Level Security (RLS) policies, ensuring users only receive data they are authorized to see.
            </Callout>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <div className="flex items-center gap-3">
                    <Users className="text-emerald-500" size={24} />
                    <h2 className="text-2xl font-black text-white tracking-tight">Presence Tracking</h2>
                </div>

                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Track user online status and synchronize metadata across instances. Perfect for "Who's online" lists or shared cursors in collaborative tools.</p>

                <CodeBlock code={`channel.on('presence', { event: 'sync' }, () => {
  const presenceState = channel.presenceState();
  console.log('Users currently online:', presenceState);
});

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({ online_at: new Date().toISOString() });
  }
});`} language="typescript" />
            </section>
        </div>
    );
}
