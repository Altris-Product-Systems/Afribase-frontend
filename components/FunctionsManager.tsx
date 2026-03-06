import React, { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Code, Loader2, Play, Terminal, Power } from 'lucide-react';
import {
    EdgeFunction,
    Deployment,
    getEdgeFunctions,
    createEdgeFunction,
    deleteEdgeFunction,
    getFunctionDeployments
} from '@/lib/api';
import { useConfirm } from '@/lib/hooks/useConfirm';
import toast from 'react-hot-toast';

interface FunctionsManagerProps {
    projectId: string;
}

export default function FunctionsManager({ projectId }: FunctionsManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [functions, setFunctions] = useState<EdgeFunction[]>([]);
    const [selectedFunc, setSelectedFunc] = useState<EdgeFunction | null>(null);
    const [deployments, setDeployments] = useState<Deployment[]>([]);

    const [loading, setLoading] = useState(true);
    const [deploymentsLoading, setDeploymentsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newFuncName, setNewFuncName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => { loadFunctions(); }, [projectId]);

    useEffect(() => {
        if (selectedFunc) { loadDeployments(selectedFunc.id); }
        else { setDeployments([]); }
    }, [selectedFunc]);

    const loadFunctions = async () => {
        try {
            setLoading(true); setError(null);
            const data = await getEdgeFunctions(projectId);
            setFunctions(data || []);
            if (data && data.length > 0 && !selectedFunc) setSelectedFunc(data[0]);
        } catch (err: any) {
            setError(err.message || 'Failed to load edge functions');
        } finally { setLoading(false); }
    };

    const loadDeployments = async (functionId: string) => {
        try {
            setDeploymentsLoading(true);
            const data = await getFunctionDeployments(projectId, functionId);
            setDeployments(data || []);
        } catch (err: any) {
            console.error('Failed to load deployments:', err);
        } finally { setDeploymentsLoading(false); }
    };

    const handleCreateFunction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFuncName.trim()) return;
        try {
            setCreating(true);
            const newFunc = await createEdgeFunction(projectId, newFuncName.trim());
            setFunctions([...functions, newFunc]);
            setNewFuncName(''); setSelectedFunc(newFunc);
        } catch (err: any) {
            setError(err.message || 'Failed to create function');
        } finally { setCreating(false); }
    };

    const handleDeleteFunction = async (functionId: string) => {
        const ok = await confirm({
            title: 'Delete Edge Function',
            message: 'Delete this edge function? This cannot be recovered.',
            variant: 'danger',
            confirmText: 'Delete Function'
        });
        if (!ok) return;
        try {
            setError(null);
            await deleteEdgeFunction(projectId, functionId);
            setFunctions(functions.filter(f => f.id !== functionId));
            if (selectedFunc?.id === functionId) setSelectedFunc(null);
        } catch (err: any) {
            setError(err.message || 'Failed to delete function.');
        }
    };

    const getStatusColor = (status: string) => {
        if (status === 'active' || status === 'deployed') return 'text-emerald-500 bg-emerald-500/10';
        if (status === 'failed') return 'text-red-500 bg-red-500/10';
        return 'text-zinc-400 bg-zinc-400/10';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Zap className="text-cyan-500" />
                        Edge Functions
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">Deploy server-side code that works globally at the edge.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="col-span-1 border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Code size={16} /> Functions
                        </h3>
                        <button onClick={() => setNewFuncName('my-function')} className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-100 transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleCreateFunction} className="p-3 bg-zinc-900/30 border-b border-zinc-800 space-y-2">
                        <input
                            type="text" placeholder="Function name (e.g., webhook)"
                            value={newFuncName} onChange={(e) => setNewFuncName(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm rounded focus:outline-none focus:border-cyan-500 text-zinc-100"
                        />
                        <div className="flex items-center justify-end">
                            <button type="submit" disabled={creating || !newFuncName.trim()}
                                className="px-3 py-1 bg-zinc-800 text-zinc-100 text-xs font-semibold rounded disabled:opacity-50">
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>

                    <div className="flex-1 overflow-y-auto">
                        {functions.length === 0 ? (
                            <div className="p-8 text-center text-sm text-zinc-500">No functions found</div>
                        ) : (
                            <ul className="divide-y divide-zinc-800 h-full">
                                {functions.map((func) => {
                                    const isSelected = selectedFunc?.id === func.id;
                                    const itemClass = isSelected
                                        ? 'w-full text-left px-4 py-3 bg-zinc-900/80 border-l-2 border-cyan-500 flex justify-between items-center cursor-pointer transition-colors'
                                        : 'w-full text-left px-4 py-3 hover:bg-zinc-900 flex justify-between items-center cursor-pointer transition-colors';
                                    return (
                                        <li key={func.id}>
                                            <div onClick={() => setSelectedFunc(func)} className={itemClass}>
                                                <div className="flex items-center gap-2 truncate">
                                                    <Power size={14} className={func.status === 'active' ? 'text-emerald-500' : 'text-zinc-500'} />
                                                    <span className="text-sm font-medium truncate">{func.name}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteFunction(func.id); }}
                                                    className="text-zinc-400 hover:text-red-500 hover:opacity-100 transition-opacity">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Detail */}
                <div className="col-span-1 md:col-span-3 border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col min-h-[500px]">
                    {selectedFunc ? (
                        <>
                            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <Terminal size={16} className="text-cyan-500" />
                                        {selectedFunc.name}
                                    </h3>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${getStatusColor(selectedFunc.status)}`}>
                                        {selectedFunc.status || 'Active'}
                                    </span>
                                    <span className="text-xs text-zinc-500">v{selectedFunc.version || 1}</span>
                                </div>
                                <button className="text-xs font-semibold px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded transition-colors flex items-center gap-2">
                                    <Play size={14} /> Deploy CLI
                                </button>
                            </div>

                            <div className="p-6 border-b border-zinc-800">
                                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Endpoints</h4>
                                <div>
                                    <span className="text-xs text-zinc-500 block mb-1">Public URL</span>
                                    <code className="text-xs p-2.5 rounded bg-zinc-900 border border-zinc-800 block text-emerald-500 break-all">
                                        https://{typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/functions/v1/{projectId}/{selectedFunc.slug}
                                    </code>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                                    <h4 className="text-sm font-semibold">Deployments</h4>
                                </div>
                                {deploymentsLoading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                                    </div>
                                ) : deployments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-zinc-500 p-8 text-center space-y-4">
                                        <p className="text-sm">No deployments found.</p>
                                        <p className="text-xs text-zinc-400">Deploy via CLI: <code className="text-white">afribase functions deploy {selectedFunc.name}</code></p>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Version</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                                <th className="px-6 py-3 font-medium">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {deployments.map((dep, idx) => (
                                                <tr key={dep.id || idx} className="hover:bg-zinc-900/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">v{dep.version}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(dep.status)}`}>
                                                            {dep.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-500">
                                                        {dep.createdAt ? new Date(dep.createdAt).toLocaleString() : 'Unknown'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                            <Code size={32} className="mb-4 text-zinc-400" />
                            <p className="text-sm">Select a function to view details</p>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}
