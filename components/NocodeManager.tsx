'use client';

import React, { useState, useEffect } from 'react';
import { useConfirm } from '@/lib/hooks/useConfirm';
import {
    Plus,
    Key,
    Trash2,
    Shield,
    ExternalLink,
    Copy,
    Check,
    Code,
    Settings,
    Monitor,
    Zap,
    Globe,
    Palette,
    Eye,
    Share2,
    RefreshCw,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    getAPIKeys,
    createAPIKey,
    deleteAPIKey,
    revokeAPIKey,
    getEmbedConfig,
    updateEmbedConfig,
    getEmbedScript,
    APIKey,
    EmbedConfig
} from '@/lib/api';
import toast from 'react-hot-toast';

interface NocodeManagerProps {
    projectId: string;
    projectSlug?: string;
}

export default function NocodeManager({ projectId, projectSlug }: NocodeManagerProps) {
    const [activeTab, setActiveTab] = useState<'keys' | 'embed' | 'docs'>('keys');
    const { confirm, ConfirmDialog } = useConfirm();
    const [loading, setLoading] = useState(true);
    const [keys, setKeys] = useState<APIKey[]>([]);
    const [embedConfig, setEmbedConfig] = useState<EmbedConfig | null>(null);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [newKey, setNewKey] = useState<string | null>(null);

    // New Key Form
    const [keyName, setKeyName] = useState('');
    const [keyScope, setKeyScope] = useState<'read' | 'read_write'>('read_write');
    const [allowedTables, setAllowedTables] = useState('');
    const [creating, setCreating] = useState(false);

    // Embed Config Form
    const [isUpdatingEmbed, setIsUpdatingEmbed] = useState(false);
    const [fetchingScript, setFetchingScript] = useState(false);
    const [embedScript, setEmbedScript] = useState<string>('');
    const [localBrandColor, setLocalBrandColor] = useState('#10b981');

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [keysData, configData] = await Promise.all([
                getAPIKeys(projectId),
                getEmbedConfig(projectId)
            ]);
            setKeys(keysData);
            setEmbedConfig(configData);
            if (configData) {
                setLocalBrandColor(configData.brandColor);
            }
        } catch (err) {
            console.error('Failed to load nocode data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        setCreating(true);
        try {
            const resp = await createAPIKey(projectId, {
                name: keyName,
                scope: keyScope,
                allowedTables: allowedTables
            });
            setNewKey(resp.key);
            setShowKeyModal(false);
            loadData();
        } catch (err) {
            toast.error('Failed to create API key');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async (id: string) => {
        const ok = await confirm({
            title: 'Delete API Key',
            message: 'Are you sure you want to delete this API key? This action cannot be undone.',
            variant: 'danger',
            confirmText: 'Delete Key'
        });
        if (!ok) return;

        try {
            await deleteAPIKey(projectId, id);
            toast.success('API key deleted');
            loadData();
        } catch (err) {
            toast.error('Failed to delete key');
        }
    };

    const handleUpdateEmbed = async (updates: any) => {
        setIsUpdatingEmbed(true);
        try {
            const updated = await updateEmbedConfig(projectId, updates);
            setEmbedConfig(updated);
            if (updates.brandColor) {
                setLocalBrandColor(updates.brandColor);
            }
        } catch (err) {
            toast.error('Failed to update embed settings');
        } finally {
            setIsUpdatingEmbed(false);
        }
    };

    const handleGetScript = async () => {
        setFetchingScript(true);
        try {
            const resp = await getEmbedScript(projectId);
            setEmbedScript(resp.script);
            if (!resp.script) {
                toast.error('Success, but no script snippet was found. Please check your config.');
            }
        } catch (err: any) {
            console.error('Script fetch error:', err);
            toast.error(`Failed to fetch embed script: ${err.message || 'Unknown error'}`);
        } finally {
            setFetchingScript(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex p-1 bg-white/[0.03] rounded-xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('keys')}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'keys' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                        API Keys
                    </button>
                    <button
                        onClick={() => setActiveTab('embed')}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'embed' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Auth Widget
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'docs' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                        API Docs
                    </button>
                </div>
                <div className="hidden lg:block">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Integrating with External Tools</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Bridging with External Tools...</p>
                </div>
            ) : (
                <>
                    {activeTab === 'keys' && (
                        <div className="space-y-6 animate-fade-in text-zinc-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">Project API Keys</h3>
                                    <p className="text-xs text-zinc-500">Keys for use in external no-code platforms.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setNewKey(null);
                                        setShowKeyModal(true);
                                    }}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <Plus size={14} strokeWidth={3} /> Create Key
                                </button>
                            </div>

                            {newKey && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden animate-gelatinous-in">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-500 rounded-lg">
                                            <Shield size={20} className="text-black" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">New API Key Created</h4>
                                            <p className="text-xs text-emerald-400">Copy this key now. You won't be able to see it again.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
                                        <code className="text-emerald-400 text-sm font-mono flex-1 truncate">{newKey}</code>
                                        <button
                                            onClick={() => copyToClipboard(newKey, 'new')}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                                        >
                                            {copiedId === 'new' ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setNewKey(null)}
                                        className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {keys.length === 0 ? (
                                    <div className="py-20 border border-zinc-800/50 border-dashed rounded-3xl bg-zinc-900/20 flex flex-col items-center justify-center text-center">
                                        <Key className="text-zinc-700 mb-4" size={40} />
                                        <h3 className="text-sm font-bold text-zinc-400">No No-Code Keys Yet</h3>
                                        <p className="text-xs text-zinc-600 mt-1 max-w-xs">Create a key to start connecting your project to WordPress or Zapier.</p>
                                    </div>
                                ) : (
                                    keys.map(key => (
                                        <div key={key.id} className="glass-card rounded-2xl p-5 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${key.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>
                                                    <Key size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white flex items-center gap-2">
                                                        {key.name}
                                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${key.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                                            {key.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">{key.keyPrefix}••••••••</p>
                                                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{key.scope}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="text-right mr-4 hidden md:block">
                                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Requests</p>
                                                    <p className="text-xs font-bold text-white">{key.requestCount}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteKey(key.id)}
                                                    className="p-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'embed' && embedConfig && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-zinc-100">
                            <div className="space-y-10">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                        <Monitor className="text-emerald-500" size={24} />
                                        Auth Customization
                                    </h3>
                                    <p className="text-zinc-500 text-sm font-medium">Style your white-label authentication widget to match your brand identity perfectly.</p>
                                </div>

                                <div className="glass-card rounded-[32px] p-8 space-y-10 border border-white/5 relative overflow-hidden">
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full" />

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Palette size={14} className="text-zinc-500" />
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Brand Color</label>
                                            </div>
                                            <div className="flex items-center gap-4 bg-zinc-950/50 p-2 rounded-2xl border border-white/5">
                                                <input
                                                    type="color"
                                                    value={localBrandColor}
                                                    onChange={(e) => setLocalBrandColor(e.target.value)}
                                                    onBlur={(e) => handleUpdateEmbed({ brandColor: e.target.value })}
                                                    className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer outline-none"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-white">{localBrandColor.toUpperCase()}</span>
                                                    <span className="text-[8px] font-bold text-zinc-600 uppercase">Primary Hue</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Eye size={14} className="text-zinc-500" />
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visual Theme</label>
                                            </div>
                                            <div className="relative group">
                                                <select
                                                    value={embedConfig.theme}
                                                    onChange={(e) => handleUpdateEmbed({ theme: e.target.value })}
                                                    className="w-full bg-zinc-950/50 border border-white/5 px-4 py-4 rounded-2xl text-sm text-zinc-300 focus:outline-none appearance-none font-bold"
                                                >
                                                    <option value="dark">Deep Night</option>
                                                    <option value="light">Crisp White</option>
                                                    <option value="auto">System Sync</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 transition-colors" style={{ color: embedConfig.theme === 'dark' ? '#555' : '#ccc' }}>
                                                    <Settings size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-zinc-500" />
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">CORS Safety Whitelist</label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={embedConfig.allowedOrigins}
                                                onChange={(e) => setEmbedConfig({ ...embedConfig, allowedOrigins: e.target.value })}
                                                onBlur={() => handleUpdateEmbed({ allowedOrigins: embedConfig.allowedOrigins })}
                                                placeholder="https://example.com, https://app.acme.co"
                                                className="w-full bg-zinc-950/50 border border-white/5 px-5 py-4 rounded-2xl text-sm text-zinc-100 focus:outline-none placeholder:text-zinc-800 transition-all"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <Shield size={16} className="text-zinc-800" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleUpdateEmbed({ enableSignUp: !embedConfig.enableSignUp })}
                                            className={`p-5 rounded-[24px] border-2 transition-all relative overflow-hidden group/btn ${embedConfig.enableSignUp ? 'bg-zinc-950/20 border-white/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'bg-zinc-950/20 border-white/5 hover:border-zinc-800'}`}
                                            style={{ borderColor: embedConfig.enableSignUp ? localBrandColor : 'transparent' }}
                                        >
                                            <div className="flex flex-col gap-1 relative z-10">
                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">User Registration</span>
                                                <span className={`text-sm font-black transition-colors`} style={{ color: embedConfig.enableSignUp ? localBrandColor : '#52525b' }}>
                                                    {embedConfig.enableSignUp ? 'ACTIVE' : 'DISABLED'}
                                                </span>
                                            </div>
                                            {embedConfig.enableSignUp && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: localBrandColor }} />}
                                        </button>

                                        <button
                                            onClick={() => handleUpdateEmbed({ enableOAuth: !embedConfig.enableOAuth })}
                                            className={`p-5 rounded-[24px] border-2 transition-all relative overflow-hidden group/btn ${embedConfig.enableOAuth ? 'bg-cyan-500/5 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'bg-zinc-950/20 border-white/5 hover:border-zinc-800'}`}
                                        >
                                            <div className="flex flex-col gap-1 relative z-10">
                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">OAuth 2.0 / Social</span>
                                                <span className={`text-sm font-black ${embedConfig.enableOAuth ? 'text-cyan-400' : 'text-zinc-500'}`}>
                                                    {embedConfig.enableOAuth ? 'READY' : 'INACTIVE'}
                                                </span>
                                            </div>
                                            {embedConfig.enableOAuth && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />}
                                        </button>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleGetScript}
                                            disabled={fetchingScript}
                                            className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-emerald-500/10"
                                        >
                                            {fetchingScript ? <Loader2 size={16} className="animate-spin" /> : <Code size={16} strokeWidth={3} />}
                                            {fetchingScript ? 'PROTOCOL SYNC...' : embedScript ? 'REFRESH INTEGRATION' : 'DEPLOY DROP-IN SCRIPT'}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5 flex gap-4">
                                    <div className="p-2 bg-zinc-800 h-fit rounded-lg text-zinc-500">
                                        <Share2 size={16} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-bold text-white">White-label Protocol</h4>
                                        <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                            The widget runs in an isolated iframe, ensuring your site's JavaScript never touches sensitive credentials.
                                            Session state is synchronized via cross-origin postMessage.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                                    <div className="relative glass-card rounded-[40px] p-10 border border-white/10 overflow-hidden bg-black/40">
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="space-y-1">
                                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Real-time Preview</h3>
                                                <p className="text-[10px] text-zinc-600 font-medium italic">Simulated frontend injection</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-zinc-900/80 px-4 py-2 rounded-full border border-white/5">
                                                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: localBrandColor, boxShadow: `0 0 8px ${localBrandColor}` }} />
                                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: localBrandColor }}>Streaming Stats</span>
                                            </div>
                                        </div>

                                        <div
                                            className={`p-10 rounded-3xl flex flex-col items-center gap-8 border transition-all duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden`}
                                            style={{
                                                backgroundColor: embedConfig.theme === 'dark' ? '#09090b' : '#ffffff',
                                                borderColor: embedConfig.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {/* Logo Container */}
                                            <div className="w-20 h-20 rounded-3xl bg-white/5 p-4 flex items-center justify-center relative group/preview">
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-3xl" />
                                                <img
                                                    src="/AFRIBASE1.png"
                                                    alt="Brand Logo"
                                                    className="w-full h-full object-contain relative z-10 transition-all duration-500"
                                                    style={{
                                                        filter: `drop-shadow(0px 0px 10px ${localBrandColor}44) brightness(1.2)`
                                                    }}
                                                />
                                            </div>

                                            <div className="text-center space-y-2">
                                                <h4 className={`text-xl font-black tracking-tight ${embedConfig.theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                                                    Join {projectSlug || 'the project'}
                                                </h4>
                                                <p className={`text-xs font-medium ${embedConfig.theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                    Create your account to get started
                                                </p>
                                            </div>

                                            <div className="w-full space-y-4">
                                                <div className={`h-12 w-full rounded-2xl border transition-colors ${embedConfig.theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`} />
                                                <div className={`h-12 w-full rounded-2xl border transition-colors ${embedConfig.theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`} />

                                                <div className="pt-2">
                                                    <div
                                                        className="w-full h-14 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center"
                                                        style={{
                                                            backgroundColor: localBrandColor,
                                                            boxShadow: `0 10px 30px -10px ${localBrandColor}66`
                                                        }}
                                                    >
                                                        <div className="w-24 h-2 bg-white/20 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>

                                            {embedConfig.enableOAuth && (
                                                <div className="w-full pt-4 flex flex-col items-center gap-4">
                                                    <div className="flex items-center gap-4 w-full">
                                                        <div className="h-px flex-1 bg-zinc-800" />
                                                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">or continue with</span>
                                                        <div className="h-px flex-1 bg-zinc-800" />
                                                    </div>
                                                    <div className="flex gap-4">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center" />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {embedScript && (
                                    <div className="bg-zinc-950/80 rounded-[40px] p-8 border border-white/5 animate-in slide-in-from-right-4 duration-500 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Code size={120} />
                                        </div>

                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                                    <Code size={16} />
                                                </div>
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Deployment Snippet</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(embedScript, 'script')}
                                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-[10px] font-black text-emerald-500 uppercase tracking-widest transition-all active:scale-95 border border-white/5"
                                            >
                                                {copiedId === 'script' ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                                                {copiedId === 'script' ? 'COPIED TO CLIPBOARD' : 'COPY SNIPPET'}
                                            </button>
                                        </div>

                                        <div className="relative z-10">
                                            <pre className="p-6 bg-black/80 rounded-2xl overflow-x-auto text-[11px] text-blue-400 font-mono leading-relaxed border border-white/5 shadow-inner">
                                                {embedScript}
                                            </pre>
                                        </div>

                                        <div className="mt-6 flex gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl relative z-10">
                                            <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic">
                                                Initialize with <code className="text-zinc-300">new AfribaseAuth('#container')</code>. Custom hooks for React & Vue available in the <span className="text-white cursor-pointer hover:underline">documentation</span>.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-zinc-100">
                            <div className="lg:col-span-2 space-y-10">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Zap className="text-amber-500" size={24} />
                                        <h3 className="text-2xl font-black tracking-tight">Simplified REST API</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                        Designed specifically for no-code tools like <span className="text-white">Zapier, Make, and Bubble</span>.
                                        Instead of complex SQL or multi-step headers, use a single JSON endpoint.
                                    </p>
                                </section>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Common Operations</h4>

                                    <div className="space-y-4">
                                        <div className="p-6 glass-card rounded-2xl border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-500/20">POST</span>
                                                <code className="text-[10px] text-zinc-500">/v1/nocode/data</code>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-sm">Select Rows</h5>
                                                <pre className="mt-3 p-4 bg-black/40 rounded-xl text-xs text-zinc-400 font-mono border border-white/5">
                                                    {`{
  "table": "profiles",
  "action": "select",
  "filters": { "id": "123" },
  "limit": 1
}`}
                                                </pre>
                                            </div>
                                        </div>

                                        <div className="p-6 glass-card rounded-2xl border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">POST</span>
                                                <code className="text-[10px] text-zinc-500">/v1/nocode/data</code>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-sm">Insert Data</h5>
                                                <pre className="mt-3 p-4 bg-black/40 rounded-xl text-xs text-zinc-400 font-mono border border-white/5">
                                                    {`{
  "table": "orders",
  "action": "insert",
  "data": { 
    "customer": "John Doe",
    "total": 59.99 
  }
}`}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                                    <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Connectors</h4>
                                    <div className="space-y-3">
                                        <a href="#" className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                                                    <Zap size={16} />
                                                </div>
                                                <span className="text-sm font-bold">Zapier</span>
                                            </div>
                                            <ExternalLink size={14} className="text-zinc-700 group-hover:text-emerald-500" />
                                        </a>
                                        <a href="#" className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs italic">
                                                    m.
                                                </div>
                                                <span className="text-sm font-bold">Make.com</span>
                                            </div>
                                            <ExternalLink size={14} className="text-zinc-700 group-hover:text-emerald-500" />
                                        </a>
                                    </div>
                                </div>

                                <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Help Center</h4>
                                    </div>
                                    <h5 className="font-bold text-white text-sm mb-2">No-Code Guide</h5>
                                    <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-6">
                                        Learn how to build full SaaS applications without writing any backend code using Afribase & Bubble.
                                    </p>
                                    <button className="w-full py-2.5 bg-zinc-900 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-all border border-white/5">
                                        Read Guide
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showKeyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowKeyModal(false)} />
                    <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-8 animate-scale-in">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black">
                                <Plus size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Generate No-Code Key</h3>
                                <p className="text-xs text-zinc-500">Provide access for external integrations.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Key Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. My WordPress Main Blog"
                                    value={keyName}
                                    onChange={(e) => setKeyName(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 px-4 py-3 rounded-2xl text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Permission Scope</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setKeyScope('read')}
                                        className={`p-4 rounded-2xl border text-left transition-all ${keyScope === 'read' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                                    >
                                        <p className={`text-xs font-bold ${keyScope === 'read' ? 'text-emerald-400' : 'text-zinc-500'}`}>Read Only</p>
                                        <p className="text-[10px] text-zinc-600 mt-0.5">Safe for stats display.</p>
                                    </button>
                                    <button
                                        onClick={() => setKeyScope('read_write')}
                                        className={`p-4 rounded-2xl border text-left transition-all ${keyScope === 'read_write' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                                    >
                                        <p className={`text-xs font-bold ${keyScope === 'read_write' ? 'text-emerald-400' : 'text-zinc-500'}`}>Read/Write</p>
                                        <p className="text-[10px] text-zinc-600 mt-0.5">Allows data submission.</p>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Restricted Tables (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. posts, orders (empty = all)"
                                    value={allowedTables}
                                    onChange={(e) => setAllowedTables(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 px-4 py-3 rounded-2xl text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowKeyModal(false)}
                                    className="flex-1 py-3 bg-zinc-900 text-zinc-400 text-xs font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateKey}
                                    disabled={!keyName || creating}
                                    className="flex-1 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {creating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                                    {creating ? 'Generating...' : 'Generate Key'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmDialog />
        </div>
    );
}
