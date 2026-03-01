'use client';

import React, { useState } from 'react';
import {
    Library, Download, ExternalLink, ShieldCheck, Zap,
    Terminal, Star, Users, Check, Copy, Info, AlertTriangle
} from 'lucide-react';
import {
    SiJavascript, SiDart, SiSwift, SiKotlin, SiPython, SiTypescript
} from 'react-icons/si';

import { useRouter } from 'next/navigation';

interface LibraryCardProps {
    id: string;
    name: string;
    lang: string;
    icon: any;
    color: string;
    status: 'Official' | 'Community' | 'Alpha' | 'Beta';
    version: string;
    install: string;
    description: string;
}

const LibraryCard = ({ id, name, lang, icon: Icon, color, status, version, install, description }: LibraryCardProps) => {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(install);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card group relative p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-emerald-500/20 transition-all duration-500 flex flex-col h-full overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}/10 to-transparent blur-3xl group-hover:opacity-100 opacity-50 transition-opacity`} />

            <div className="relative z-10 space-y-6 flex-1">
                <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-2xl bg-${color}/10 border border-${color}/10 transition-transform duration-500 group-hover:scale-110 shadow-2xl`}>
                        <Icon size={32} className={color === 'yellow-400' ? 'text-yellow-400' : `text-${color}`} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${status === 'Official' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            status === 'Community' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>
                            {status}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">v{version}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white italic tracking-tighter group-hover:text-emerald-400 transition-colors">
                        {name}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between group/install">
                        <code className="text-[10px] font-mono text-emerald-500/80 truncate pr-4">
                            {install}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/dashboard/libraries/${id}`)}
                            className="flex-1 py-3 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group-hover:border-emerald-500/30"
                        >
                            Reference <ExternalLink size={12} />
                        </button>
                        <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all group-hover:border-emerald-500/30">
                            <Star size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ClientLibraries() {
    const libraries: LibraryCardProps[] = [
        {
            id: 'afribase-js',
            name: 'afribase-js',
            lang: 'JavaScript / TypeScript',
            icon: SiJavascript,
            color: 'yellow-400',
            status: 'Official',
            version: '1.0.4',
            install: 'npm install @afribase/js',
            description: 'Full-featured client for Web and Node.js. Supports the new Functional-Fluent API.'
        },
        {
            id: 'afribase_flutter',
            name: 'afribase_flutter',
            lang: 'Dart / Flutter',
            icon: SiDart,
            color: 'sky-400',
            status: 'Official',
            version: '0.8.2',
            install: 'flutter pub add afribase',
            description: 'Unified client for Android, iOS, and Web. Optimized for cross-platform pipelines.'
        },
        {
            id: 'afribase-py',
            name: 'afribase-py',
            lang: 'Python',
            icon: SiPython,
            color: 'blue-500',
            status: 'Official',
            version: '0.2.0',
            install: 'pip install afribase',
            description: 'Native Python client for server-side logic and AI orchestrations. Piped query support.'
        },
        {
            id: 'afribase-swift',
            name: 'afribase-swift',
            lang: 'Swift / iOS',
            icon: SiSwift,
            color: 'orange-500',
            status: 'Alpha',
            version: '0.1.0',
            install: 'swift package add afribase',
            description: 'Native iOS/macOS/watchOS implementation with async/await support.'
        },
        {
            id: 'afribase-kotlin',
            name: 'afribase-kotlin',
            lang: 'Kotlin / Android',
            icon: SiKotlin,
            color: 'purple-500',
            status: 'Alpha',
            version: '0.1.2',
            install: 'implementation("io.afribase:kotlin")',
            description: 'Native Android and JVM client with Coroutines and Flow support.'
        },
        {
            id: 'afribase-go',
            name: 'afribase-go',
            lang: 'Go',
            icon: Terminal,
            color: 'emerald-400',
            status: 'Community',
            version: '0.0.5',
            install: 'go get github.com/afribase/go',
            description: 'Native Go driver for high-performance server components and microservices.'
        }
    ];

    const router = useRouter();

    return (
        <div className="space-y-12 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-12 lg:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="space-y-8 max-w-2xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/10 animate-pulse">
                            <Zap size={14} /> New Functional-Fluent API is Live
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter leading-none pl-1">
                            Client <span className="text-emerald-500 not-italic uppercase tracking-normal">Libraries</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-zinc-400 font-medium leading-relaxed pl-1">
                            Build with the best. Afribase provides official client libraries for all major platforms, optimized for the African network ecosystem.
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => router.push('/dashboard/libraries/afribase-js')}
                                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3 group"
                            >
                                <Library size={18} /> Explore Reference
                                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5 font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center gap-3">
                                <Users size={18} /> Join Community
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                        {[
                            { label: 'Weekly Downloads', value: '450k+', icon: Download, color: 'text-emerald-500' },
                            { label: 'Open Source', value: '100%', icon: ShieldCheck, color: 'text-blue-500' },
                            { label: 'Latency Boost', value: '2.4x', icon: Zap, color: 'text-yellow-500' },
                            { label: 'Active Contribs', value: '128', icon: Users, color: 'text-purple-500' },
                        ].map((stat) => (
                            <div key={stat.label} className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 space-y-2">
                                <stat.icon size={20} className={stat.color} />
                                <div className="text-2xl font-black text-white">{stat.value}</div>
                                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Libraries Grid */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Official Support</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">In Development</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {libraries.map((lib) => (
                        <LibraryCard key={lib.name} {...lib} />
                    ))}
                </div>
            </div>

            {/* Bottom Info */}
            <div className="glass-card p-10 rounded-[2rem] border border-white/5 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <AlertTriangle size={36} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-widest italic">Missing your favorite language?</h4>
                        <p className="text-xs text-zinc-500 font-medium mt-1">
                            We are constantly working on new SDKs. Suggest a language or contribute to our community efforts.
                        </p>
                    </div>
                </div>
                <button className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-200 transition-all shadow-2xl">
                    Request an SDK
                </button>
            </div>
        </div>
    );
}
