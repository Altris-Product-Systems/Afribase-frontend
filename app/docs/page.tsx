'use client';

import React from 'react';
import { BookOpen, Database, Users, HardDrive, Zap, Globe, Layers, ShieldCheck, Activity } from 'lucide-react';
import { FeatureCard, CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function DocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <BookOpen size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Documentation</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    The Pulse of <br />
                    <span className="text-emerald-500 font-black">African Innovation</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Afribase is the unified business platform built specifically for the African continent. We provide mission-critical infrastructure optimized for low-latency performance across regional nodes—empowering both **high-code engineers** and **no-code innovators** to build and scale without limits.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Lagos Node Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Nairobi Node Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Johannesburg Node Active</span>
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-white/5">
                <h2 className="text-xs font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    Official SDKs
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                </h2>
                <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl group hover:border-emerald-500/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <Activity size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white tracking-tight">JavaScript</span>
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                Active
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl group hover:border-emerald-500/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Activity size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white tracking-tight">Python</span>
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                Active
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl group hover:border-emerald-500/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <Activity size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white tracking-tight">Dart / Flutter</span>
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                Active
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-40 grayscale group cursor-not-allowed">
                        <div className="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-500">
                            <Activity size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-500 tracking-tight">Go (Alpha)</span>
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Upcoming</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-white/5">
                <h2 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Key Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FeatureCard
                        title="Database"
                        description="Every Afribase project comes with a full PostgreSQL database, professional-grade and ready to scale."
                        icon={Database}
                        href="/docs/database"
                    />
                    <FeatureCard
                        title="Authentication"
                        description="Manage users with ease. Email, social logins, magic links, and secure JWT-based sessions."
                        icon={Users}
                        href="/docs/auth"
                    />
                    <FeatureCard
                        title="Storage"
                        description="Store and serve any digital asset with high-performance global CDN distribution."
                        icon={HardDrive}
                        href="/docs/storage"
                    />
                    <FeatureCard
                        title="Edge Functions"
                        description="Execute server-side logic globally on the edge for ultra-low latency compute."
                        icon={Zap}
                        href="/docs/edge-functions"
                    />
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Getting Started</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Afribase is designed to be integrated into your existing projects. Follow these steps to install our official SDKs and connect to your infrastructure nodes.
                </p>

                <div className="space-y-8">
                    <Step number="01" title="Install the SDK">
                        Add the official Afribase client to your project environment.
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript / TypeScript</h4>
                                <CodeBlock code="npm install @afribase/afribase-js" language="bash" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code="pip install afribase" language="bash" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                <CodeBlock code="flutter pub add afribase" language="bash" />
                            </div>
                        </div>
                    </Step>

                    <Step number="02" title="Get your API Keys">
                        Navigate to your project dashboard to retrieve your **Project URL** and **Public Anon Key**. These are required to authenticate your client requests.
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mt-4">
                            <p className="text-xs text-zinc-400 font-medium">Looking for these? Check <strong>Settings &gt; API</strong> in your project dashboard.</p>
                        </div>
                    </Step>

                    <Step number="03" title="Initialize the Client">
                        Import the Afribase client and start interacting with your infrastructure. Our official SDKs are available for JavaScript, Python, and Dart.
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                <CodeBlock code={`import { createClient } from '@afribase/afribase-js';

const afribase = createClient('https://your-project.useafribase.app', 'your-anon-key');`} language="typescript" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code={`from afribase import create_client

client = create_client("https://your-project.useafribase.app", "your-anon-key")`} language="python" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                <CodeBlock code={`import 'package:afribase/afribase.dart';

final client = AfribaseClient('https://your-project.useafribase.app', 'your-anon-key');`} language="dart" />
                            </div>
                        </div>
                    </Step>
                </div>
            </section>

            <Callout type="tip">
                Need help? Check out our <a href="https://discord.gg/afribase" className="text-emerald-400 hover:underline">Discord community</a> or reach out to our support team for specialized infrastructure assistance.
            </Callout>

            <Callout type="info">
                <strong>Pro-tip:</strong> Use our official SDKs (JS, Python, Dart) to speed up your development. They handle authentication, real-time subscriptions, and database queries automatically!
            </Callout>

            <section className="space-y-6 pt-12 border-t border-white/5">
                <h2 className="text-2xl font-black text-white tracking-tight">Philosophy</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Afribase is built on three core principles that dictate every architectural decision we make:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Layers size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Stack Agnostic</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Use any frontend framework or no-code builder. Afribase provides standard APIs that work everywhere.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <ShieldCheck size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Security First</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Built-in Row Level Security ensures your data is protected at the database layer.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Zap size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">No-Code Ready</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Auto-generated REST APIs and a visual dashboard mean you can build entire products without writing code.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Globe size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Global Scale</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Automatic distribution across global edge nodes for absolute performance.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { Github } from 'lucide-react';
