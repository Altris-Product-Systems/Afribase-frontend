'use client';

import React from 'react';
import { BookOpen, Database, Users, HardDrive, Zap, Globe, Layers, ShieldCheck, Activity } from 'lucide-react';
import { FeatureCard, CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function DocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Introduction to <span className="text-emerald-500">Afribase</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Afribase is a high-performance open-source backend-as-a-service, giving you all the tools you need to build scalable cloud applications in minutes.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Stable v1.0.0
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-white/5">
                <h2 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Supported Languages</h2>
                <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <Activity size={18} />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">JavaScript</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Activity size={18} />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">Python</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <Activity size={18} />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">Dart / Flutter</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40">
                        <div className="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-500">
                            <Activity size={18} />
                        </div>
                        <span className="text-sm font-bold text-zinc-500 tracking-tight">Go (Alpha)</span>
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
                    The easiest way to get started with Afribase is by creating a new organization and project on our dashboard. Follow these steps to set up your environment:
                </p>

                <div className="space-y-2">
                    <Step number="01" title="Install Dependencies">
                        Clone our starter kit and install the required packages to begin your development.
                        <CodeBlock code="npx create-afribase-app@latest my-awesome-app" language="bash" />
                    </Step>

                    <Step number="02" title="Configure Environment">
                        Set up your environment variables by linking your project to the Afribase cloud.
                        <CodeBlock code="NEXT_PUBLIC_API_BASE_URL=https://api.afribase.com" language="env" />
                    </Step>

                    <Step number="03" title="Initialize the Client">
                        Import the Afribase client and start interacting with your infrastructure. Our official SDKs are available for JavaScript, Python, and Dart.
                        <CodeBlock code={`import { createClient } from '@afribase/afribase-js';

const client = createClient(
  'https://your-project.useafribase.app', 
  'your-anon-key'
);`} language="typescript" />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Layers size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Stack Agnostic</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Use any frontend framework. Afribase provides standard APIs that work everywhere.</p>
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
