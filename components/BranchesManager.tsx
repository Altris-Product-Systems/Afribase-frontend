'use client';
import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Trash2, Loader2, Merge } from 'lucide-react';
import { listBranches, createBranch, deleteBranch } from '@/lib/api';

interface BranchesManagerProps { projectId: string; }

const STATUS_COLORS: Record<string, string> = {
    active: 'text-emerald-500 bg-emerald-500/10',
    creating: 'text-blue-500 bg-blue-500/10',
    merging: 'text-amber-500 bg-amber-500/10',
    merged: 'text-zinc-500 bg-zinc-500/10',
    error: 'text-red-500 bg-red-500/10',
};

export default function BranchesManager({ projectId }: BranchesManagerProps) {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await listBranches(projectId); setBranches(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            setCreating(true);
            const b = await createBranch(projectId, newName.trim());
            setBranches(prev => [...prev, b]);
            setNewName('');
        } catch (e: any) { setError(e.message); } finally { setCreating(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this database branch?')) return;
        try { await deleteBranch(projectId, id); setBranches(prev => prev.filter(b => b.id !== id)); }
        catch (e: any) { setError(e.message); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><GitBranch className="text-violet-500" />Database Branches</h2>
                    <p className="text-sm text-zinc-500 mt-1">Create isolated database environments for preview and testing.</p>
                </div>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleCreate} className="flex gap-3">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="feature/new-schema"
                    className="flex-1 bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded-lg focus:outline-none focus:border-violet-500 text-zinc-100" />
                <button type="submit" disabled={creating || !newName.trim()} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50">
                    {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Branch
                </button>
            </form>
            <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><GitBranch size={16} />Branches</h3>
                    <span className="text-xs text-zinc-500">{branches.length} branches</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
                ) : branches.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-zinc-500">
                        <GitBranch size={32} className="mb-3 text-zinc-400" />
                        <p>No branches yet</p>
                        <p className="text-xs text-zinc-400 mt-1">Create a branch to safely test schema changes.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-left">Name</th>
                                <th className="px-6 py-3 font-medium text-left">Status</th>
                                <th className="px-6 py-3 font-medium text-left">PostgrestURL</th>
                                <th className="px-6 py-3 font-medium text-left">Created</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {branches.map(b => (
                                <tr key={b.id} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm font-semibold flex items-center gap-2"><GitBranch size={14} className="text-violet-500" />{b.name}</td>
                                    <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLORS[b.status] || STATUS_COLORS.creating}`}>{b.status}</span></td>
                                    <td className="px-6 py-4 text-xs text-zinc-500 font-mono max-w-xs truncate">{b.postgrestUrl || '—'}</td>
                                    <td className="px-6 py-4 text-xs text-zinc-500">{b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(b.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
