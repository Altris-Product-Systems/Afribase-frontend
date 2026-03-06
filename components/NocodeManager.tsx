'use client';

import React, { useState, useEffect } from 'react';
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

interface NocodeManagerProps {
    projectId: string;
}

export default function NocodeManager({ projectId }: NocodeManagerProps) {
    const [activeTab, setActiveTab] = useState<'keys' | 'embed' | 'docs'>('keys');
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
            alert('Failed to create API key');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async (id: string) => {
        if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;
        try {
            await deleteAPIKey(projectId, id);
            loadData();
        } catch (err) {
            alert('Failed to delete key');
        }
    };

    const handleUpdateEmbed = async (updates: any) => {
        setIsUpdatingEmbed(true);
        try {
            const updated = await updateEmbedConfig(projectId, updates);
            setEmbedConfig(updated);
        } catch (err) {
            alert('Failed to update embed settings');
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
                alert('Success, but no script snippet was found. Please check your config.');
            }
        } catch (err: any) {
            console.error('Script fetch error:', err);
            alert(`Failed to fetch embed script: ${err.message || 'Unknown error'}`);
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in text-zinc-100">
                            <div className="space-y-8">
                                <div className="glass-card rounded-3xl p-8 space-y-8 border-emerald-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500 rounded-lg">
                                            <Monitor size={20} className="text-black" />
                                        </div>
                                        <h3 className="text-lg font-bold">Authentication Widget</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Primary Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={embedConfig.brandColor}
                                                    onChange={(e) => handleUpdateEmbed({ brandColor: e.target.value })}
                                                    className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 cursor-pointer"
                                                />
                                                <code className="text-xs text-zinc-400 font-mono">{embedConfig.brandColor}</code>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Theme</label>
                                            <select
                                                value={embedConfig.theme}
                                                onChange={(e) => handleUpdateEmbed({ theme: e.target.value })}
                                                className="w-full bg-zinc-900 border border-white/5 px-3 py-2.5 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-emerald-500"
                                            >
                                                <option value="dark">Dark Mode</option>
                                                <option value="light">Light Mode</option>
                                                <option value="auto">System Sync</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Allowed Origins (CORS)</label>
                                        <input
                                            type="text"
                                            value={embedConfig.allowedOrigins}
                                            onChange={(e) => setEmbedConfig({ ...embedConfig, allowedOrigins: e.target.value })}
                                            onBlur={() => handleUpdateEmbed({ allowedOrigins: embedConfig.allowedOrigins })}
                                            placeholder="https://example.com, https://blog.wixsite.com"
                                            className="w-full bg-zinc-900 border border-white/5 px-4 py-3 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                                        />
                                        <p className="text-[10px] text-zinc-600">Comma-separated domains where this widget will appear.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleUpdateEmbed({ enableSignUp: !embedConfig.enableSignUp })}
                                            className={`p-4 rounded-2xl border transition-all text-left ${embedConfig.enableSignUp ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-950/20 border-white/5'}`}
                                        >
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Sign Up</p>
                                            <p className={`text-sm font-bold ${embedConfig.enableSignUp ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                                {embedConfig.enableSignUp ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </button>
                                        <button
                                            onClick={() => handleUpdateEmbed({ enableOAuth: !embedConfig.enableOAuth })}
                                            className={`p-4 rounded-2xl border transition-all text-left ${embedConfig.enableOAuth ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-950/20 border-white/5'}`}
                                        >
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">OAuth/Social</p>
                                            <p className={`text-sm font-bold ${embedConfig.enableOAuth ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                                {embedConfig.enableOAuth ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </button>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleGetScript}
                                            disabled={fetchingScript}
                                            className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {fetchingScript ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                                            {fetchingScript ? 'Generating...' : embedScript ? 'Refresh Script' : 'Get Drop-in Script'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="glass-card rounded-3xl p-8 border-dashed border-zinc-800">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Live Preview</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Disconnected</span>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-10 rounded-2xl flex flex-col items-center gap-6 border border-white/5 shadow-2xl transition-colors`}
                                        style={{ backgroundColor: embedConfig.theme === 'dark' ? '#09090b' : '#f9fafb' }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                            <Settings size={24} className="text-zinc-500" />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold text-zinc-400">Welcome back</h4>
                                            <p className="text-xs text-zinc-600 mt-1">Sign in to your account</p>
                                        </div>
                                        <div className="w-full space-y-3">
                                            <div className="h-10 w-full rounded-lg bg-zinc-900/50 border border-white/5" />
                                            <div className="h-10 w-full rounded-lg bg-zinc-900/50 border border-white/5" />
                                            <button className="w-full h-11 rounded-xl shadow-lg shadow-emerald-500/20" style={{ backgroundColor: embedConfig.brandColor }}>

                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-center text-[10px] text-zinc-600 mt-6 italic">Simulated widget appearance on your site.</p>
                                </div>

                                {embedScript && (
                                    <div className="bg-zinc-950 rounded-3xl p-6 border border-white/5 animate-slide-up">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Embedding Code</p>
                                            <button
                                                onClick={() => copyToClipboard(embedScript, 'script')}
                                                className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-colors"
                                            >
                                                {copiedId === 'script' ? <Check size={12} /> : <Copy size={12} />}
                                                {copiedId === 'script' ? 'Copied' : 'Copy Code'}
                                            </button>
                                        </div>
                                        <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto text-[10px] text-blue-400 font-mono leading-relaxed border border-white/5">
                                            {embedScript}
                                        </pre>
                                        <p className="mt-4 text-[10px] text-zinc-600 leading-relaxed">
                                            Paste this script before the <code className="text-zinc-400">{'</body>'}</code> tag on your WordPress, Wix, or custom site. Call <code className="text-zinc-400">new AfribaseAuth('#container')</code> to initialize.
                                        </p>
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

            {/* Create Key Modal */}
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
        </div>
    );
}
