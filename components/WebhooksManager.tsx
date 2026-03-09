'use client';
import React, { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2, Loader2, RefreshCw, Zap } from 'lucide-react';
import { listWebhooks, createWebhook, deleteWebhook } from '@/lib/api';
import { useConfirm } from '@/lib/hooks/useConfirm';
import toast from 'react-hot-toast';

interface WebhooksManagerProps { projectId: string; }

const EVENTS = ['INSERT', 'UPDATE', 'DELETE'];

export default function WebhooksManager({ projectId }: WebhooksManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [hooks, setHooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [table, setTable] = useState('');
    const [schema, setSchema] = useState('public');
    const [events, setEvents] = useState<string[]>(['INSERT']);
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('POST');
    const [creating, setCreating] = useState(false);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await listWebhooks(projectId); setHooks(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const toggleEvent = (e: string) => setEvents(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

    const handleCreate = async (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!name || !table || !url || events.length === 0) return;
        try {
            setCreating(true);
            const h = await createWebhook(projectId, { name, table, schema, events, url, method });
            setHooks(prev => [...prev, h]);
            setShowForm(false); setName(''); setTable(''); setUrl(''); setEvents(['INSERT']);
        } catch (e: any) { setError(e.message); } finally { setCreating(false); }
    };

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: 'Delete Webhook',
            message: 'Delete this webhook?',
            variant: 'danger',
            confirmText: 'Delete Webhook'
        });
        if (!ok) return;
        try { await deleteWebhook(projectId, id); setHooks(prev => prev.filter(h => h.id !== id)); }
        catch (e: any) { setError(e.message); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="text-orange-500" />Database Webhooks</h2>
                    <p className="text-sm text-zinc-500 mt-1">Fire HTTP requests when database events occur.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
                        <RefreshCw size={14} className={`text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
                        <Plus size={14} /> New Webhook
                    </button>
                </div>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
            {showForm && (
                <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-950">
                    <h3 className="font-semibold text-sm mb-4">Create Webhook</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Webhook Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. notify-slack-on-insert"
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-orange-500 text-zinc-100" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Table</label>
                            <input value={table} onChange={e => setTable(e.target.value)} placeholder="users"
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-orange-500 text-zinc-100" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Endpoint URL</label>
                            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-service.com/webhook"
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-orange-500 text-zinc-100" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-2">Events</label>
                            <div className="flex gap-2">
                                {EVENTS.map(e => (
                                    <button type="button" key={e} onClick={() => toggleEvent(e)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${events.includes(e) ? 'bg-orange-500 text-white border-orange-500' : 'border-zinc-700 text-zinc-500'}`}>
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">HTTP Method</label>
                            <select value={method} onChange={e => setMethod(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-orange-500 text-zinc-100">
                                {['POST', 'PUT', 'PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-500">Cancel</button>
                            <button type="submit" disabled={creating || !name || !table || !url || events.length === 0}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2">
                                {creating && <Loader2 size={14} className="animate-spin" />} Create Webhook
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Webhook size={16} />Active Webhooks</h3>
                    <span className="text-xs text-zinc-500">{hooks.length} configured</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
                ) : hooks.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-zinc-500">
                        <Zap size={32} className="mb-3 text-zinc-400" />
                        <p>No webhooks configured</p>
                        <p className="text-xs text-zinc-400 mt-1">Trigger HTTP requests on INSERT, UPDATE or DELETE events.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-left">Name</th>
                                <th className="px-6 py-3 font-medium text-left">Table</th>
                                <th className="px-6 py-3 font-medium text-left">Events</th>
                                <th className="px-6 py-3 font-medium text-left">Endpoint</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {hooks.map(h => (
                                <tr key={h.id} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{h.name}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-zinc-500">{h.schema}.{h.table}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            {(h.events || []).map((e: string) => (
                                                <span key={e} className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-orange-500/10 text-orange-500 rounded">{e}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-500 max-w-xs truncate">{h.url}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(h.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <ConfirmDialog />
        </div>
    );
}
