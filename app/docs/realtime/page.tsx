'use client';

import React from 'react';
import { Activity, Users, Zap, Lock } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function RealtimeDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Activity size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Realtime Engine</span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Reactive <span className="text-emerald-500">Infrastructure</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Build interactive, live experiences with our ultra-low latency WebSocket engine. Listen to database changes as they happen, broadcast arbitrary JSON messages between clients, and track global user presence with sub-100ms latency.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Technical Architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tighter">Sub-100ms Propagation</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">Built on a distributed messaging cluster, our Realtime engine guarantees sub-100ms message propagation between your clients and infrastructure nodes.</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tighter">Secure Broadcasting</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">All realtime channels are protected by JWT-based authentication. Define complex access rules to ensure data only reaches authorized subscribers.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Implementation</h2>
                <div className="space-y-8">
                    <Step number="01" title="Initialize a Channel">
                        Create a channel targeting a specific "room" or topic.
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                <CodeBlock code={`const channel = afribase.channel('room-1');`} language="typescript" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code={`channel = client.channel("room-1")`} language="python" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                <CodeBlock code={`final channel = client.channel('room-1');`} language="dart" />
                            </div>
                        </div>
                    </Step>

                    <Step number="02" title="Broadcast Messages">
                        Send and listen for custom broadcast messages between clients.
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                <CodeBlock code={`// 1. Listen for Broadcasts
channel.on('broadcast', { event: 'message' }, (payload) => {
  console.log('Received broadcast payload:', payload);
});

// 2. Commit the subscription
channel.subscribe();

// 3. Send a Broadcast
channel.send('broadcast', { event: 'message', payload: { text: 'Hello!' } });`} language="typescript" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code={`# 1. Listen for Broadcasts
def on_message(payload): print(payload)
channel.on_broadcast("message", callback=on_message)

# 2. Commit the subscription
channel.subscribe()

# 3. Send a Broadcast
channel.send_broadcast("message", {"text": "Hello!"})`} language="python" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                <CodeBlock code={`// 1. Listen for Broadcasts
channel.onBroadcast('message', (payload) { print(payload); });

// 2. Commit the subscription
channel.subscribe();

// 3. Send a Broadcast
channel.sendBroadcast('message', {'text': 'Hello!'});`} language="dart" />
                            </div>
                        </div>
                    </Step>

                    <Step number="03" title="Listen for Database Changes">
                        Receive real-time events for table operations (INSERT, UPDATE, DELETE).
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                <CodeBlock code={`channel.on('postgres_changes', { 
  event: 'INSERT', 
  schema: 'public', 
  table: 'messages' 
}, (payload) => {
  console.log('New database message:', payload.new);
});`} language="typescript" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code={`channel.on_postgres_changes(
    event="INSERT",
    schema="public",
    table="messages",
    callback=lambda payload: print(payload)
)`} language="python" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                <CodeBlock code={`channel.onPostgresChanges(
  event: 'INSERT',
  schema: 'public',
  table: 'messages',
  callback: (payload) => print(payload),
);`} language="dart" />
                            </div>
                        </div>
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

                <div className="space-y-8 mt-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">JavaScript / TypeScript</h4>
                        <CodeBlock code={`// Listen for presence state changes
channel.on('presence', { event: 'sync' }, () => {
  const presenceState = channel.presenceState();
  console.log('Online users:', presenceState);
});

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({ online_at: new Date().toISOString() });
  }
});`} language="typescript" />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Python</h4>
                        <CodeBlock code={`# Register Presence Sync
channel.on_presence_sync(callback=lambda state: print(state))

channel.subscribe()

# Track presence
channel.track({"user": "python_client", "status": "online"})`} language="python" />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Dart / Flutter</h4>
                        <CodeBlock code={`// Register Presence Sync
channel.onPresenceSync((state) { print(state); });

channel.subscribe();

// Track presence
channel.track({'user': 'dart_client', 'status': 'online'});`} language="dart" />
                    </div>
                </div>
            </section>
        </div>
    );
}
