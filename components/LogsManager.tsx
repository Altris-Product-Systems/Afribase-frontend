import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Loader2, Database, ShieldCheck, HardDrive, KeyRound, Cpu } from 'lucide-react';
import { queryProjectLogs } from '@/lib/api';

interface LogsManagerProps {
    projectId: string;
}

// LogEntry from backend: { timestamp, service, level, message }
const LOG_SERVICES = [
    { id: '', label: 'All', icon: Terminal },
    { id: 'postgrest', label: 'Database', icon: Database },
    { id: 'auth', label: 'Auth', icon: ShieldCheck },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'api', label: 'API', icon: KeyRound },
    { id: 'edge-functions', label: 'Functions', icon: Cpu },
];

export default function LogsManager({ projectId }: LogsManagerProps) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [service, setService] = useState('');
    const [limit, setLimit] = useState(50);

    useEffect(() => {
        loadLogs();
    }, [projectId, service, limit]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await queryProjectLogs(projectId, service, limit);
            setLogs(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (ts: string) => {
        if (!ts) return '';
        try { return new Date(ts).toLocaleString(); } catch { return ts; }
    };

    const getLevelColor = (level: string) => {
        switch ((level || '').toLowerCase()) {
            case 'error': return 'text-red-400';
            case 'warn': return 'text-yellow-400';
            case 'debug': return 'text-zinc-500';
            default: return 'text-cyan-400';
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4" style={{ minHeight: '70vh' }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Terminal className="text-purple-500" />
                        Project Logs
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Aggregated logs across all project services.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={limit}
                        onChange={e => setLimit(Number(e.target.value))}
                        className="text-xs font-black uppercase tracking-widest border border-white/10 bg-black/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    >
                        <option value={50}>Last 50</option>
                        <option value={100}>Last 100</option>
                        <option value={500}>Last 500</option>
                    </select>
                    <button
                        onClick={loadLogs}
                        disabled={loading}
                        className="px-5 py-3 bg-zinc-900 border border-white/10 hover:border-emerald-500/50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-500' : 'text-zinc-500'} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Service filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {LOG_SERVICES.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setService(s.id)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-colors border ${service === s.id
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)]'
                            : 'bg-black/40 text-zinc-500 border-white/5 hover:bg-white/5 hover:text-zinc-300'
                            }`}
                    >
                        <s.icon size={14} />
                        {s.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Terminal-style log viewer */}
            <div className="flex-1 bg-[#0f0f0f] border border-zinc-800 rounded-xl overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
                <div className="bg-zinc-900 px-4 py-2.5 flex items-center gap-2 border-b border-zinc-800 shrink-0">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/70" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-zinc-500 text-xs ml-2 font-mono">
                        {service || 'all'} — {logs.length} events
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5">
                    {loading && logs.length === 0 ? (
                        <div className="flex items-center gap-3 text-zinc-500 justify-center h-32">
                            <Loader2 className="animate-spin" size={16} />
                            <span className="text-xs">Fetching logs...</span>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-zinc-600 text-center text-xs mt-16">
                            No log entries found for this filter.
                        </div>
                    ) : (
                        logs.map((log, i) => (
                            <div key={log.id || i} className="hover:bg-white/[0.03] rounded px-2 py-0.5 flex gap-3 items-start">
                                <span className="text-zinc-600 text-[11px] shrink-0 mt-0.5 w-36">{formatTimestamp(log.timestamp)}</span>
                                <span className="text-zinc-500 text-[11px] shrink-0 w-20">[{log.service || 'system'}]</span>
                                <span className={`text-[11px] font-bold shrink-0 uppercase ${getLevelColor(log.level)}`}>
                                    {log.level || 'INFO'}
                                </span>
                                <span className="text-zinc-300 text-[12px] break-all">{log.message}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
