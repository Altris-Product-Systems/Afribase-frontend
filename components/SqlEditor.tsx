'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Loader2, Copy, Download, Clock, ChevronRight } from 'lucide-react';
import { executeSql } from '@/lib/api';

interface SqlEditorProps { projectId: string; }

const SAMPLE_QUERIES = [
    { label: 'List tables', sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" },
    { label: 'Table sizes', sql: "SELECT relname AS table, pg_size_pretty(pg_total_relation_size(relid)) AS size FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC;" },
    { label: 'Active connections', sql: "SELECT pid, usename, application_name, state, query FROM pg_stat_activity WHERE state IS NOT NULL LIMIT 20;" },
    { label: 'Row counts', sql: "SELECT schemaname, relname, n_live_tup AS row_count FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 20;" },
];

export default function SqlEditor({ projectId }: SqlEditorProps) {
    const [query, setQuery] = useState('SELECT * FROM information_schema.tables LIMIT 10;');
    const [results, setResults] = useState<any[] | null>(null);
    const [execTime, setExecTime] = useState('');
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const runQuery = async () => {
        if (!query.trim()) return;
        setRunning(true);
        setError(null);
        setResults(null);
        try {
            const data = await executeSql(projectId, query);
            setResults(data.results || []);
            setExecTime(data.execution_time || '');
            setHistory(prev => [query, ...prev.slice(0, 9)]);
        } catch (err: any) {
            setError(err.message || 'Query failed');
        } finally {
            setRunning(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); runQuery(); }
    };

    const copyResults = () => {
        if (!results) return;
        navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    };

    const downloadCSV = () => {
        if (!results || results.length === 0) return;
        const headers = Object.keys(results[0]);
        const csv = [headers.join(','), ...results.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'query_results.csv'; a.click();
    };

    const columns = results && results.length > 0 ? Object.keys(results[0]) : [];

    return (
        <div className="flex flex-col h-full space-y-4" style={{ minHeight: '80vh' }}>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Terminal className="text-emerald-500" /> SQL Editor
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">Run queries directly against your project database.</p>
                </div>
                <div className="flex gap-2">
                    {SAMPLE_QUERIES.map(q => (
                        <button key={q.label} onClick={() => setQuery(q.sql)}
                            className="text-[10px] px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hidden md:block">
                            {q.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-zinc-800">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/60" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                    </div>
                    <span className="text-zinc-500 text-xs font-mono">query.sql</span>
                    <button onClick={runQuery} disabled={running}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors disabled:opacity-50">
                        {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                        {running ? 'Running…' : 'Run  ⌘↵'}
                    </button>
                </div>
                <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#0f0f0f] text-zinc-200 font-mono text-sm p-4 resize-none focus:outline-none min-h-[160px]"
                    spellCheck={false}
                    placeholder="SELECT * FROM ..."
                />
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-mono">
                    <strong>ERROR:</strong> {error}
                </div>
            )}

            {/* Results */}
            {results !== null && (
                <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{results.length} row{results.length !== 1 ? 's' : ''}</span>
                            {execTime && <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock size={10} />{execTime}</span>}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={copyResults} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors" title="Copy JSON"><Copy size={14} /></button>
                            <button onClick={downloadCSV} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors" title="Download CSV"><Download size={14} /></button>
                        </div>
                    </div>
                    {results.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-sm">Query returned 0 rows.</div>
                    ) : (
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-xs font-mono text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/70 sticky top-0">
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col} className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                    {results.map((row, i) => (
                                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                                            {columns.map(col => (
                                                <td key={col} className="px-4 py-2 text-zinc-700 dark:text-zinc-300 max-w-xs truncate whitespace-nowrap">
                                                    {row[col] === null ? <span className="text-zinc-400 italic">null</span> : String(row[col])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* History */}
            {history.length > 0 && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Query History</p>
                    <div className="space-y-1">
                        {history.map((q, i) => (
                            <button key={i} onClick={() => setQuery(q)}
                                className="w-full text-left text-xs font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors truncate">
                                <ChevronRight size={10} className="shrink-0" />
                                <span className="truncate">{q}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
