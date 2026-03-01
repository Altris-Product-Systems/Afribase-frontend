'use client';
import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Loader2, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { listCustomDomains, addCustomDomain, verifyCustomDomain, removeCustomDomain } from '@/lib/api';

interface DomainsManagerProps { projectId: string; }

export default function DomainsManager({ projectId }: DomainsManagerProps) {
    const [domains, setDomains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newDomain, setNewDomain] = useState('');
    const [adding, setAdding] = useState(false);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await listCustomDomains(projectId); setDomains(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain.trim()) return;
        try {
            setAdding(true);
            const d = await addCustomDomain(projectId, newDomain.trim());
            setDomains(prev => [...prev, d]);
            setNewDomain('');
        } catch (e: any) { setError(e.message); } finally { setAdding(false); }
    };

    const handleVerify = async (id: string) => {
        try {
            setVerifyingId(id);
            const r = await verifyCustomDomain(projectId, id);
            setDomains(prev => prev.map(d => d.id === id ? { ...d, ...r } : d));
        } catch (e: any) { setError(e.message); } finally { setVerifyingId(null); }
    };

    const handleRemove = async (id: string) => {
        if (!confirm('Remove this custom domain?')) return;
        try { await removeCustomDomain(projectId, id); setDomains(prev => prev.filter(d => d.id !== id)); }
        catch (e: any) { setError(e.message); }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === 'verified' || status === 'active') return <CheckCircle size={16} className="text-emerald-500" />;
        if (status === 'pending') return <Clock size={16} className="text-yellow-500" />;
        return <AlertCircle size={16} className="text-red-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Globe className="text-cyan-500" />Custom Domains</h2>
                    <p className="text-sm text-zinc-500 mt-1">Map your own domain to this project's API endpoint.</p>
                </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

            {/* Add domain */}
            <form onSubmit={handleAdd} className="flex gap-3">
                <input value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="api.yourdomain.com"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded-lg focus:outline-none focus:border-cyan-500" />
                <button type="submit" disabled={adding || !newDomain}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50">
                    {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Add Domain
                </button>
            </form>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Globe size={16} />Domains</h3>
                    <span className="text-xs text-zinc-500">{domains.length} configured</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
                ) : domains.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-zinc-500">
                        <Globe size={32} className="mb-3 text-zinc-400" />
                        <p>No custom domains yet</p>
                        <p className="text-xs text-zinc-400 mt-1">Add a custom domain and point a CNAME to your project.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {domains.map(d => (
                            <div key={d.id} className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                <StatusIcon status={d.status} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{d.domain}</p>
                                        <a href={`https://${d.domain}`} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-cyan-500 transition-colors">
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                    {d.cnameTarget && (
                                        <div className="mt-1">
                                            <p className="text-xs text-zinc-500">CNAME → <code className="font-mono text-zinc-400">{d.cnameTarget}</code></p>
                                        </div>
                                    )}
                                    {d.error && <p className="text-xs text-red-500 mt-0.5">{d.error}</p>}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${d.status === 'verified' || d.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                                        d.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                    }`}>{d.status || 'pending'}</span>
                                <div className="flex items-center gap-1">
                                    {d.status !== 'verified' && d.status !== 'active' && (
                                        <button onClick={() => handleVerify(d.id)} disabled={verifyingId === d.id}
                                            className="px-3 py-1.5 text-xs font-semibold text-cyan-600 border border-cyan-600/30 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors disabled:opacity-50">
                                            {verifyingId === d.id ? <Loader2 size={12} className="animate-spin" /> : 'Verify'}
                                        </button>
                                    )}
                                    <button onClick={() => handleRemove(d.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-600 dark:text-zinc-400">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">DNS Setup Instructions</p>
                <p>Add a <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">CNAME</code> record from your domain to the project endpoint shown above, then click <strong>Verify</strong>.</p>
            </div>
        </div>
    );
}
