'use client';

import React, { useState } from 'react';
import { Code, Copy, Check, ExternalLink, Terminal, Globe, Lock, Shield } from 'lucide-react';

interface ApiDocsProps {
    projectId: string;
    projectSlug: string;
    anonKey?: string;
}

export default function ApiDocs({ projectId, projectSlug, anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }: ApiDocsProps) {
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    // Use window.location.host or fallback
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

    const snippets = [
        {
            title: 'Fetch Data',
            language: 'javascript',
            code: `const { data, error } = await afribase
  .from('your_table')
  .select('*')
  .eq('id', 1);`
        },
        {
            title: 'Insert Row',
            language: 'javascript',
            code: `const { error } = await afribase
  .from('your_table')
  .insert({ name: 'New Item' });`
        },
        {
            title: 'cURL Example',
            language: 'bash',
            code: `curl -X GET '${restUrl}/your_table' \\
  -H "apikey: ${anonKey}" \\
  -H "Authorization: Bearer ${anonKey}"`
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                    <Code className="text-emerald-500" size={32} />
                    API Documentation
                </h2>
                <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
                    Your project's Data API is automatically generated from your database schema. Use these endpoints and keys to connect your frontend application.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Endpoint Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Globe className="text-blue-500" size={18} />
                                </div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Rest API URL</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                                <code className="text-[10px] text-blue-400 flex-1 truncate">{restUrl}</code>
                                <button onClick={() => copyToClipboard(restUrl, 'rest')} className="text-zinc-500 hover:text-white transition-colors">
                                    {copiedStates['rest'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Shield className="text-purple-500" size={18} />
                                </div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Auth API URL</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                                <code className="text-[10px] text-purple-400 flex-1 truncate">{authUrl}</code>
                                <button onClick={() => copyToClipboard(authUrl, 'auth')} className="text-zinc-500 hover:text-white transition-colors">
                                    {copiedStates['auth'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Start Snippets */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 px-1">Quick Start Guide</h3>
                        <div className="space-y-4">
                            {snippets.map((snippet, idx) => (
                                <div key={idx} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{snippet.title}</span>
                                        <button onClick={() => copyToClipboard(snippet.code, `code-${idx}`)} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
                                            {copiedStates[`code-${idx}`] ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                            Copy
                                        </button>
                                    </div>
                                    <pre className="p-6 text-xs font-mono text-emerald-400 bg-black/20 overflow-x-auto leading-relaxed">
                                        {snippet.code}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <Lock className="text-emerald-500" size={18} />
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Project Keys</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Anon Public Key</label>
                                <div className="p-3 bg-black/40 border border-white/5 rounded-xl break-all">
                                    <code className="text-[10px] text-zinc-400 font-mono">
                                        {anonKey.substring(0, 40)}...
                                    </code>
                                </div>
                            </div>
                            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-orange-500">
                                    <Shield size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Security Warning</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                    Never expose your <strong>service_role</strong> key in frontend applications. Use the <strong>anon</strong> key for browser-side requests.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full p-4 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/50 transition-all flex items-center justify-center gap-3 group">
                        Download SDK Documentation
                        <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
