'use client';
import React, { useState, useEffect } from 'react';
import { Rss, Plus, Trash2, Loader2 } from 'lucide-react';
import { listLogDrains, createLogDrain, deleteLogDrain } from '@/lib/api';

interface LogDrainsManagerProps { projectId: string; }

const DRAIN_TYPES = ['http', 'datadog', 'papertrail', 's3', 'loki'];
const SOURCES = ['api', 'auth', 'postgrest', 'storage', 'edge-functions'];

export default function LogDrainsManager({ projectId }: LogDrainsManagerProps) {
    const [drains, setDrains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('http');
    const [endpoint, setEndpoint] = useState('');
    const [sources, setSources] = useState<string[]>(['api', 'auth']);
    const [creating, setCreating] = useState(false);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await listLogDrains(projectId); setDrains(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const toggleSource = (s: string) => setSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !endpoint || sources.length === 0) return;
        try {
            setCreating(true);
            const d = await createLogDrain(projectId, { name, type, config: { url: endpoint }, sources });
            setDrains(prev => [...prev, d]);
            setShowForm(false); setName(''); setEndpoint('');
        } catch (e: any) { setError(e.message); } finally { setCreating(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this log drain?')) return;
        try { await deleteLogDrain(projectId, id); setDrains(prev => prev.filter(d => d.id !== id)); }
        catch (e: any) { setError(e.message); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Rss className="text-teal-500" />Log Drains</h2>
                    <p className="text-sm text-zinc-500 mt-1">Forward project logs to external monitoring services.</p>
                </div>
                <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
                    <Plus size={14} /> New Drain
                </button>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
            {showForm && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-950">
                    <h3 className="font-semibold text-sm mb-4">Create Log Drain</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1">Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} placeholder="My Datadog Drain"
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1">Type</label>
                                <select value={type} onChange={e => setType(e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-teal-500">
                                    {DRAIN_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Endpoint URL</label>
                            <input type="url" value={endpoint} onChange={e => setEndpoint(e.target.value)} placeholder="https://your-collector.example.com/logs"
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-2">Log Sources</label>
                            <div className="flex flex-wrap gap-2">
                                {SOURCES.map(s => (
                                    <button type="button" key={s} onClick={() => toggleSource(s)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${sources.includes(s) ? 'bg-teal-500 text-white border-teal-500' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-500">Cancel</button>
                            <button type="submit" disabled={creating || !name || !endpoint || sources.length === 0}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2">
                                {creating && <Loader2 size={14} className="animate-spin" />} Create Drain
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Rss size={16} />Active Drains</h3>
                    <span className="text-xs text-zinc-500">{drains.length} active</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-teal-500" /></div>
                ) : drains.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-zinc-500">
                        <Rss size={32} className="mb-3 text-zinc-400" />
                        <p>No log drains configured</p>
                        <p className="text-xs text-zinc-400 mt-1">Forward logs to Datadog, Loki, S3, or any HTTP endpoint.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-left">Name</th>
                                <th className="px-6 py-3 font-medium text-left">Type</th>
                                <th className="px-6 py-3 font-medium text-left">Sources</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {drains.map(d => (
                                <tr key={d.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{d.name}</td>
                                    <td className="px-6 py-4"><code className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-1 rounded">{d.type}</code></td>
                                    <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{(d.sources || []).map((s: string) => <span key={s} className="text-[10px] font-bold border border-zinc-300 dark:border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded">{s}</span>)}</div></td>
                                    <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(d.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
