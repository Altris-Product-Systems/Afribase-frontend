'use client';
import React, { useState, useEffect } from 'react';
import { Table, RefreshCw, Loader2, ChevronDown, ChevronRight, Key, Hash, Link } from 'lucide-react';
import { getSchemaTables } from '@/lib/api';

interface TableEditorProps { projectId: string; }

export default function TableEditor({ projectId }: TableEditorProps) {
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    useEffect(() => { load(); }, [projectId]);

    const load = async () => {
        try {
            setLoading(true); setError(null);
            const data = await getSchemaTables(projectId);
            setTables(data);
            if (data.length > 0 && !selectedTable) setSelectedTable(data[0].name);
        } catch (err: any) { setError(err.message || 'Failed to load tables'); }
        finally { setLoading(false); }
    };

    const activeTable = tables.find(t => t.name === selectedTable);

    const ColumnBadge = ({ col }: { col: any }) => (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 transition-colors">
            <div className="flex items-center gap-1.5 w-5 shrink-0">
                {col.primaryKey && <Key size={12} className="text-amber-500" title="Primary Key" />}
                {col.foreignKey && <Link size={12} className="text-blue-500" title="Foreign Key" />}
                {!col.primaryKey && !col.foreignKey && <span className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-700" />}
            </div>
            <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 w-40 truncate">{col.name}</span>
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400 font-mono">{col.type}</code>
            {!col.nullable && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">required</span>}
            {col.default && <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px]">DEFAULT {col.default}</span>}
        </div>
    );

    return (
        <div className="flex h-full gap-4" style={{ minHeight: '75vh' }}>
            {/* Table list sidebar */}
            <div className="w-56 shrink-0 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden flex flex-col">
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Tables</span>
                    <button onClick={load} disabled={loading} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors">
                        <RefreshCw size={12} className={`text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-zinc-400" /></div>
                    ) : tables.length === 0 ? (
                        <p className="text-xs text-zinc-500 text-center py-6">No tables found</p>
                    ) : (
                        tables.map(t => (
                            <button key={t.name} onClick={() => setSelectedTable(t.name)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${selectedTable === t.name ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                <Table size={13} />
                                <span className="truncate">{t.name}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Table detail */}
            <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden flex flex-col">
                {!activeTable ? (
                    <div className="flex-1 flex items-center justify-center text-zinc-500">
                        <div className="text-center">
                            <Table size={32} className="mx-auto mb-3 text-zinc-400" />
                            <p>Select a table to inspect</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-base flex items-center gap-2">
                                        <Table size={16} className="text-emerald-500" />
                                        {activeTable.schema || 'public'}.{activeTable.name}
                                    </h3>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-xs text-zinc-500">{activeTable.columns?.length || 0} columns</span>
                                        {activeTable.rowCount !== undefined && <span className="text-xs text-zinc-500">{Number(activeTable.rowCount).toLocaleString()} rows</span>}
                                        {activeTable.sizeBytes !== undefined && <span className="text-xs text-zinc-500">{(activeTable.sizeBytes / 1024).toFixed(1)} KB</span>}
                                        {activeTable.rlsEnabled && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-full">RLS</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="px-4 pt-4 pb-2">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Columns</p>
                            </div>
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {(activeTable.columns || []).map((col: any) => (
                                    <ColumnBadge key={col.name} col={col} />
                                ))}
                                {(!activeTable.columns || activeTable.columns.length === 0) && (
                                    <div className="px-4 py-8 text-xs text-zinc-500 text-center">No column data available.</div>
                                )}
                            </div>

                            {activeTable.indexes && activeTable.indexes.length > 0 && (
                                <div className="px-4 py-4">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Indexes</p>
                                    <div className="space-y-2">
                                        {activeTable.indexes.map((idx: any) => (
                                            <div key={idx.name} className="flex items-center gap-3 text-xs">
                                                <Hash size={12} className="text-zinc-400 shrink-0" />
                                                <span className="font-medium text-zinc-700 dark:text-zinc-300">{idx.name}</span>
                                                <code className="text-zinc-500 font-mono">{idx.columns?.join(', ')}</code>
                                                {idx.unique && <span className="text-[10px] font-bold text-purple-500 uppercase">unique</span>}
                                                {idx.method && <span className="text-[10px] text-zinc-400 uppercase">{idx.method}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
