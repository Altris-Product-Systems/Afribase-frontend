'use client';
import React, { useState, useEffect } from 'react';
import {
    Globe,
    Plus,
    Trash2,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    ExternalLink,
    Info,
    Copy,
    ChevronDown,
    ChevronUp,
    Shield
} from 'lucide-react';
import { listCustomDomains, addCustomDomain, verifyCustomDomain, removeCustomDomain } from '@/lib/api';
import toast from 'react-hot-toast';
import { useConfirm } from '@/lib/hooks/useConfirm';

interface DomainsManagerProps { projectId: string; }

export default function DomainsManager({ projectId }: DomainsManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [domains, setDomains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newDomain, setNewDomain] = useState('');
    const [adding, setAdding] = useState(false);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

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
            setExpandedId(d.id);
            toast.success('Domain added successfully');
        } catch (e: any) {
            toast.error(e.message);
        } finally { setAdding(false); }
    };

    const handleVerify = async (id: string) => {
        try {
            setVerifyingId(id);
            const r = await verifyCustomDomain(projectId, id);
            setDomains(prev => prev.map(d => d.id === id ? { ...d, ...r } : d));
            if (r.status === 'active' || r.status === 'verified') {
                toast.success('Domain verified!');
            } else {
                toast.error('Verification failed. DNS records not found yet.');
            }
        } catch (e: any) {
            toast.error(e.message);
        } finally { setVerifyingId(null); }
    };

    const handleRemove = async (id: string) => {
        const ok = await confirm({
            title: 'Remove Domain',
            message: 'Are you sure you want to remove this custom domain?',
            variant: 'danger',
            confirmText: 'Remove Domain'
        });
        if (!ok) return;
        try {
            await removeCustomDomain(projectId, id);
            setDomains(prev => prev.filter(d => d.id !== id));
            toast.success('Domain removed');
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: any = {
            active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            verified: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            failed: 'bg-red-500/10 text-red-500 border-red-500/20',
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
                {status || 'pending'}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Custom Domains</h2>
                    <p className="text-zinc-500 text-sm font-medium mt-1">
                        White-label your project by mapping your own domain to our edge network.
                    </p>
                </div>
            </div>

            {/* Add Record Form */}
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Globe className="text-emerald-500" size={18} />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Connect New Domain</h3>
                </div>
                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={newDomain}
                        onChange={e => setNewDomain(e.target.value)}
                        placeholder="api.example.com"
                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                    />
                    <button
                        type="submit"
                        disabled={adding || !newDomain}
                        className="bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                        Add Domain
                    </button>
                </form>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <Info size={12} />
                    <span>Supports Root Domains & Subdomains</span>
                </div>
            </div>

            {/* Domain List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Checking DNS Propagation...</p>
                    </div>
                ) : domains.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                        <Globe size={48} className="text-zinc-700 mb-4" />
                        <p className="text-zinc-400 font-medium">No custom domains configured yet.</p>
                        <p className="text-zinc-600 text-sm mt-1">Add a domain above to get started.</p>
                    </div>
                ) : (
                    domains.map((d: any) => (
                        <div key={d.id} className={`group border rounded-2xl overflow-hidden transition-all ${expandedId === d.id ? 'border-white/20 bg-white/[0.03]' : 'border-white/5 bg-white/[0.01] hover:border-white/10'}`}>
                            <div
                                className="p-5 flex items-center justify-between cursor-pointer"
                                onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl border ${d.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                                        <Globe size={20} className={d.status === 'active' ? 'text-emerald-500' : 'text-zinc-400'} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-white uppercase tracking-tighter text-lg">{d.domain}</h4>
                                            <StatusBadge status={d.status} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {d.status === 'active' ? 'Fully verified and secured' : 'Waiting for DNS changes'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end mr-4">
                                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">SSL STATUS</p>
                                        <p className={`text-xs font-bold ${d.sslStatus === 'active' ? 'text-emerald-500' : 'text-zinc-400'}`}>
                                            {d.sslStatus === 'active' ? 'Protected by Afribase SSL' : 'Pending Issuance'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRemove(d.id); }}
                                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {expandedId === d.id ? <ChevronUp className="text-zinc-500" /> : <ChevronDown className="text-zinc-500" />}
                                </div>
                            </div>

                            {expandedId === d.id && (
                                <div className="p-6 border-t border-white/5 bg-black/40 space-y-6 animate-in slide-in-from-top-2 duration-200">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Records Column */}
                                        <div className="space-y-4">
                                            <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Required DNS Records</h5>

                                            {/* TXT Record */}
                                            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-2 text-xs font-black text-white">
                                                        <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px]">TXT</span> verification
                                                    </span>
                                                    {d.txtVerified ? (
                                                        <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase"><CheckCircle2 size={10} /> Found</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase"><Clock size={10} /> Missing</span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="col-span-1 space-y-1">
                                                        <p className="text-[9px] text-zinc-600 uppercase font-black">Host</p>
                                                        <div onClick={() => copyToClipboard(`_afribase-verify.${d.domain}`)} className="bg-black/50 p-2 rounded border border-white/5 text-[11px] font-mono text-zinc-300 truncate cursor-pointer hover:border-white/20">
                                                            _afribase-verify
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 space-y-1">
                                                        <p className="text-[9px] text-zinc-600 uppercase font-black">Value</p>
                                                        <div onClick={() => copyToClipboard(d.verificationTxt || d.verificationTXT)} className="bg-black/50 p-2 rounded border border-white/5 text-[11px] font-mono text-zinc-300 truncate cursor-pointer hover:border-white/20">
                                                            {d.verificationTxt || d.verificationTXT}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CNAME Record */}
                                            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-2 text-xs font-black text-white">
                                                        <span className="bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded text-[10px]">CNAME</span> alias
                                                    </span>
                                                    {d.cnameVerified ? (
                                                        <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase"><CheckCircle2 size={10} /> Found</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase"><Clock size={10} /> Missing</span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] text-zinc-600 uppercase font-black">Host</p>
                                                        <div onClick={() => copyToClipboard(d.domain)} className="bg-black/50 p-2 rounded border border-white/5 text-[11px] font-mono text-zinc-300 truncate cursor-pointer hover:border-white/20">
                                                            {d.domain.split('.')[0] === 'api' ? 'api' : '@'}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] text-zinc-600 uppercase font-black">Target</p>
                                                        <div onClick={() => copyToClipboard(d.cnameTarget || 'api.useafribase.app')} className="bg-black/50 p-2 rounded border border-white/5 text-[11px] font-mono text-zinc-300 truncate cursor-pointer hover:border-white/20">
                                                            {d.cnameTarget || 'api.useafribase.app'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Instructions Column */}
                                        <div className="p-6 rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Shield className="text-blue-500" size={18} />
                                                    <h5 className="text-xs font-black text-white uppercase tracking-widest">Verification Status</h5>
                                                </div>
                                                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                                    DNS changes usually propagate within minutes, but can take up to 24-48 hours.
                                                    Your project will be served over HTTPS automatically once the domain is verified.
                                                </p>
                                                {d.lastCheckError && (
                                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                                                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                                            <AlertCircle size={10} /> Last Error
                                                        </p>
                                                        <p className="text-xs text-red-300/80 font-mono leading-tight">{d.lastCheckError}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleVerify(d.id)}
                                                disabled={verifyingId === d.id}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {verifyingId === d.id ? <Loader2 size={12} className="animate-spin" /> : 'Re-verify Records'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                        <Info size={16} className="text-zinc-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Important Instructions</h4>
                        <ul className="text-xs text-zinc-500 space-y-2 list-disc pl-4">
                            <li>Ensure you have added BOTH the TXT and CNAME records at your domain registrar.</li>
                            <li>If you are using Cloudflare, set the Proxy status to "DNS Only" (grey cloud) during verification.</li>
                            <li>Wait for global propagation if the records are not detected immediately.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}
