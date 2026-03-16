'use client';

import React, { useState, useEffect } from 'react';
import {
    getAuthConfig,
    updateAuthConfig,
    updateAuthProvider,
    AuthConfigResponse,
    OAuthProviderConfig
} from '@/lib/api';
import { Shield, Mail, Phone, Github, Globe, Save, Check, Copy, ExternalLink, Key, Code, Smartphone, Terminal, PenTool, Database, FileText, ChevronRight, X } from 'lucide-react';
import { FaGoogle, FaGithub, FaDiscord, FaFacebook, FaApple, FaTwitter } from 'react-icons/fa';
import { SmtpConfig, EmailTemplatesConfig, EmailTemplate } from '@/lib/api';

interface AuthSettingsProps {
    projectId: string;
}

export default function AuthSettings({ projectId }: AuthSettingsProps) {
    const [config, setConfig] = useState<AuthConfigResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [activeSdk, setActiveSdk] = useState<string>('javascript');

    // Local state for editting (only for specific providers when expanded)
    const [editingProvider, setEditingProvider] = useState<string | null>(null);
    const [providerForm, setProviderForm] = useState<OAuthProviderConfig>({
        enabled: false,
        clientId: '',
        secret: '',
        redirectUri: ''
    });

    // SMTP Form state
    const [editingSmtp, setEditingSmtp] = useState(false);
    const [smtpForm, setSmtpForm] = useState<Partial<SmtpConfig>>({});

    // Site URL state
    const [siteURL, setSiteURL] = useState('');
    const [redirectURLs, setRedirectURLs] = useState('');
    const [isSavingSiteURL, setIsSavingSiteURL] = useState(false);

    // Template Form state
    const [editingTemplate, setEditingTemplate] = useState<keyof EmailTemplatesConfig | null>(null);
    const [templateForm, setTemplateForm] = useState<EmailTemplate>({ subject: '', content: '' });
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        loadConfig();
    }, [projectId]);

    const loadConfig = async () => {
        setIsLoading(true);
        try {
            const data = await getAuthConfig(projectId);
            setConfig(data);
            setSiteURL((data as any).siteUrl || '');
            setRedirectURLs(((data as any).redirectUrls || []).join('\n'));
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load authentication settings.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleEmail = async (enabled: boolean) => {
        try {
            const updated = await updateAuthConfig(projectId, { emailEnabled: enabled });
            setConfig(updated);
            setMessage({ type: 'success', text: `Email authentication ${enabled ? 'enabled' : 'disabled'}.` });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update email settings.' });
        }
    };

    const handleToggleAutoConfirm = async (enabled: boolean) => {
        try {
            const updated = await updateAuthConfig(projectId, { emailAutoConfirm: enabled });
            setConfig(updated);
            setMessage({ type: 'success', text: `Email auto-confirm ${enabled ? 'enabled' : 'disabled'}.` });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update auto-confirm settings.' });
        }
    };

    const startEditingProvider = (name: string) => {
        const p = config?.providers[name];
        setEditingProvider(name);
        setProviderForm({
            enabled: p?.enabled || false,
            clientId: p?.clientId || '',
            secret: '', // Don't show existing secret
            redirectUri: p?.redirectUri || `http://localhost:3000/auth/callback`
        });
    };

    const saveProvider = async () => {
        if (!editingProvider) return;
        setIsSaving(true);
        try {
            const updated = await updateAuthProvider(projectId, editingProvider, providerForm);
            setConfig(updated);
            setEditingProvider(null);
            setMessage({ type: 'success', text: `${editingProvider.charAt(0).toUpperCase() + editingProvider.slice(1)} provider updated.` });
        } catch (err) {
            setMessage({ type: 'error', text: `Failed to update ${editingProvider} provider.` });
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates({ ...copiedStates, [id]: true });
        setTimeout(() => {
            setCopiedStates({ ...copiedStates, [id]: false });
        }, 2000);
    };

    const handleSaveSmtp = async () => {
        setIsSaving(true);
        try {
            const updated = await updateAuthConfig(projectId, { smtp: smtpForm });
            setConfig(updated);
            setEditingSmtp(false);
            setMessage({ type: 'success', text: 'SMTP settings updated.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update SMTP settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSiteURL = async () => {
        setIsSavingSiteURL(true);
        try {
            const urls = redirectURLs.split('\n').map(u => u.trim()).filter(Boolean);
            await updateAuthConfig(projectId, {
                siteUrl: siteURL,
                redirectUrls: urls,
            } as any);
            setMessage({ type: 'success', text: 'Site URL updated. Restart the auth container to apply.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update Site URL.' });
        } finally {
            setIsSavingSiteURL(false);
        }
    };

    const handleSaveTemplate = async () => {
        if (!editingTemplate) return;
        setIsSaving(true);
        try {
            const updated = await updateAuthConfig(projectId, {
                templates: {
                    [editingTemplate]: templateForm
                }
            });
            setConfig(updated);
            setEditingTemplate(null);
            setMessage({ type: 'success', text: `Email template for ${editingTemplate} updated.` });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update email template.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/50 rounded-3xl border border-white/5">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 text-sm font-medium">Loading auth settings...</p>
            </div>
        );
    }

    const TEMPLATE_META: Record<keyof EmailTemplatesConfig, { label: string; desc: string; when: string }> = {
        invite:       { label: 'Invite User',        desc: 'Sent when a user is invited to join your application.', when: 'On invitation' },
        confirmation: { label: 'Confirm Signup',     desc: 'Sent when a user signs up and must verify their email.', when: 'On signup' },
        recovery:     { label: 'Reset Password',     desc: 'Sent when a user requests a password reset.', when: 'On password reset' },
        magicLink:    { label: 'Magic Link',         desc: 'Sent when a user requests passwordless sign-in.', when: 'On magic link request' },
        emailChange:  { label: 'Confirm Email Change', desc: 'Sent when a user requests to change their email.', when: 'On email change' },
    };

    const providers = [
        { id: 'google', name: 'Google', icon: FaGoogle, color: 'text-rose-500', portal: 'https://console.cloud.google.com/' },
        { id: 'github', name: 'GitHub', icon: FaGithub, color: 'text-zinc-100', portal: 'https://github.com/settings/developers' },
        { id: 'discord', name: 'Discord', icon: FaDiscord, color: 'text-indigo-500', portal: 'https://discord.com/developers/applications' },
        { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600', portal: 'https://developers.facebook.com/' },
        { id: 'apple', name: 'Apple', icon: FaApple, color: 'text-zinc-100', portal: 'https://developer.apple.com/' },
        { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-sky-500', portal: 'https://developer.twitter.com/' },
    ];

    return (
        <div className="space-y-8 max-w-5xl animate-fade-in">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
                        <Shield className="text-emerald-500" size={28} />
                        Authentication
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
                        Configure how users sign in to your application. Enable email/password, magic links, or external OAuth providers.
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} flex items-center gap-3 text-sm font-bold uppercase tracking-widest`}>
                    {message.text}
                    <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto opacity-50 hover:opacity-100">×</button>
                </div>
            )}

            <div className="space-y-8">
                {/* Email and OAuth Sections - Full Width */}
                <div className="space-y-8">
                    {/* ------- SITE URL SECTION ------- */}
                    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                            <Globe className="text-blue-400" size={18} />
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Site URL &amp; Redirect Config</span>
                            <span className="ml-auto text-[10px] font-black text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded-full uppercase tracking-widest">Required for email confirmation</span>
                        </div>
                        <div className="p-6 space-y-5">
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                <span className="text-white font-bold">Site URL</span> is your application's URL — GoTrue embeds it inside every confirmation and recovery email link. Without it, confirmation emails will redirect to the wrong place.
                            </p>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Site URL</label>
                                <input
                                    type="url"
                                    value={siteURL}
                                    onChange={(e) => setSiteURL(e.target.value)}
                                    placeholder="https://myapp.com  or  http://localhost:3000"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Additional Redirect URLs <span className="text-zinc-600 normal-case">— one per line</span></label>
                                <textarea
                                    rows={3}
                                    value={redirectURLs}
                                    onChange={(e) => setRedirectURLs(e.target.value)}
                                    placeholder={`https://myapp.com/auth/callback\nhttps://staging.myapp.com/**`}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                                />
                                <p className="text-[10px] text-zinc-600 font-medium">Wildcards supported: <code className="text-zinc-400">https://myapp.com/**</code></p>
                            </div>
                            <button
                                disabled={isSavingSiteURL}
                                onClick={handleSaveSiteURL}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {isSavingSiteURL ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                                Save Site URL
                            </button>
                        </div>
                    </div>

                    {/* Email Settings */}
                    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="text-zinc-400" size={18} />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Email Auth</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config?.emailEnabled}
                                    onChange={(e) => handleToggleEmail(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-zinc-100 font-bold text-sm">Allow new users to sign up</h4>
                                    <p className="text-zinc-500 text-xs mt-1">If disabled, only existing users can sign in.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-9 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500/50"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-zinc-100 font-bold text-sm">Confirm email significantly</h4>
                                    <p className="text-zinc-500 text-xs mt-1">Require users to verify their email address before signing in.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={!config?.emailAutoConfirm}
                                        onChange={(e) => handleToggleAutoConfirm(!e.target.checked)}
                                    />
                                    <div className="w-9 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500/50"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SMTP Configuration */}
                    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Database className="text-zinc-400" size={18} />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Custom SMTP (Mailtrap/Resend)</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config?.smtp?.enabled || false}
                                    onChange={(e) => setSmtpForm({ ...config?.smtp, enabled: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                        <div className="p-6">
                            {!editingSmtp ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-zinc-500 font-medium">Use your own email provider to send transactional emails and avoid the daily limit.</p>
                                        <button
                                            onClick={() => {
                                                setEditingSmtp(true);
                                                setSmtpForm(config?.smtp || {});
                                            }}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 transition-all"
                                        >
                                            Configure SMTP
                                        </button>
                                    </div>
                                    {config?.smtp?.enabled && (
                                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase">Provider Host</span>
                                                <span className="text-xs font-mono text-emerald-400">{config?.smtp?.host}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase">Sender Name</span>
                                                <span className="text-xs font-medium text-white">{config?.smtp?.senderName}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-5 animate-slide-up-modest">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SMTP Host</label>
                                            <input
                                                type="text"
                                                value={smtpForm.host || ''}
                                                onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                                                placeholder="smtp.mailtrap.io"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SMTP Port</label>
                                            <input
                                                type="number"
                                                value={smtpForm.port || ''}
                                                onChange={(e) => setSmtpForm({ ...smtpForm, port: parseInt(e.target.value) })}
                                                placeholder="587"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">User / Username</label>
                                            <input
                                                type="text"
                                                value={smtpForm.user || ''}
                                                onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                                            <input
                                                type="password"
                                                value={smtpForm.pass || ''}
                                                placeholder={config?.smtp?.passSet ? "••••••••••••••••" : "Enter password"}
                                                onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sender Email</label>
                                            <input
                                                type="email"
                                                value={smtpForm.adminEmail || ''}
                                                onChange={(e) => setSmtpForm({ ...smtpForm, adminEmail: e.target.value })}
                                                placeholder="hello@yourdomain.com"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sender Name</label>
                                            <input
                                                type="text"
                                                value={smtpForm.senderName || ''}
                                                onChange={(e) => setSmtpForm({ ...smtpForm, senderName: e.target.value })}
                                                placeholder="Afribase Support"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            disabled={isSaving}
                                            onClick={handleSaveSmtp}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                                            Save SMTP Settings
                                        </button>
                                        <button
                                            onClick={() => setEditingSmtp(false)}
                                            className="px-6 py-3 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Templates */}
                    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="text-zinc-400" size={18} />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Auth Email Templates</span>
                            </div>
                        </div>
                        <div className="p-6">
                            {editingTemplate ? (
                                <div className="space-y-5 animate-slide-up-modest">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-white font-bold text-sm uppercase flex items-center gap-2 italic">
                                            <PenTool size={14} className="text-emerald-500" />
                                            {TEMPLATE_META[editingTemplate]?.label} Template
                                        </h4>
                                        <div className="flex items-center gap-1 bg-zinc-900 border border-white/5 p-1 rounded-lg">
                                            <button
                                                onClick={() => setPreviewMode(false)}
                                                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${!previewMode ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                Source
                                            </button>
                                            <button
                                                onClick={() => setPreviewMode(true)}
                                                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${previewMode ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Subject</label>
                                            <input
                                                type="text"
                                                value={templateForm.subject}
                                                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Body (HTML)</label>
                                                <span className="text-[10px] text-zinc-600 font-medium italic">GoTrue template syntax</span>
                                            </div>

                                            {previewMode ? (
                                                <div className="w-full h-[300px] bg-white rounded-xl overflow-hidden border border-white/10 p-1">
                                                    <iframe
                                                        srcDoc={templateForm.content
                                                            .replace(/{{\.ConfirmationURL}}/g, '#')
                                                            .replace(/{{\.Email}}/g, 'user@example.com')
                                                            .replace(/{{\.Token}}/g, '123456')
                                                            .replace(/{{\.SiteURL}}/g, siteURL || 'https://myapp.com')
                                                        }
                                                        className="w-full h-full border-none rounded-lg"
                                                        title="Email Preview"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative group">
                                                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-zinc-900/50 border-r border-white/5 rounded-l-xl flex flex-col items-center pt-3 text-[10px] text-zinc-600 font-mono select-none pointer-events-none">
                                                        {Array.from({ length: 16 }).map((_, i) => <div key={i} className="h-[21px]">{i + 1}</div>)}
                                                    </div>
                                                    <textarea
                                                        rows={16}
                                                        value={templateForm.content}
                                                        onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[13px] text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 transition-colors resize-none leading-[21px]"
                                                    />
                                                </div>
                                            )}

                                            {/* Variable reference */}
                                            <div className="flex flex-wrap gap-2">
                                                {['{{ .ConfirmationURL }}','{{ .Token }}','{{ .TokenHash }}','{{ .SiteURL }}','{{ .Email }}','{{ .NewEmail }}'].map(v => (
                                                    <button
                                                        key={v}
                                                        onClick={() => setTemplateForm({ ...templateForm, content: templateForm.content + v })}
                                                        className="px-2 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-mono text-emerald-400 hover:bg-zinc-800 hover:border-emerald-500/30 transition-all"
                                                        title={`Insert ${v}`}
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            disabled={isSaving}
                                            onClick={handleSaveTemplate}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                                            Update Template
                                        </button>
                                        <button
                                            onClick={() => setEditingTemplate(null)}
                                            className="px-6 py-3 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(Object.keys(TEMPLATE_META) as Array<keyof EmailTemplatesConfig>).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setEditingTemplate(key);
                                                setTemplateForm(config?.templates?.[key] || { subject: '', content: '' });
                                                setPreviewMode(false);
                                            }}
                                            className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group text-left"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h5 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">{TEMPLATE_META[key].label}</h5>
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{TEMPLATE_META[key].when}</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 leading-relaxed">{TEMPLATE_META[key].desc}</p>
                                                {config?.templates?.[key]?.subject && (
                                                    <p className="text-[10px] text-emerald-500/70 mt-1 truncate font-mono">Subject: {config.templates[key].subject}</p>
                                                )}
                                            </div>
                                            <ChevronRight className="text-zinc-600 group-hover:text-emerald-500 transition-colors shrink-0 mt-0.5" size={16} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OAuth Providers */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 px-1">External OAuth Providers</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {providers.map((provider) => {
                                const isEnabled = config?.providers ? config.providers[provider.id]?.enabled : false;
                                const isEditing = editingProvider === provider.id;

                                return (
                                    <div key={provider.id} className={`glass-card rounded-2xl border transition-all duration-300 ${isEditing ? 'border-emerald-500/30 ring-1 ring-emerald-500/20 col-span-full' : 'border-white/5'}`}>
                                        <div className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-xl bg-zinc-900 border border-white/5 ${provider.color}`}>
                                                    <provider.icon size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-zinc-100 font-bold text-sm">{provider.name}</h4>
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isEnabled ? 'text-emerald-500' : 'text-zinc-600'}`}>
                                                        {isEnabled ? 'Enabled & Active' : 'Not Configured'}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => startEditingProvider(provider.id)}
                                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-zinc-800 text-zinc-400' : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/5'}`}
                                            >
                                                {isEditing ? 'Editing...' : isEnabled ? 'Modify' : 'Set Up'}
                                            </button>
                                        </div>

                                        {isEditing && (
                                            <div className="px-5 pb-6 space-y-5 animate-slide-up-modest border-t border-white/5 pt-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client ID</label>
                                                        <input
                                                            type="text"
                                                            value={providerForm.clientId}
                                                            onChange={(e) => setProviderForm({ ...providerForm, clientId: e.target.value })}
                                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client Secret</label>
                                                        <input
                                                            type="password"
                                                            value={providerForm.secret}
                                                            placeholder={config?.providers && config.providers[provider.id]?.secretSet ? "••••••••••••••••" : "Enter client secret"}
                                                            onChange={(e) => setProviderForm({ ...providerForm, secret: e.target.value })}
                                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Redirect URI</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={providerForm.redirectUri}
                                                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-400 focus:outline-none"
                                                        />
                                                        <button
                                                            onClick={() => copyToClipboard(providerForm.redirectUri || '', `${provider.id}-callback`)}
                                                            className="p-2.5 bg-zinc-900 border border-white/10 rounded-xl hover:text-white transition-colors"
                                                        >
                                                            {copiedStates[`${provider.id}-callback`] ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] text-zinc-600 font-medium italic">Copy this URL to your {provider.name} developer portal.</p>
                                                </div>

                                                <div className="flex items-center gap-3 pt-2">
                                                    <button
                                                        disabled={isSaving}
                                                        onClick={saveProvider}
                                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {isSaving ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                                                        Save Configuration
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingProvider(null);
                                                        }}
                                                        className="px-6 py-3 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Integration and Security Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* SDK Snippet Card */}
                    <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Code className="text-emerald-500" size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Quick Integration</span>
                                </div>
                                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                                    {[
                                        { id: 'javascript', label: 'JS', icon: Globe },
                                        { id: 'dart', label: 'Dart', icon: Smartphone },
                                        { id: 'swift', label: 'Swift', icon: Smartphone },
                                        { id: 'kotlin', label: 'Kotlin', icon: Smartphone },
                                        { id: 'python', label: 'Py', icon: Terminal },
                                    ].map((sdk) => (
                                        <button
                                            key={sdk.id}
                                            onClick={() => setActiveSdk(sdk.id)}
                                            title={sdk.label}
                                            className={`p-1.5 rounded-md transition-all ${activeSdk === sdk.id ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            <sdk.icon size={12} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-[10px] text-zinc-500 leading-relaxed mb-4 font-medium italic">
                                Use the Afribase SDK for <span className="text-emerald-500 uppercase font-black">{activeSdk}</span> to get started instantly.
                            </p>

                            <div className="relative group">
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={() => copyToClipboard((config?.sdkSnippet as any)?.[activeSdk] || '', `sdk-${activeSdk}`)}
                                        className="p-2 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-lg text-zinc-400 hover:text-white"
                                    >
                                        {copiedStates[`sdk-${activeSdk}`] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <pre className="p-4 bg-black/40 border border-white/5 rounded-xl overflow-x-auto text-[10px] font-mono text-emerald-400 leading-relaxed max-h-[300px] custom-scrollbar">
                                    {(config?.sdkSnippet as any)?.[activeSdk] || `// No snippet available`}
                                </pre>
                            </div>

                            <button className="w-full mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors py-2 border border-dashed border-zinc-800 rounded-xl hover:border-zinc-700">
                                Build your next app <ExternalLink size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4 flex flex-col justify-center">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20">
                            <Shield className="text-emerald-400" size={20} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-white">Security First</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                            Authentication is handled on dedicated, isolated containers. Each project is physically separated to ensure maximum security for your users' sensitive data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
