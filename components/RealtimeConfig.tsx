'use client';
import React, { useState, useEffect } from 'react';
import { Radio, Save, Loader2 } from 'lucide-react';
import { getRealtimeConfig, updateRealtimeConfig } from '@/lib/api';

interface RealtimeConfigProps { projectId: string; }

export default function RealtimeConfig({ projectId }: RealtimeConfigProps) {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try { setLoading(true); setError(null); const d = await getRealtimeConfig(projectId); setConfig(d); }
        catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    const update = (key: string, val: any) => setConfig((c: any) => ({ ...c, [key]: val }));

    const handleSave = async () => {
        try {
            setSaving(true); setError(null);
            await updateRealtimeConfig(projectId, {
                replayEnabled: config.replayEnabled,
                retentionMinutes: Number(config.retentionMinutes),
                maxEventsPerSec: Number(config.maxEventsPerSec),
            });
            setSuccess(true); setTimeout(() => setSuccess(false), 2000);
        } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Radio className="text-pink-500" />Realtime Configuration</h2>
                <p className="text-sm text-zinc-500 mt-1">Configure broadcast, replay, and rate limits for Realtime channels.</p>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

            {config && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-sm">Enable Message Replay</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Clients who reconnect receive missed messages within the retention window.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={config.replayEnabled ?? false} onChange={e => update('replayEnabled', e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Retention Window (minutes)</label>
                            <input type="number" min={1} max={1440} value={config.retentionMinutes ?? 30} onChange={e => update('retentionMinutes', e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-pink-500" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Max Events / Second</label>
                            <input type="number" min={1} max={10000} value={config.maxEventsPerSec ?? 100} onChange={e => update('maxEventsPerSec', e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-pink-500" />
                        </div>
                    </div>

                    {config.endpoint && (
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Realtime Endpoint</label>
                            <code className="block w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono rounded text-zinc-600 dark:text-zinc-400">{config.endpoint}</code>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button onClick={handleSave} disabled={saving}
                            className={`px-4 py-2 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 ${success ? 'bg-emerald-600' : 'bg-pink-600 hover:bg-pink-700'}`}>
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {success ? 'Saved!' : 'Save Config'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
