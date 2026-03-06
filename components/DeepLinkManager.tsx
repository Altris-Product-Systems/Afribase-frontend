'use client';

import React, { useState, useEffect } from 'react';
import {
    Smartphone,
    Apple,
    Chrome as Android,
    Link,
    Save,
    Trash2,
    Loader2,
    Shield,
    Globe,
    ExternalLink,
    Settings,
    Plus,
    X,
    CheckCircle2,
    Info
} from 'lucide-react';
import { getDeepLinkConfig, upsertDeepLinkConfig, deleteDeepLinkConfig, DeepLinkConfig } from '@/lib/api';
import toast from 'react-hot-toast';
import { useConfirm } from '@/lib/hooks/useConfirm';

interface DeepLinkManagerProps {
    projectId: string;
    projectSlug: string;
}

export default function DeepLinkManager({ projectId, projectSlug }: DeepLinkManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<Partial<DeepLinkConfig>>({
        enabled: false,
        iosBundleId: '',
        iosTeamId: '',
        iosAppStoreId: '',
        androidPackage: '',
        androidSha256Fingerprint: '',
        customScheme: '',
        redirectUrls: [],
        defaultRedirectUrl: '',
        magicLinkTemplate: '',
        oauthCallbackUrl: '',
        passwordResetUrl: '',
        emailConfirmUrl: ''
    });

    const [newRedirectUrl, setNewRedirectUrl] = useState('');

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getDeepLinkConfig(projectId);
            setConfig(data);
        } catch (err: any) {
            if (err.status !== 404) {
                console.error('Failed to load deep link config:', err);
            }
            // If 404, we just keep the default empty state
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                enabled: !!config.enabled,
                iosBundleId: config.iosBundleId || '',
                iosTeamId: config.iosTeamId || '',
                iosAppStoreId: config.iosAppStoreId || '',
                androidPackage: config.androidPackage || '',
                androidSha256Fingerprint: config.androidSha256Fingerprint || '',
                customScheme: config.customScheme || '',
                redirectUrls: config.redirectUrls || [],
                defaultRedirectUrl: config.defaultRedirectUrl || '',
                magicLinkTemplate: config.magicLinkTemplate || '',
                oauthCallbackUrl: config.oauthCallbackUrl || '',
                passwordResetUrl: config.passwordResetUrl || '',
                emailConfirmUrl: config.emailConfirmUrl || '',
            };
            const data = await upsertDeepLinkConfig(projectId, payload);
            setConfig(data);
            toast.success('Deep link configuration updated');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const ok = await confirm({
            title: 'Delete Deep Link Config',
            message: 'Are you sure you want to delete deep link configuration?',
            variant: 'danger',
            confirmText: 'Delete Config'
        });
        if (!ok) return;
        try {
            await deleteDeepLinkConfig(projectId);
            setConfig({
                enabled: false,
                iosBundleId: '',
                iosTeamId: '',
                iosAppStoreId: '',
                androidPackage: '',
                androidSha256Fingerprint: '',
                customScheme: '',
                redirectUrls: [],
                defaultRedirectUrl: '',
                magicLinkTemplate: '',
                oauthCallbackUrl: '',
                passwordResetUrl: '',
                emailConfirmUrl: ''
            });
            toast.success('Configuration deleted');
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete configuration');
        }
    };

    const addRedirectUrl = () => {
        if (!newRedirectUrl) return;
        if (!config.redirectUrls?.includes(newRedirectUrl)) {
            setConfig({ ...config, redirectUrls: [...(config.redirectUrls || []), newRedirectUrl] });
        }
        setNewRedirectUrl('');
    };

    const removeRedirectUrl = (url: string) => {
        setConfig({ ...config, redirectUrls: config.redirectUrls?.filter(u => u !== url) });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Synchronizing Mobile Protocols...</p>
            </div>
        );
    }

    const wellKnownIosUrl = `https://api.useafribase.app/.well-known/apple-app-site-association/${projectSlug}`;
    const wellKnownAndroidUrl = `https://api.useafribase.app/.well-known/assetlinks.json/${projectSlug}`;

    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Smartphone className="text-emerald-500" size={28} />
                        Deep Linking & App Links
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Configure iOS Universal Links, Android App Links, and custom URI schemes for your mobile apps.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="p-3 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Reset Configuration"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Status */}
                    <div className="glass-card rounded-[32px] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${config.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                    <Settings size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Enable Deep Linking</h3>
                                    <p className="text-zinc-500 text-xs font-medium">Activate mobile redirection and app linking protocols.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                                className={`w-14 h-8 rounded-full transition-all relative ${config.enabled ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.enabled ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* iOS Configuration */}
                    <div className="glass-card rounded-[32px] p-8 space-y-8 border-l-4 border-l-zinc-500">
                        <div className="flex items-center gap-3">
                            <Apple size={24} className="text-white" />
                            <h3 className="text-lg font-bold text-white">iOS Universal Links</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Bundle ID</label>
                                <input
                                    type="text"
                                    value={config.iosBundleId}
                                    onChange={(e) => setConfig({ ...config, iosBundleId: e.target.value })}
                                    placeholder="com.example.myapp"
                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Team ID</label>
                                <input
                                    type="text"
                                    value={config.iosTeamId}
                                    onChange={(e) => setConfig({ ...config, iosTeamId: e.target.value })}
                                    placeholder="10-digit ID"
                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Verification URL</h4>
                                <a href={wellKnownIosUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1 hover:text-white transition-colors">
                                    <ExternalLink size={10} /> View AASA
                                </a>
                            </div>
                            <code className="block p-3 bg-black rounded-xl text-[10px] text-zinc-400 font-mono break-all border border-white/5">
                                {wellKnownIosUrl}
                            </code>
                            <p className="text-[10px] text-zinc-600 italic">Apple's CDN will query this endpoint periodically to verify your domain ownership.</p>
                        </div>
                    </div>

                    {/* Android Configuration */}
                    <div className="glass-card rounded-[32px] p-8 space-y-8 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-3">
                            <Android size={24} className="text-emerald-500" />
                            <h3 className="text-lg font-bold text-white">Android App Links</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Package Name</label>
                                <input
                                    type="text"
                                    value={config.androidPackage}
                                    onChange={(e) => setConfig({ ...config, androidPackage: e.target.value })}
                                    placeholder="com.example.myapp"
                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">SHA256 Fingerprint</label>
                                <input
                                    type="text"
                                    value={config.androidSha256Fingerprint}
                                    onChange={(e) => setConfig({ ...config, androidSha256Fingerprint: e.target.value })}
                                    placeholder="14:6D:E9:..."
                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Digital Asset Links URL</h4>
                                <a href={wellKnownAndroidUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1 hover:text-white transition-colors">
                                    <ExternalLink size={10} /> View JSON
                                </a>
                            </div>
                            <code className="block p-3 bg-black rounded-xl text-[10px] text-zinc-400 font-mono break-all border border-white/5">
                                {wellKnownAndroidUrl}
                            </code>
                        </div>
                    </div>

                    {/* Custom URI Scheme */}
                    <div className="glass-card rounded-[32px] p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Link size={24} className="text-purple-500" />
                            <h3 className="text-lg font-bold text-white">Custom URI Scheme</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Scheme</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={config.customScheme}
                                    onChange={(e) => setConfig({ ...config, customScheme: e.target.value })}
                                    placeholder="myapp"
                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono pr-12"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-600">://</span>
                            </div>
                            <p className="text-[10px] text-zinc-600">Used for redirection back to your app from social login or email verification.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Allowed Redirects */}
                    <div className="glass-card rounded-[32px] p-8 space-y-6 border border-white/5">
                        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Shield size={16} /> Security Whitelist
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newRedirectUrl}
                                    onChange={(e) => setNewRedirectUrl(e.target.value)}
                                    placeholder="myapp://auth/signup"
                                    className="flex-1 bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                    onKeyPress={(e) => e.key === 'Enter' && addRedirectUrl()}
                                />
                                <button
                                    onClick={addRedirectUrl}
                                    className="p-2 bg-zinc-800 hover:bg-emerald-600 text-white rounded-xl transition-all"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                                {config.redirectUrls?.map((url, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group">
                                        <span className="text-[10px] font-mono text-zinc-400 truncate flex-1 mr-2">{url}</span>
                                        <button onClick={() => removeRedirectUrl(url)} className="p-1 text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {(!config.redirectUrls || config.redirectUrls.length === 0) && (
                                    <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl">
                                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No URLs Whitelisted</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Auth Integration Templates */}
                    <div className="glass-card rounded-[32px] p-8 space-y-6 bg-emerald-500/[0.02] border border-emerald-500/10">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Auth Callbacks</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Magic Link Template</label>
                                <input
                                    type="text"
                                    value={config.magicLinkTemplate}
                                    onChange={(e) => setConfig({ ...config, magicLinkTemplate: e.target.value })}
                                    placeholder="myapp://auth/confirm"
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">OAuth Callback</label>
                                <input
                                    type="text"
                                    value={config.oauthCallbackUrl}
                                    onChange={(e) => setConfig({ ...config, oauthCallbackUrl: e.target.value })}
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Password Reset URL</label>
                                <input
                                    type="text"
                                    value={config.passwordResetUrl}
                                    onChange={(e) => setConfig({ ...config, passwordResetUrl: e.target.value })}
                                    placeholder="myapp://auth/reset"
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Email Confirmation URL</label>
                                <input
                                    type="text"
                                    value={config.emailConfirmUrl}
                                    onChange={(e) => setConfig({ ...config, emailConfirmUrl: e.target.value })}
                                    placeholder="myapp://auth/confirm"
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Help Note */}
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
                        <Info size={20} className="text-blue-500 shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white">How it works</h4>
                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                Universal Links allow iOS to open your app directly from a HTTPS link (skip the browser).
                                Ensure your app's Entitlements file matches the Team ID and Bundle ID configured here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}
