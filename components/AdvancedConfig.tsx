'use client';
import React, { useState, useEffect } from 'react';
import { Cpu, Save, Loader2, Copy, Check, Download } from 'lucide-react';
import { getAIConfig, updateAIConfig, getGraphQLConfig, updateGraphQLConfig, generateTypeScript } from '@/lib/api';

interface AdvancedConfigProps { projectId: string; }

export default function AdvancedConfig({ projectId }: AdvancedConfigProps) {
    const [ai, setAi] = useState<any>(null);
    const [gql, setGql] = useState<any>(null);
    const [types, setTypes] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [savingAi, setSavingAi] = useState(false);
    const [savingGql, setSavingGql] = useState(false);
    const [generatingTypes, setGeneratingTypes] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try {
            setLoading(true); setError(null);
            const [a, g] = await Promise.allSettled([getAIConfig(projectId), getGraphQLConfig(projectId)]);
            if (a.status === 'fulfilled') setAi(a.value);
            if (g.status === 'fulfilled') setGql(g.value);
        } catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const saveAI = async () => {
        try { setSavingAi(true); await updateAIConfig(projectId, { pgvectorEnabled: ai.pgvectorEnabled, defaultModel: ai.defaultModel, openaiKey: ai.openaiKey }); }
        catch (e: any) { setError(e.message); } finally { setSavingAi(false); }
    };

    const saveGQL = async () => {
        try { setSavingGql(true); await updateGraphQLConfig(projectId, { enabled: gql.enabled, maxDepth: Number(gql.maxDepth), defaultLimit: Number(gql.defaultLimit) }); }
        catch (e: any) { setError(e.message); } finally { setSavingGql(false); }
    };

    const genTypes = async () => {
        try {
            setGeneratingTypes(true); setError(null);
            const t = await generateTypeScript(projectId);
            setTypes(t);
        } catch (e: any) { setError(e.message); } finally { setGeneratingTypes(false); }
    };

    const copyTypes = async () => {
        await navigator.clipboard.writeText(types);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const downloadTypes = () => {
        const blob = new Blob([types], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'database.types.ts'; a.click();
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Cpu className="text-violet-500" />Advanced Features</h2>
                <p className="text-sm text-zinc-500 mt-1">Configure AI/pgvector embeddings, GraphQL API, and TypeScript type generation.</p>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

            {/* AI Config */}
            {ai && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-violet-500/5 to-transparent">
                        <h3 className="font-bold text-base flex items-center gap-2">
                            <span className="text-lg">🤖</span> AI / pgvector
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Enable vector embeddings and AI-powered search in your database.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm">Enable pgvector Extension</p>
                                <p className="text-xs text-zinc-500">Adds the pgvector Postgres extension for storing and searching vector embeddings.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={ai.pgvectorEnabled ?? false} onChange={e => setAi((a: any) => ({ ...a, pgvectorEnabled: e.target.checked }))} className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                            </label>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Default Embedding Model</label>
                            <select value={ai.defaultModel || 'text-embedding-3-small'} onChange={e => setAi((a: any) => ({ ...a, defaultModel: e.target.value }))}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-violet-500">
                                <option value="text-embedding-3-small">text-embedding-3-small (1536d)</option>
                                <option value="text-embedding-3-large">text-embedding-3-large (3072d)</option>
                                <option value="text-embedding-ada-002">text-embedding-ada-002 (Legacy)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">OpenAI API Key (stored in Vault)</label>
                            <input type="password" value={ai.openaiKey || ''} onChange={e => setAi((a: any) => ({ ...a, openaiKey: e.target.value }))} placeholder="sk-..."
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm font-mono rounded focus:outline-none focus:border-violet-500" />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={saveAI} disabled={savingAi} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50">
                                {savingAi ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save AI Config
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GraphQL Config */}
            {gql && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-pink-500/5 to-transparent">
                        <h3 className="font-bold text-base flex items-center gap-2">
                            <span className="text-lg">⚡</span> GraphQL (pg_graphql)
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Auto-generate a GraphQL API from your Postgres schema.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm">Enable GraphQL API</p>
                                <p className="text-xs text-zinc-500">Serves a GraphQL endpoint at your project's API URL.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={gql.enabled ?? false} onChange={e => setGql((g: any) => ({ ...g, enabled: e.target.checked }))} className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1">Max Query Depth</label>
                                <input type="number" min={1} max={20} value={gql.maxDepth ?? 5} onChange={e => setGql((g: any) => ({ ...g, maxDepth: e.target.value }))}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-pink-500" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1">Default Limit</label>
                                <input type="number" min={1} max={1000} value={gql.defaultLimit ?? 100} onChange={e => setGql((g: any) => ({ ...g, defaultLimit: e.target.value }))}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-pink-500" />
                            </div>
                        </div>
                        {gql.endpoint && (
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1">Endpoint</label>
                                <code className="block w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono rounded text-zinc-600 dark:text-zinc-400">{gql.endpoint}</code>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button onClick={saveGQL} disabled={savingGql} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50">
                                {savingGql ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save GraphQL Config
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TypeScript Types */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-cyan-500/5 to-transparent">
                    <h3 className="font-bold text-base flex items-center gap-2">
                        <span className="text-lg">🔷</span> TypeScript Type Generator
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Generate TypeScript types from your Postgres schema.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <button onClick={genTypes} disabled={generatingTypes} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50">
                            {generatingTypes ? <Loader2 size={14} className="animate-spin" /> : <Cpu size={14} />}
                            {generatingTypes ? 'Generating…' : 'Generate Types'}
                        </button>
                        {types && (
                            <>
                                <button onClick={copyTypes} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />} Copy
                                </button>
                                <button onClick={downloadTypes} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    <Download size={12} /> Download .ts
                                </button>
                            </>
                        )}
                    </div>
                    {types && (
                        <pre className="bg-[#0f0f0f] text-zinc-300 text-xs font-mono p-4 rounded-xl overflow-auto max-h-96 border border-zinc-800">
                            {types}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}
