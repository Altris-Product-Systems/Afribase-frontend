'use client';

import React, { useState, useEffect } from 'react';
import {
    Code, Copy, Check, ExternalLink, Terminal, Globe, Lock, Shield,
    Smartphone, Server, Cpu, Zap, Library, BookOpen
} from 'lucide-react';
import {
    SiJavascript, SiDart, SiSwift, SiKotlin, SiPython, SiTypescript
} from 'react-icons/si';
import { getAuthConfig, AuthConfigResponse } from '@/lib/api';

interface ApiDocsProps {
    projectId: string;
    projectSlug: string;
    anonKey?: string;
}

export default function ApiDocs({ projectId, projectSlug, anonKey }: ApiDocsProps) {
    const [config, setConfig] = useState<AuthConfigResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSdk, setActiveSdk] = useState<string>('javascript');
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadConfig();
    }, [projectId]);

    const loadConfig = async () => {
        setIsLoading(true);
        try {
            const data = await getAuthConfig(projectId);
            setConfig(data);
        } catch (err) {
            console.error('Failed to load SDK snippets:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const apiHost = typeof window !== 'undefined' ? window.location.host : 'localhost:8000';
    const restUrl = `http://${apiHost}/rest/v1/${projectSlug}`;
    const authUrl = `http://${apiHost}/auth/v1/${projectSlug}`;

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates({ ...copiedStates, [id]: true });
        setTimeout(() => {
            setCopiedStates({ ...copiedStates, [id]: false });
        }, 2000);
    };

    const sdks = [
        { id: 'javascript', name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-400', banner: 'bg-yellow-400/10' },
        { id: 'dart', name: 'Flutter / Dart', icon: SiDart, color: 'text-sky-400', banner: 'bg-sky-400/10' },
        { id: 'swift', name: 'iOS / Swift', icon: SiSwift, color: 'text-orange-500', banner: 'bg-orange-500/10' },
        { id: 'kotlin', name: 'Android / Kotlin', icon: SiKotlin, color: 'text-purple-500', banner: 'bg-purple-500/10' },
        { id: 'python', name: 'Python / Backend', icon: SiPython, color: 'text-blue-500', banner: 'bg-blue-500/10' },
    ];

    return (
        <div className="space-y-10 animate-fade-in max-w-6xl">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <Library className="text-emerald-500" size={32} />
                        </div>
                        SDKs & API
                    </h2>
                    <p className="text-zinc-500 text-sm max-w-xl leading-relaxed font-medium pl-1">
                        Connect your application using our native SDKs or direct REST/GraphQL endpoints.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all flex items-center gap-2">
                        <BookOpen size={14} /> Documentation
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area (SDKs) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* SDK Selection Tabs */}
                    <div className="flex flex-wrap items-center gap-3">
                        {sdks.map((sdk) => (
                            <button
                                key={sdk.id}
                                onClick={() => setActiveSdk(sdk.id)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 ${activeSdk === sdk.id
                                        ? `bg-white/5 border-emerald-500/30 text-white shadow-[0_0_20px_rgba(0,0,0,0.2)]`
                                        : 'bg-transparent border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
                                    }`}
                            >
                                <sdk.icon className={`transition-colors ${activeSdk === sdk.id ? sdk.color : 'text-zinc-600'}`} size={18} />
                                <span className={`text-xs font-black uppercase tracking-widest transition-opacity ${activeSdk === sdk.id ? 'opacity-100' : 'opacity-60'}`}>
                                    {sdk.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* SDK Code Snippet Card */}
                    <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {sdks.find(s => s.id === activeSdk)?.icon({
                                    size: 24,
                                    className: sdks.find(s => s.id === activeSdk)?.color
                                })}
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                        {sdks.find(s => s.id === activeSdk)?.name} Integration
                                    </h3>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-0.5">
                                        Native SDK Boilerplate
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => copyToClipboard((config?.sdkSnippet as any)?.[activeSdk] || '', 'sdk-full')}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                            >
                                {copiedStates['sdk-full'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                {copiedStates['sdk-full'] ? 'Copied' : 'Copy Code'}
                            </button>
                        </div>
                        <div className="p-0 bg-[#0c0c0e]">
                            <div className="p-8">
                                {isLoading ? (
                                    <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Generating Snippet...</p>
                                    </div>
                                ) : (
                                    <pre className="text-sm font-mono text-emerald-400/90 leading-relaxed overflow-x-auto custom-scrollbar scrollbar-hide max-h-[500px]">
                                        {(config?.sdkSnippet as any)?.[activeSdk] || `// Snippet not available for ${activeSdk}`}
                                    </pre>
                                )}
                            </div>
                            {/* Pro Tip */}
                            <div className="px-8 py-4 bg-emerald-500/5 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Zap size={14} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Pro Tip</span>
                                    <span className="text-[10px] text-zinc-500 font-medium">Use environment variables to store your Anon Key safely.</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">Install Guide</button>
                                    <button className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors underline decoration-zinc-800 underline-offset-4">API Reference</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Connection Info */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Endpoint URLs */}
                    <div className="glass-card rounded-[2rem] border border-white/5 p-8 space-y-8 shadow-xl">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Service Endpoints</h4>

                            <div className="space-y-6">
                                {/* REST */}
                                <div className="space-y-3 pb-6 border-b border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <Globe size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-300">REST API</span>
                                        </div>
                                        <button onClick={() => copyToClipboard(restUrl, 'rest')} className="text-zinc-500 hover:text-white transition-colors">
                                            {copiedStates['rest'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-blue-400 truncate">
                                        {restUrl}
                                    </div>
                                </div>

                                {/* AUTH */}
                                <div className="space-y-3 pb-6 border-b border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                <Shield size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-300">Auth API</span>
                                        </div>
                                        <button onClick={() => copyToClipboard(authUrl, 'auth')} className="text-zinc-500 hover:text-white transition-colors">
                                            {copiedStates['auth'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-purple-400 truncate">
                                        {authUrl}
                                    </div>
                                </div>

                                {/* GraphQl */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                                                <Zap size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-300">GraphQL</span>
                                        </div>
                                        <button onClick={() => copyToClipboard(`${restUrl}/graphql`, 'gql')} className="text-zinc-500 hover:text-white transition-colors">
                                            {copiedStates['gql'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-pink-400 truncate">
                                        {restUrl}/graphql
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Auth Key */}
                        {anonKey && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Lock size={16} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-zinc-300">Anon Key</span>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Public client-side key</p>
                                        </div>
                                    </div>
                                    <button onClick={() => copyToClipboard(anonKey, 'key')} className="text-zinc-500 hover:text-white transition-colors">
                                        {copiedStates['key'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="p-4 bg-black/60 border border-white/5 rounded-2xl break-all">
                                    <code className="text-[11px] text-zinc-500 font-mono leading-relaxed">
                                        {anonKey}
                                    </code>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Support Card */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                <Smartphone className="text-emerald-400" size={24} />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white leading-tight">All-in-one Platform</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                            Join over <span className="text-white font-bold">50k+</span> developers building the future of Africa on Afribase. Our SDKs are optimized for local network conditions and high-performance.
                        </p>
                        <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">
                            Explore All Libraries
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
