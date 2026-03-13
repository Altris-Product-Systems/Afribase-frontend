'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronRight, ChevronDown, Copy, Check, ExternalLink,
    Search, Terminal, BookOpen, Code, Zap, Database, Users, Shield, ArrowLeft
} from 'lucide-react';
import { SDK_DOCS, SdkDocData, SdkSection, SdkMethod } from '@/lib/sdk-docs';
import Link from 'next/link';

interface SdkDocsProps {
    sdkId: string;
}

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl border border-white/5 bg-black/40 overflow-hidden">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            </div>
            <pre className="p-6 text-[11px] font-mono leading-relaxed text-emerald-400 overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export default function SdkDocs({ sdkId }: SdkDocsProps) {
    const sdk = SDK_DOCS[sdkId];
    const [activeSection, setActiveSection] = useState(sdk?.sections[0]?.id || '');
    const [activeMethod, setActiveMethod] = useState(sdk?.sections[0]?.methods[0]?.id || '');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    if (!sdk) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <Terminal size={32} />
                </div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">SDK Not Found</h2>
                <Link href="/dashboard/libraries" className="text-sm font-black text-emerald-500 hover:text-emerald-400 tracking-widest uppercase flex items-center gap-2">
                    <ArrowLeft size={14} /> Back to Libraries
                </Link>
            </div>
        );
    }

    const LangIcon = sdk.icon;

    // Filtered navigation
    const filteredSections = sdk.sections.map(section => ({
        ...section,
        methods: section.methods.filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.methods.length > 0);

    const currentMethod = sdk.sections
        .flatMap(s => s.methods)
        .find(m => m.id === activeMethod);

    return (
        <div className="flex h-screen overflow-hidden bg-[#09090b]">
            {/* Left Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col border-r border-white/5 bg-zinc-950/20 backdrop-blur-3xl transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
                <div className="p-6 border-b border-white/5 space-y-4">
                    <Link href="/dashboard/libraries" className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-all group">
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to SDKs
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${sdk.color}/10 border border-${sdk.color}/20 text-${sdk.color}`}>
                            <LangIcon size={20} />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-black text-white italic uppercase tracking-tighter">{sdk.name}</h2>
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{sdk.lang}</span>
                        </div>
                    </div>
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find methods..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-9 py-2 text-[11px] font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                    {filteredSections.map((section) => (
                        <div key={section.id} className="space-y-1">
                            <h3 className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic mb-3">
                                {section.title}
                            </h3>
                            {section.methods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setActiveMethod(method.id)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-[11px] font-bold rounded-xl transition-all duration-200 group ${activeMethod === method.id
                                        ? 'bg-white/5 text-emerald-400 shadow-xl'
                                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <div className={`w-1 h-1 rounded-full transition-all ${activeMethod === method.id ? 'bg-emerald-500 scale-125' : 'bg-transparent'}`} />
                                        <span className="truncate">{method.name}</span>
                                    </div>
                                    <ChevronRight size={12} className={`transition-transform ${activeMethod === method.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#09090b]">
                {/* Fixed Subheader for docs */}
                <div className="sticky top-0 z-20 px-8 py-4 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg bg-white/5 text-white"
                    >
                        <Terminal size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <LangIcon size={16} className={`text-${sdk.color}`} />
                        <h2 className="text-sm font-black text-white italic tracking-tighter uppercase">{sdk.name} Reference</h2>
                    </div>
                </div>

                <div className="max-w-6xl w-full mx-auto px-8 lg:px-12 py-12 lg:py-20 animate-fade-in-up">
                    {currentMethod ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20">
                            {/* Content Column */}
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black tracking-widest uppercase border border-emerald-500/20">
                                            Methods / {sdk.lang}
                                        </span>
                                        <span className="px-3 py-1 bg-white/5 text-zinc-500 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/5">
                                            v1.0.4 - Official
                                        </span>
                                    </div>
                                    <h1 className="text-2xl lg:text-4xl font-black text-white italic tracking-tighter leading-none">
                                        {currentMethod.name}
                                    </h1>
                                    <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-xl">
                                        {currentMethod.description}
                                    </p>
                                </div>

                                {currentMethod.parameters && (
                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                            <Shield size={16} className="text-emerald-500" /> Parameters
                                        </h3>
                                        <div className="space-y-3">
                                            {currentMethod.parameters.map((p) => (
                                                <div key={p.name} className="glass-card p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-start gap-4">
                                                    <div className="flex flex-col min-w-[120px]">
                                                        <code className="text-[11px] font-mono font-black text-emerald-400 uppercase">{p.name}</code>
                                                        <span className="text-[9px] font-mono text-zinc-600 mt-1">{p.type}</span>
                                                    </div>
                                                    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{p.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <Zap size={16} className="text-yellow-500" /> Helpful Links
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        <Link href="#" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-zinc-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
                                            <BookOpen size={14} /> Guide <ExternalLink size={12} />
                                        </Link>
                                        <Link href="#" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-zinc-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
                                            <Terminal size={14} /> Example Repo <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Code Column */}
                            <div className="space-y-8 sticky top-24 h-fit">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Usage Example</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Editor</span>
                                        </div>
                                    </div>
                                    <CodeBlock code={currentMethod.example} language={sdk.lang} />
                                </div>

                                <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <Terminal size={20} />
                                            </div>
                                            <h4 className="text-sm font-black text-white italic uppercase tracking-tighter">Installation</h4>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 font-medium">Add {sdk.name} to your project using your favorite package manager.</p>
                                        <div className="bg-black/60 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                            <code className="text-[10px] font-mono text-emerald-500 leading-none">{sdk.install}</code>
                                            <button className="text-zinc-600 hover:text-white transition-colors">
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 px-8 border border-white/5 border-dashed rounded-[3rem] bg-white/[0.01]">
                            <BookOpen size={48} className="text-zinc-700 mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">Select a reference</h2>
                            <p className="text-zinc-500 text-sm max-w-sm mx-auto font-medium">Please choose a method from the left sidebar to see documentation and code examples.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
