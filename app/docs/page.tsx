'use client';

import React from 'react';
import { BookOpen, Database, Users, HardDrive, Zap, Globe, Activity, Terminal } from 'lucide-react';
import { FeatureCard, CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function DocsPage() {
    return (
        <div className="space-y-12 pb-32">
            {/* ── Hero ── */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <BookOpen size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Documentation</span>
                </div>
                <h1 className="text-2xl md:text-6xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    The Pulse of <br />
                    <span className="text-emerald-500 font-black">African Innovation</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Afribase is the unified business platform built specifically for the African continent. We provide mission-critical infrastructure optimized for low-latency performance across regional nodesempowering both <strong>high-code engineers</strong> and <strong>no-code innovators</strong> to build and scale without limits.
                </p>

                {/* <div className="flex flex-wrap gap-4 pt-4">
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
                </div> */}
            </section>

            {/* ── Key Capabilities ── */}
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
                    <FeatureCard
                        title="CLI Tool"
                        description="A professional-grade terminal interface to manage projects, deploy code, and more."
                        icon={Terminal}
                        href="/docs/cli"
                    />
                </div>
            </section>

            {/* ── Getting Started ── */}
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
                        Navigate to your project dashboard to retrieve your <strong>Project URL</strong> and <strong>Public Anon Key</strong>. These are required to authenticate your client requests.
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

            {/* ── Official Client Libraries ── */}
            <section className="space-y-12 pt-12 border-t border-white/5">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Official Client Libraries</h2>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
                        Connect your application to Afribase using our official and community-driven client libraries. We provide strongly-typed, performant SDKs for every major platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            name: 'afribase-js',
                            label: 'JavaScript',
                            version: 'v1.0.4',
                            status: 'Official',
                            description: 'Full-featured client for Web and Node.js. Supports the new Functional-Fluent API.',
                            install: 'npm install @afribase/afribase-js',
                            icon: Activity,
                            color: 'text-yellow-500',
                            bg: 'bg-yellow-500/10'
                        },
                        {
                            name: 'afribase_flutter',
                            label: 'Dart / Flutter',
                            version: 'v0.8.2',
                            status: 'Official',
                            description: 'Unified client for Android, iOS, and Web. Optimized for cross-platform pipelines.',
                            install: 'flutter pub add afribase',
                            icon: Activity,
                            color: 'text-cyan-500',
                            bg: 'bg-cyan-500/10'
                        },
                        {
                            name: 'afribase-py',
                            label: 'Python',
                            version: 'v0.2.0',
                            status: 'Official',
                            description: 'Native Python client for server-side logic and AI orchestrations. Piped query support.',
                            install: 'pip install afribase',
                            icon: Activity,
                            color: 'text-blue-500',
                            bg: 'bg-blue-500/10'
                        },
                        {
                            name: 'afribase-swift',
                            label: 'Swift (iOS)',
                            version: 'v0.1.0',
                            status: 'Alpha',
                            description: 'Native iOS/macOS/watchOS implementation with async/await support.',
                            install: 'swift package add afribase',
                            icon: Activity,
                            color: 'text-orange-500',
                            bg: 'bg-orange-500/10'
                        },
                        {
                            name: 'afribase-kotlin',
                            label: 'Kotlin (Android)',
                            version: 'v0.1.2',
                            status: 'Alpha',
                            description: 'Native Android and JVM client with Coroutines and Flow support.',
                            install: 'implementation("io.afribase:kotlin")',
                            icon: Activity,
                            color: 'text-purple-500',
                            bg: 'bg-purple-500/10'
                        },
                        {
                            name: 'afribase-go',
                            label: 'Go',
                            version: 'v0.0.5',
                            status: 'Community',
                            description: 'Native Go driver for high-performance server components and microservices.',
                            install: 'go get github.com/afribase/go',
                            icon: Activity,
                            color: 'text-emerald-500',
                            bg: 'bg-emerald-500/10'
                        }
                    ].map((sdk) => (
                        <div key={sdk.name} className="glass-card p-8 rounded-3xl border border-white/5 bg-zinc-900/10 group hover:border-emerald-500/30 transition-all duration-500 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl ${sdk.bg} flex items-center justify-center ${sdk.color} group-hover:scale-110 transition-transform duration-500`}>
                                        <sdk.icon size={24} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${sdk.status === 'Official'
                                            ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                                            : sdk.status === 'Alpha'
                                                ? 'text-orange-500 border-orange-500/20 bg-orange-500/5'
                                                : 'text-zinc-500 border-white/5 bg-white/5'
                                            }`}>
                                            {sdk.status}
                                        </span>
                                        <span className="text-[8px] font-bold text-zinc-600 mt-1 uppercase tracking-tighter">{sdk.version}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">{sdk.name}</h3>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{sdk.label}</p>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">{sdk.description}</p>
                                </div>

                                <div className="pt-2">
                                    <CodeBlock code={sdk.install} language="bash" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
