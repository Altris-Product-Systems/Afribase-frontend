'use client';
import React, { useState, useEffect } from 'react';
import { Lock, Plus, Trash2, Loader2, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { listVaultSecrets, createVaultSecret, deleteVaultSecret } from '@/lib/api';
import { useConfirm } from '@/lib/hooks/useConfirm';
import toast from 'react-hot-toast';

interface VaultManagerProps { projectId: string; }

export default function VaultManager({ projectId }: VaultManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [secrets, setSecrets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await listVaultSecrets(projectId); setSecrets(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !value) return;
        try {
            setCreating(true);
            const s = await createVaultSecret(projectId, name, value, description || undefined);
            setSecrets(prev => [...prev, s]);
            setShowForm(false); setName(''); setValue(''); setDescription('');
        } catch (e: any) { setError(e.message); } finally { setCreating(false); }
    };

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: 'Delete Secret',
            message: 'Delete this secret? This cannot be undone.',
            variant: 'danger',
            confirmText: 'Delete Secret'
        });
        if (!ok) return;
        try { await deleteVaultSecret(projectId, id); setSecrets(prev => prev.filter(s => s.id !== id)); }
        catch (e: any) { setError(e.message); }
    };

    const toggleReveal = (id: string) => setRevealedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const copySecret = async (id: string, val: string) => {
        await navigator.clipboard.writeText(val);
        setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Lock className="text-purple-500" />Vault / Secrets</h2>
                    <p className="text-sm text-zinc-500 mt-1">Securely store and manage sensitive configuration secrets.</p>
                </div>
                <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
                    <Plus size={14} /> New Secret
                </button>
            </div>



            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

            {showForm && (
                <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-950">
                    <h3 className="font-semibold text-sm mb-4">Add Secret</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1">Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} placeholder="OPENAI_API_KEY"
                                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm font-mono rounded focus:outline-none focus:border-purple-500 text-zinc-100" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-500 block mb-1">Description (optional)</label>
                                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="OpenAI API key for embeddings"
                                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-purple-500 text-zinc-100" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Secret Value</label>
                            <textarea value={value} onChange={e => setValue(e.target.value)} rows={3} placeholder="sk-..."
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm font-mono rounded focus:outline-none focus:border-purple-500 text-zinc-100" />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-500">Cancel</button>
                            <button type="submit" disabled={creating || !name || !value}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2">
                                {creating && <Loader2 size={14} className="animate-spin" />} Store Secret
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Lock size={16} />Secrets Store</h3>
                    <span className="text-xs text-zinc-500">{secrets.length} secrets</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
                ) : secrets.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-zinc-500">
                        <Lock size={32} className="mb-3 text-zinc-400" />
                        <p>No secrets stored</p>
                        <p className="text-xs text-zinc-400 mt-1">Store API keys, tokens, and credentials securely.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800">
                        {secrets.map(s => (
                            <div key={s.id} className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-900/50 transition-colors">
                                <Lock size={16} className="text-purple-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-sm font-semibold text-zinc-100">{s.name}</p>
                                    </div>
                                    {s.description && <p className="text-xs text-zinc-500 mt-0.5">{s.description}</p>}
                                    {s.createdAt && <p className="text-[10px] text-zinc-400 mt-0.5">Added {new Date(s.createdAt).toLocaleString()}</p>}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <div className="flex items-center gap-1 font-mono text-sm bg-zinc-800 px-3 py-1.5 rounded text-zinc-500">
                                        {revealedIds.has(s.id) ? (s.decrypted || '••••••••') : '••••••••••••••••'}
                                    </div>
                                    <button onClick={() => toggleReveal(s.id)} className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors">
                                        {revealedIds.has(s.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button onClick={() => copySecret(s.id, s.decrypted || s.name)} className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors">
                                        {copiedId === s.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog />
        </div>
    );
}
