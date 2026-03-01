'use client';
import React, { useState, useEffect } from 'react';
import { Archive, Plus, Trash2, RotateCcw, Loader2, Download, RefreshCw } from 'lucide-react';
import { listBackups, createBackup, deleteBackup, restoreBackup } from '@/lib/api';

interface BackupsManagerProps { projectId: string; }

const STATUS_COLORS: Record<string, string> = {
    completed: 'text-emerald-500 bg-emerald-500/10',
    pending: 'text-yellow-500 bg-yellow-500/10',
    in_progress: 'text-blue-500 bg-blue-500/10',
    failed: 'text-red-500 bg-red-500/10',
};

export default function BackupsManager({ projectId }: BackupsManagerProps) {
    const [backups, setBackups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [restoringId, setRestoringId] = useState<string | null>(null);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await listBackups(projectId); setBackups(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const handleCreate = async () => {
        try { setCreating(true); const b = await createBackup(projectId, 'manual'); setBackups(prev => [b, ...prev]); }
        catch (e: any) { setError(e.message); } finally { setCreating(false); }
    };

    const handleRestore = async (id: string) => {
        if (!confirm('Restore this backup? Current data may be overwritten.')) return;
        try { setRestoringId(id); await restoreBackup(projectId, id); alert('Restore initiated successfully!'); }
        catch (e: any) { setError(e.message); } finally { setRestoringId(null); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this backup permanently?')) return;
        try { await deleteBackup(projectId, id); setBackups(prev => prev.filter(b => b.id !== id)); }
        catch (e: any) { setError(e.message); }
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '—';
        if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
        if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
        return `${(bytes / 1024).toFixed(1)} KB`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Archive className="text-amber-500" />Database Backups</h2>
                    <p className="text-sm text-zinc-500 mt-1">Create and restore point-in-time database backups.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} disabled={loading} className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
                        <RefreshCw size={14} className={`text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={handleCreate} disabled={creating} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50">
                        {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                        {creating ? 'Creating…' : 'New Backup'}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

            {/* Info card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Backups', value: backups.length, color: 'text-amber-500' },
                    { label: 'Completed', value: backups.filter(b => b.status === 'completed').length, color: 'text-emerald-500' },
                    { label: 'Latest', value: backups[0] ? new Date(backups[0].createdAt).toLocaleDateString() : '—', color: 'text-blue-500' },
                ].map(stat => (
                    <div key={stat.label} className="border border-zinc-800 rounded-xl p-4 bg-zinc-950">
                        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                        <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Archive size={16} />Backup History</h3>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
                ) : backups.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-zinc-500">
                        <Archive size={32} className="mb-3 text-zinc-400" />
                        <p>No backups found</p>
                        <p className="text-xs text-zinc-400 mt-1">Click "New Backup" to create your first snapshot.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-left">Type</th>
                                <th className="px-6 py-3 font-medium text-left">Status</th>
                                <th className="px-6 py-3 font-medium text-left">Size</th>
                                <th className="px-6 py-3 font-medium text-left">Created</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {backups.map(b => (
                                <tr key={b.id} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4"><code className="text-xs bg-zinc-800 px-2 py-1 rounded capitalize">{b.type || 'manual'}</code></td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">{formatSize(b.sizeBytes)}</td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">{b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-1">
                                        <button onClick={() => handleRestore(b.id)} disabled={restoringId === b.id || b.status !== 'completed'}
                                            className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors disabled:opacity-30" title="Restore">
                                            {restoringId === b.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                                        </button>
                                        <button onClick={() => handleDelete(b.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors" title="Delete">
                                            <Trash2 size={14} />
                                        </button>
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
