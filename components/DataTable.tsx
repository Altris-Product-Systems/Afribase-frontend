'use client';

import React, { useState, useEffect } from 'react';
import { runProjectQuery, QueryResult } from '@/lib/api';
import { RefreshCw, Play, Search, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, Filter, AlertTriangle, XCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { useConfirm } from '@/lib/hooks/useConfirm';

interface DataTableProps {
    projectId: string;
    schema: string;
    tableName: string;
}

export default function DataTable({ projectId, schema, tableName }: DataTableProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(100);
    const [totalRows, setTotalRows] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Insert Modal State
    const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
    const [isInserting, setIsInserting] = useState(false);
    const [newRowData, setNewRowData] = useState<Record<string, string>>({});
    const [columnSearch, setColumnSearch] = useState('');

    const fullTableName = `"${schema}"."${tableName}"`;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadData();
    }, [projectId, schema, tableName, page, debouncedSearch]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Ensure we have columns even if table is empty
            if (columns.length === 0) {
                const colResult = await runProjectQuery(projectId, `SELECT * FROM ${fullTableName} LIMIT 0;`);
                if (colResult.columns) {
                    setColumns(colResult.columns);
                }
            }

            // 2. Build Search Clause
            let whereClause = "";
            if (debouncedSearch && columns.length > 0) {
                const searchConditions = columns.map(col => `CAST("${col}" AS text) ILIKE '%${debouncedSearch.replace(/'/g, "''")}%'`);
                whereClause = `WHERE ${searchConditions.join(' OR ')}`;
            }

            // 3. Get data
            const query = `SELECT * FROM ${fullTableName} ${whereClause} LIMIT ${limit} OFFSET ${page * limit};`;
            const result = await runProjectQuery(projectId, query);

            if (result.rows) {
                setData(result.rows);
                if (result.columns && result.columns.length > 0) {
                    setColumns(result.columns);
                } else if (result.rows.length > 0) {
                    setColumns(Object.keys(result.rows[0]));
                }
            } else {
                setData([]);
            }

            // 4. Get count
            const countResult = await runProjectQuery(projectId, `SELECT COUNT(*) as count FROM ${fullTableName} ${whereClause};`);
            if (countResult.rows && countResult.rows[0]) {
                setTotalRows(Number(countResult.rows[0].count));
            }
        } catch (err: any) {
            console.error('Failed to load table data:', err);
            setError(err.message || 'Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInsert = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInserting(true);

        try {
            const fields = Object.keys(newRowData).filter(key => newRowData[key].trim() !== '');
            if (fields.length === 0) {
                toast.error("Please enter data for at least one field");
                setIsInserting(false);
                return;
            }

            const columnsStr = fields.map(f => `"${f}"`).join(', ');
            const valuesStr = fields.map(f => {
                const val = newRowData[f];
                // Very basic sanitization for the proof of concept
                // Note: Real production apps should use parameter binding if possible, 
                // but since we are running raw SQL via our API, we escape single quotes.
                return `'${val.replace(/'/g, "''")}'`;
            }).join(', ');

            const insertQuery = `INSERT INTO ${fullTableName} (${columnsStr}) VALUES (${valuesStr});`;
            await runProjectQuery(projectId, insertQuery);

            toast.success('Row inserted successfully');
            setIsInsertModalOpen(false);
            setNewRowData({});
            loadData();
        } catch (err: any) {
            toast.error(err.message || 'Failed to insert row');
        } finally {
            setIsInserting(false);
        }
    };

    const openInsertModal = () => {
        // Initialize fields
        const initialData: Record<string, string> = {};
        columns.forEach(col => {
            // Skip common auto-generated fields for insertion by default if preferred, 
            // but for transparency we let them try everything.
            initialData[col] = '';
        });
        setNewRowData(initialData);
        setIsInsertModalOpen(true);
    };

    const handleDeleteRow = async (rowIndex: number) => {
        const row = data[rowIndex];
        // This is a bit tricky without knowing the primary key. 
        // For a generic editor, we'd need to identify PKs.
        // For now, let's assume 'id' exists or just warn.
        if (!row.id && !row.ID && !row.uuid) {
            toast.error("Cannot delete: No primary key (id) found in row");
            return;
        }

        const pkField = row.id ? 'id' : row.ID ? 'ID' : 'uuid';
        const pkValue = row[pkField];

        const ok = await confirm({
            title: 'Delete Row',
            message: `Are you sure you want to delete row where ${pkField}=${pkValue}?`,
            variant: 'danger',
            confirmText: 'Delete Row'
        });
        if (!ok) return;

        try {
            const deleteQuery = `DELETE FROM ${fullTableName} WHERE "${pkField}" = '${pkValue}';`;
            await runProjectQuery(projectId, deleteQuery);
            toast.success('Row deleted');
            loadData();
        } catch (err: any) {
            toast.error(err.message || 'Delete failed');
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-zinc-400 group focus-within:border-emerald-500/30 transition-all">
                        <Search size={14} className={searchTerm ? 'text-emerald-500' : ''} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search rows..."
                            className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest focus:outline-none w-32 placeholder:text-zinc-700"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="p-0.5 hover:text-white transition-colors">
                                <XCircle size={12} />
                            </button>
                        )}
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                        <Filter size={12} /> Filter
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={loadData}
                        className="p-2 text-zinc-500 hover:text-white transition-all"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={openInsertModal}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black rounded-lg uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={14} strokeWidth={3} /> Insert Row
                    </button>
                </div>
            </div>

            {/* Insert Modal */}
            <Modal
                isOpen={isInsertModalOpen}
                onClose={() => setIsInsertModalOpen(false)}
                title={`Insert into ${tableName}`}
                footer={
                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={() => setIsInsertModalOpen(false)}
                            className="flex-1 px-4 py-2.5 bg-zinc-900 text-zinc-400 text-[10px] font-black rounded-xl border border-white/5 uppercase tracking-widest hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInsert}
                            disabled={isInserting}
                            className="flex-1 px-4 py-2.5 bg-emerald-500 text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isInserting ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Row
                        </button>
                    </div>
                }
            >
                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-600">
                            <Search size={14} />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter columns..."
                            value={columnSearch}
                            onChange={(e) => setColumnSearch(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 transition-all"
                        />
                    </div>
                </div>
                <form onSubmit={handleInsert} className="space-y-5 py-2 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
                    {columns
                        .filter(col => col.toLowerCase().includes(columnSearch.toLowerCase()))
                        .map(col => (
                            <div key={col} className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
                                    {col}
                                </label>
                                <input
                                    type="text"
                                    value={newRowData[col] || ''}
                                    onChange={(e) => setNewRowData({ ...newRowData, [col]: e.target.value })}
                                    placeholder={`Enter ${col}...`}
                                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                        ))}
                    {columns.length === 0 && (
                        <p className="text-zinc-500 text-xs italic">No columns detected to show in form.</p>
                    )}
                </form>
            </Modal>

            {/* Table Area */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                {error ? (
                    <div className="p-20 text-center flex flex-col items-center gap-4 text-red-400">
                        <AlertTriangle size={40} className="opacity-50" />
                        <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
                            {error}
                        </p>
                        <button onClick={loadData} className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black text-white">RETRY</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/5">
                                    <th className="px-4 py-4 w-10"></th>
                                    {columns.map(col => (
                                        <th key={col} className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap min-w-[120px] border-r border-white/5">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-4"><div className="w-4 h-4 bg-white/5 rounded" /></td>
                                            {columns.map(c => (
                                                <td key={c} className="px-6 py-4"><div className="h-4 w-20 bg-white/5 rounded" /></td>
                                            ))}
                                        </tr>
                                    ))
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="py-20 text-center text-zinc-600">
                                            <RefreshCw size={32} className="mx-auto mb-4 opacity-10" />
                                            <p className="text-sm font-bold uppercase tracking-widest">No data available in this table</p>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleDeleteRow(i)} className="p-1.5 text-zinc-600 hover:text-red-400 rounded-md hover:bg-red-500/10">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                            {columns.map(col => (
                                                <td key={col} className="px-6 py-4 font-mono text-xs text-zinc-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] border-r border-white/5">
                                                    {row[col] == null ? (
                                                        <span className="text-zinc-700 italic">null</span>
                                                    ) : typeof row[col] === 'boolean' ? (
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${row[col] ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{row[col].toString().toUpperCase()}</span>
                                                    ) : (
                                                        String(row[col])
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {totalRows != null ? `Total Rows: ${totalRows.toLocaleString()}` : 'Counting rows...'}
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-black text-white focus:outline-none"
                        >
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                            <option value={500}>500 per page</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="text-[10px] font-black text-white bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 min-w-[3rem] text-center">
                                PAGE {page + 1}
                            </div>
                            <button
                                disabled={totalRows != null && (page + 1) * limit >= totalRows}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}
