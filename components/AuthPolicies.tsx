'use client';

import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, Lock, Unlock, Plus, Database,
    ChevronRight, Eye, ShieldAlert, Loader2,
    Trash2, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';
import {
    listRLSStatus, listPolicies, enableRLS,
    deletePolicy, createPolicy, RLSPolicy,
    TableRLSStatus, getSchemaTables
} from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface AuthPoliciesProps {
    projectId: string;
}

export default function AuthPolicies({ projectId }: AuthPoliciesProps) {
    const [tables, setTables] = useState<TableRLSStatus[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [policies, setPolicies] = useState<RLSPolicy[]>([]);
    const [loading, setLoading] = useState(true);
    const [policiesLoading, setPoliciesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPolicy, setNewPolicy] = useState<RLSPolicy>({
        name: '',
        schema: 'public',
        table: '',
        command: 'SELECT',
        roles: 'authenticated',
        using: 'auth.uid() = id',
        permissive: true
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadRLSStatus();
    }, [projectId]);

    useEffect(() => {
        if (selectedTable) {
            loadPolicies(selectedTable);
        }
    }, [selectedTable]);

    const loadRLSStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await listRLSStatus(projectId);
            setTables(data);
            if (data.length > 0 && !selectedTable) {
                setSelectedTable(data[0].table);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch RLS status');
        } finally {
            setLoading(false);
        }
    };

    const loadPolicies = async (table: string) => {
        try {
            setPoliciesLoading(true);
            const data = await listPolicies(projectId, 'public', table);
            setPolicies(data);
        } catch (err: any) {
            toast.error('Failed to load policies: ' + err.message);
        } finally {
            setPoliciesLoading(false);
        }
    };

    const handleToggleRLS = async (table: string, currentStatus: boolean) => {
        try {
            await enableRLS(projectId, { schema: 'public', table, enable: !currentStatus });
            toast.success(`RLS ${!currentStatus ? 'enabled' : 'disabled'} for ${table}`);
            loadRLSStatus();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDeletePolicy = async (policy: RLSPolicy) => {
        if (!confirm(`Delete policy "${policy.name}"?`)) return;
        try {
            await deletePolicy(projectId, { name: policy.name, schema: policy.schema, table: policy.table });
            toast.success('Policy deleted');
            if (selectedTable) loadPolicies(selectedTable);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreating(true);
            await createPolicy(projectId, { ...newPolicy, table: selectedTable || '' });
            toast.success('Policy created successfully');
            setShowCreateModal(false);
            if (selectedTable) loadPolicies(selectedTable);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h2 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500" size={32} />
                        Auth Policies (RLS)
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
                        Define fine-grained access control rules for your database tables. Row Level Security ensure that users can only access data they are permitted to see.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    disabled={!selectedTable}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-[10px] font-black rounded-xl transition-all shadow-lg uppercase tracking-widest flex items-center gap-2"
                >
                    <Plus size={16} /> New Policy
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
            ) : error ? (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500">
                    <AlertCircle />
                    <p className="font-medium text-sm">{error}</p>
                    <button onClick={loadRLSStatus} className="ml-auto text-xs font-black uppercase tracking-widest border-b border-red-500/40">Retry</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar: Table Selection */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Tables</h3>
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                            {tables.map(table => (
                                <button
                                    key={table.table}
                                    onClick={() => setSelectedTable(table.table)}
                                    className={`w-full p-4 flex items-center justify-between group transition-all ${selectedTable === table.table ? 'bg-emerald-500/10' : 'hover:bg-white/[0.02]'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Database size={14} className={selectedTable === table.table ? 'text-emerald-500' : 'text-zinc-500'} />
                                        <span className={`text-sm font-bold truncate ${selectedTable === table.table ? 'text-white' : 'text-zinc-400'}`}>
                                            {table.table}
                                        </span>
                                    </div>
                                    {table.rlsEnabled ?
                                        <ShieldCheck size={14} className="text-emerald-500" /> :
                                        <AlertCircle size={14} className="text-zinc-700" />
                                    }
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content: Table Status & Policies */}
                    <div className="lg:col-span-3 space-y-6">
                        {selectedTable ? (
                            <>
                                {/* Table Status Header */}
                                <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${tables.find(t => t.table === selectedTable)?.rlsEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {tables.find(t => t.table === selectedTable)?.rlsEnabled ? <Lock size={20} /> : <Unlock size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black uppercase tracking-widest text-sm">
                                                RLS Status: {tables.find(t => t.table === selectedTable)?.rlsEnabled ? 'ENABLED' : 'DISABLED'}
                                            </h4>
                                            <p className="text-zinc-500 text-[10px] font-medium mt-0.5">
                                                {tables.find(t => t.table === selectedTable)?.rlsEnabled
                                                    ? 'This table is protected. Access is restricted by policies.'
                                                    : 'CAUTION: This table is currently public to anyone with an API key.'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleRLS(selectedTable, !!tables.find(t => t.table === selectedTable)?.rlsEnabled)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tables.find(t => t.table === selectedTable)?.rlsEnabled ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                                    >
                                        {tables.find(t => t.table === selectedTable)?.rlsEnabled ? 'Disable RLS' : 'Enable RLS'}
                                    </button>
                                </div>

                                {/* Policies List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Active Policies ({policies.length})</h3>
                                        <button onClick={() => loadPolicies(selectedTable)} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
                                            <RefreshCw size={14} className={`text-zinc-600 ${policiesLoading ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>

                                    {policiesLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-white/5">
                                            <Loader2 className="animate-spin text-zinc-700 mb-2" size={24} />
                                            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Loading Policies...</span>
                                        </div>
                                    ) : policies.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-white/5">
                                            <ShieldAlert className="text-zinc-800 mb-4" size={48} />
                                            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-1">No Policies Found</p>
                                            <p className="text-zinc-700 text-[10px]">Create your first policy to restrict access to this table.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {policies.map(policy => (
                                                <div key={policy.name} className="p-5 rounded-2xl border border-white/5 bg-zinc-950 hover:border-emerald-500/30 transition-all group">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-1">
                                                                <Lock size={16} className="text-emerald-500" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${policy.command === 'SELECT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : policy.command === 'DELETE' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                                        {policy.command}
                                                                    </span>
                                                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">TO {policy.roles}</span>
                                                                </div>
                                                                <h5 className="text-white font-bold text-sm mb-3 font-mono leading-tight">{policy.name}</h5>
                                                                <div className="space-y-2">
                                                                    {policy.using && (
                                                                        <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                                                                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">USING Clause</p>
                                                                            <code className="text-[10px] text-emerald-400 font-mono italic">({policy.using})</code>
                                                                        </div>
                                                                    )}
                                                                    {policy.withCheck && (
                                                                        <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                                                                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">WITH CHECK Clause</p>
                                                                            <code className="text-[10px] text-emerald-400 font-mono italic">({policy.withCheck})</code>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeletePolicy(policy)}
                                                            className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-40 border border-dashed border-white/5 rounded-3xl">
                                <Database size={64} className="text-zinc-800 mb-6" />
                                <h3 className="text-zinc-600 font-black uppercase tracking-widest text-sm mb-2">Select a table</h3>
                                <p className="text-zinc-700 text-xs">Choose a table from the sidebar to manage its security policies.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Policy Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create RLS Policy"
            >
                <form onSubmit={handleCreatePolicy} className="space-y-4 py-4">
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Policy Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. users_can_view_own_data"
                            className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-sm font-mono focus:border-emerald-500 outline-none transition-all text-white"
                            value={newPolicy.name}
                            onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Command</label>
                            <select
                                className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-sm focus:border-emerald-500 outline-none transition-all text-white"
                                value={newPolicy.command}
                                onChange={e => setNewPolicy({ ...newPolicy, command: e.target.value as any })}
                            >
                                <option value="SELECT">SELECT</option>
                                <option value="INSERT">INSERT</option>
                                <option value="UPDATE">UPDATE</option>
                                <option value="DELETE">DELETE</option>
                                <option value="ALL">ALL</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Role</label>
                            <select
                                className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-sm focus:border-emerald-500 outline-none transition-all text-white"
                                value={newPolicy.roles}
                                onChange={e => setNewPolicy({ ...newPolicy, roles: e.target.value })}
                            >
                                <option value="authenticated">Authenticated</option>
                                <option value="anon">Anonymous</option>
                                <option value="public">Public (Everyone)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">USING Clause (Condition)</label>
                            <span className="text-[8px] text-zinc-600 font-mono">Returns Boolean</span>
                        </div>
                        <textarea
                            rows={2}
                            placeholder="e.g. auth.uid() = user_id"
                            className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-sm font-mono focus:border-emerald-500 outline-none transition-all text-emerald-400"
                            value={newPolicy.using}
                            onChange={e => setNewPolicy({ ...newPolicy, using: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="px-6 py-2.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creating || !newPolicy.name}
                            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[10px] font-black rounded-xl uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-500/10"
                        >
                            {creating && <Loader2 size={14} className="animate-spin" />}
                            Create Policy
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
