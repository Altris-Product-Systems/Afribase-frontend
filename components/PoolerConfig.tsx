'use client';
import React, { useState, useEffect } from 'react';
import { Database, Loader2, Save } from 'lucide-react';
import { getPoolConfig, updatePoolConfig, getPoolStats } from '@/lib/api';

interface PoolerConfigProps { projectId: string; }

export default function PoolerConfig({ projectId }: PoolerConfigProps) {
    const [config, setConfig] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try {
            setLoading(true); setError(null);
            const [c, s] = await Promise.allSettled([getPoolConfig(projectId), getPoolStats(projectId)]);
            if (c.status === 'fulfilled') setConfig(c.value);
            if (s.status === 'fulfilled') setStats(s.value);
        } catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const handleSave = async () => {
        try {
            setSaving(true); setError(null);
            const updated = await updatePoolConfig(projectId, {
                enabled: config.enabled,
                poolMode: config.poolMode,
                defaultPoolSize: Number(config.defaultPoolSize),
                maxClientConnections: Number(config.maxClientConnections),
            });
            setConfig(updated || config);
            setSuccess(true); setTimeout(() => setSuccess(false), 2000);
        } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Database className="text-indigo-500" />Connection Pooler</h2>
                <p className="text-sm text-zinc-500 mt-1">Configure PgBouncer connection pooling for your project.</p>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Active', value: stats.activeConnections ?? '—', color: 'text-emerald-500' },
                        { label: 'Idle', value: stats.idleConnections ?? '—', color: 'text-blue-500' },
                        { label: 'Waiting', value: stats.waitingClients ?? '—', color: 'text-amber-500' },
                        { label: 'Total Used', value: stats.totalConnections ?? '—', color: 'text-zinc-600' },
                    ].map(s => (
                        <div key={s.label} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-950 text-center">
                            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{s.label}</p>
                            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {config && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-sm">Enable Connection Pooler</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Route connections through PgBouncer for efficiency.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={config.enabled ?? false} onChange={e => setConfig((c: any) => ({ ...c, enabled: e.target.checked }))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 block mb-1">Pool Mode</label>
                        <select value={config.poolMode || 'transaction'} onChange={e => setConfig((c: any) => ({ ...c, poolMode: e.target.value }))}
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-indigo-500">
                            <option value="session">Session — full session lifetime</option>
                            <option value="transaction">Transaction — pooled per transaction (recommended)</option>
                            <option value="statement">Statement — pooled per statement</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Default Pool Size</label>
                            <input type="number" min={1} max={500} value={config.defaultPoolSize ?? 15} onChange={e => setConfig((c: any) => ({ ...c, defaultPoolSize: e.target.value }))}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Max Client Connections</label>
                            <input type="number" min={1} max={10000} value={config.maxClientConnections ?? 200} onChange={e => setConfig((c: any) => ({ ...c, maxClientConnections: e.target.value }))}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-indigo-500" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleSave} disabled={saving}
                            className={`px-4 py-2 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 ${success ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {success ? 'Saved!' : 'Save Config'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
