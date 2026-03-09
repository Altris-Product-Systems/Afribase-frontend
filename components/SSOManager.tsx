'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, Plus, Trash2, Globe, Link, FileText, Tag } from 'lucide-react';
import { listSSOProviders, createSSOProvider, deleteSSOProvider } from '@/lib/api';
import { useConfirm } from '@/lib/hooks/useConfirm';
import toast from 'react-hot-toast';

interface SSOManagerProps { projectId: string; }

export default function SSOManager({ projectId }: SSOManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [type, setType] = useState('saml');
    const [metadataUrl, setMetadataUrl] = useState('');
    const [metadataXml, setMetadataXml] = useState('');
    const [domains, setDomains] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await listSSOProviders(projectId); setProviders(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreating(true);
            const p = await createSSOProvider(projectId, {
                type, metadataUrl: metadataUrl || undefined,
                metadataXml: metadataXml || undefined,
                domains: domains ? domains.split(',').map(d => d.trim()) : [],
            });
            setProviders(prev => [...prev, p]);
            setShowForm(false); setMetadataUrl(''); setMetadataXml(''); setDomains('');
        } catch (e: any) { setError(e.message); } finally { setCreating(false); }
    };

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: 'Delete SSO Provider',
            message: 'Delete this SSO provider?',
            variant: 'danger',
            confirmText: 'Delete Provider'
        });
        if (!ok) return;
        try { await deleteSSOProvider(projectId, id); setProviders(prev => prev.filter(p => p.id !== id)); }
        catch (e: any) { setError(e.message); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-blue-500" />SSO / SAML Providers</h2>
                    <p className="text-sm text-zinc-500 mt-1">Configure enterprise single sign-on with SAML or OIDC.</p>
                </div>
                <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
                    <Plus size={14} /> Add Provider
                </button>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
            {showForm && (
                <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-950">
                    <h3 className="font-semibold text-sm mb-4">Configure Identity Provider</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="flex gap-3">
                            {['saml', 'oidc'].map(t => (
                                <button type="button" key={t} onClick={() => setType(t)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${type === t ? 'bg-blue-600 text-white border-blue-600' : 'border-zinc-700 text-zinc-500'}`}>
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Metadata URL</label>
                            <input type="url" value={metadataUrl} onChange={e => setMetadataUrl(e.target.value)} placeholder="https://idp.example.com/saml/metadata"
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-blue-500 text-zinc-100" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Or paste Metadata XML</label>
                            <textarea value={metadataXml} onChange={e => setMetadataXml(e.target.value)} rows={4} placeholder="<EntityDescriptor ...>"
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm font-mono rounded focus:outline-none focus:border-blue-500 text-zinc-100" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Email Domains (comma-separated)</label>
                            <input value={domains} onChange={e => setDomains(e.target.value)} placeholder="company.com, subsidiary.org"
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-blue-500 text-zinc-100" />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-500">Cancel</button>
                            <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2">
                                {creating && <Loader2 size={14} className="animate-spin" />} Save Provider
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Identity Providers</h3>
                    <span className="text-xs text-zinc-500">{providers.length} configured</span>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                ) : providers.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-zinc-500">
                        <ShieldCheck size={32} className="mb-3 text-zinc-400" />
                        <p>No SSO providers configured</p>
                        <p className="text-xs text-zinc-400 mt-1">Add a SAML or OIDC provider to enable enterprise login.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-left">Type</th>
                                <th className="px-6 py-3 font-medium text-left">Domains</th>
                                <th className="px-6 py-3 font-medium text-left">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {providers.map(p => (
                                <tr key={p.id} className="hover:bg-zinc-900/50">
                                    <td className="px-6 py-4"><code className="text-xs bg-zinc-800 px-2 py-1 rounded uppercase font-bold">{p.type}</code></td>
                                    <td className="px-6 py-4 text-xs text-zinc-500">{(p.domains || []).join(', ') || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${p.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                                            {p.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
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
