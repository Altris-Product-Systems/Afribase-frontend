'use client';

import React from 'react';
import { Layers, Cpu, Globe, Database, ShieldCheck, Zap } from 'lucide-react';
import { Step } from '@/components/DocsComponents';

export default function ArchitectureDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Layers size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">System Design</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    System <span className="text-emerald-500">Architecture</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Afribase is a modular collection of open-source tools designed to work together seamlessly. Understand the components that power your cloud infrastructure.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Component Stack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 space-y-3">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Database size={20} />
                            <h4 className="text-sm font-bold text-white uppercase tracking-tighter">PostgreSQL</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">The core relational engine. We provide a dedicated instance for every project, ensuring zero resource contention and maximum performance.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 space-y-3">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <ShieldCheck size={20} />
                            <h4 className="text-sm font-bold text-white uppercase tracking-tighter">GoTrue</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Our identity and user management server. It handles JWT issuance, provider integration, and user metadata synchronization.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 space-y-3">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Cpu size={20} />
                            <h4 className="text-sm font-bold text-white uppercase tracking-tighter">PostgREST</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Automatically turns your PostgreSQL schema into a secure, RESTful API. No backend code required to access your data.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 space-y-3">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Globe size={20} />
                            <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Realtime Server</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">A globally distributed Elixir server cluster that manages WebSocket connections and listens to Postgres WAL events.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-10 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Request Lifecycle</h2>
                <div className="space-y-2">
                    <Step number="01" title="Client Request">
                        The frontend application initiates a request using the Afribase SDK, including a signed JWT for authentication.
                    </Step>

                    <Step number="02" title="API Gateway validation">
                        Our gateway validates the token and routes the request to the appropriate project infrastructure node.
                    </Step>

                    <Step number="03" title="Database Policy Check">
                        PostgreSQL evaluates the specific Row Level Security (RLS) policies for the requesting user identity.
                    </Step>

                    <Step number="04" title="Secure Response">
                        Only authorized data is returned to the client gateway and forwarded back to the application.
                    </Step>
                </div>
            </section>

            <section className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/5 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">Open Source Promise</h3>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Every component in the Afribase stack is open-source. We believe that critical cloud infrastructure should be transparent and community-driven. You can self-host the entire stack or use our managed cloud.
                    </p>
                </div>
                <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                    <Zap className="text-emerald-500 animate-pulse" size={40} />
                </div>
            </section>
        </div>
    );
}
