'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Loader2, Save } from 'lucide-react';
import { getNetworkRestrictions, updateNetworkRestrictions } from '@/lib/api';

interface NetworkRestrictionsProps { projectId: string; }

export default function NetworkRestrictions({ projectId }: NetworkRestrictionsProps) {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [allowList, setAllowList] = useState<string[]>([]);
    const [denyList, setDenyList] = useState<string[]>([]);
    const [newAllow, setNewAllow] = useState('');
    const [newDeny, setNewDeny] = useState('');

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try {
            setLoading(true); setError(null);
            const d = await getNetworkRestrictions(projectId);
            setConfig(d); setEnabled(d.enabled ?? false);
            setAllowList(d.allowList || []); setDenyList(d.denyList || []);
        } catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const handleSave = async () => {
        try {
            setSaving(true); setError(null);
            await updateNetworkRestrictions(projectId, { enabled, allowList, denyList });
            setSuccess(true); setTimeout(() => setSuccess(false), 2000);
        } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="text-red-500" />Network Restrictions</h2>
                <p className="text-sm text-zinc-500 mt-1">Control which IP addresses can access your project's API.</p>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

            <div className="border border-zinc-800 rounded-xl bg-zinc-950 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-sm">Enable Network Restrictions</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Only traffic matching the allow list will be permitted.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                </div>

                {enabled && (
                    <>
                        <div>
                            <h4 className="font-semibold text-sm mb-3 text-emerald-400">✅ Allow List (CIDR ranges)</h4>
                            <div className="space-y-2 mb-3">
                                {allowList.map((ip, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <code className="flex-1 text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded font-mono text-zinc-300">{ip}</code>
                                        <button onClick={() => setAllowList(prev => prev.filter((_, j) => j !== i))} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={newAllow} onChange={e => setNewAllow(e.target.value)} placeholder="192.168.1.0/24 or 0.0.0.0/0"
                                    className="flex-1 bg-zinc-900 border border-zinc-800 p-2 text-sm font-mono rounded focus:outline-none focus:border-emerald-500 text-zinc-100" />
                                <button onClick={() => { if (newAllow) { setAllowList(prev => [...prev, newAllow]); setNewAllow(''); } }}
                                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded"><Plus size={14} /></button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3 text-red-400">🚫 Deny List</h4>
                            <div className="space-y-2 mb-3">
                                {denyList.map((ip, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <code className="flex-1 text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded font-mono text-zinc-300">{ip}</code>
                                        <button onClick={() => setDenyList(prev => prev.filter((_, j) => j !== i))} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={newDeny} onChange={e => setNewDeny(e.target.value)} placeholder="10.0.0.5/32"
                                    className="flex-1 bg-zinc-900 border border-zinc-800 p-2 text-sm font-mono rounded focus:outline-none focus:border-red-500 text-zinc-100" />
                                <button onClick={() => { if (newDeny) { setDenyList(prev => [...prev, newDeny]); setNewDeny(''); } }}
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded"><Plus size={14} /></button>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving}
                        className={`px-4 py-2 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors ${success ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-700'}`}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {success ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
