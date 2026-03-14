'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Globe, Smartphone, Lock, 
  Settings, Key, ExternalLink, Mail,
  CheckCircle2, AlertCircle, RefreshCw,
  Github, Chrome, Facebook, Apple, Twitter,
  Slack, Link, Fingerprint, Code, Zap
} from 'lucide-react';
import { getAuthConfig, updateAuthConfig, AuthConfigResponse, UpdateAuthConfigRequest } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface AuthConfigProps {
  projectId: string;
}

const PROVIDER_ICONS: Record<string, any> = {
  github: Github,
  google: Chrome,
  facebook: Facebook,
  apple: Apple,
  twitter: Twitter,
  slack: Slack,
  discord: Globe,
  gitlab: Globe,
  twitch: Globe,
  linkedin: Globe,
  notion: Globe,
  zoom: Globe,
  bitbucket: Globe,
  snapchat: Smartphone,
  figma: Globe,
  flyio: Globe,
  workos: ShieldCheck,
  kakao: Globe,
  keycloak: Lock,
  azuread: Globe,
};

export default function AuthConfig({ projectId }: AuthConfigProps) {
  const [config, setConfig] = useState<AuthConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'methods' | 'providers' | 'smtp' | 'mfa' | 'enterprise' | 'hooks'>('methods');
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [providerDetails, setProviderDetails] = useState({
      clientId: '',
      clientSecret: '',
      redirectUri: '',
      enabled: false
  });
  const [showAllProviders, setShowAllProviders] = useState(false);

  const FEATURED_PROVIDERS = ['google', 'github', 'discord', 'facebook', 'apple', 'twitter'];

  useEffect(() => {
    loadConfig();
  }, [projectId]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const data = await getAuthConfig(projectId);
      setConfig(data);
    } catch (err) {
      // toast.error('Failed to load auth configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (req: UpdateAuthConfigRequest) => {
    setIsSaving(true);
    try {
      const data = await updateAuthConfig(projectId, req);
      setConfig(data);
      toast.success('Auth configuration updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !config) {
    return (
      <div className="flex items-center justify-center py-40">
        <RefreshCw size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
            <Lock className="text-emerald-500" size={32} />
            Authentication Engine
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
            Configure how users sign up and log in to your application. Supported via internal GoTrue orchestrator.
          </p>
        </div>

        <div className="flex p-1 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'methods', label: 'Flows', icon: Zap },
            { id: 'providers', label: 'OAuth', icon: Globe },
            { id: 'smtp', label: 'Email', icon: Mail },
            { id: 'mfa', label: 'MFA', icon: ShieldCheck },
            { id: 'enterprise', label: 'Enterprise', icon: Lock },
            { id: 'hooks', label: 'Hooks', icon: Code },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'methods' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <ToggleCard 
            title="Email / Password"
            description="Allow users to sign up with a traditional email and password combination."
            enabled={config.emailEnabled}
            icon={Mail}
            onToggle={(v) => handleUpdate({ emailEnabled: v })}
            disabled={isSaving}
          />
          <ToggleCard 
            title="Magic Links"
            description="Passwordless login via a secure link sent to the user's email address."
            enabled={config.magicLinkEnabled}
            icon={Link}
            onToggle={(v) => handleUpdate({ magicLinkEnabled: v })}
            disabled={isSaving}
          />
          <ToggleCard 
            title="Phone / SMS OTP"
            description="Send a one-time passcode via SMS for secure mobile primary authentication."
            enabled={config.phoneEnabled}
            icon={Smartphone}
            onToggle={(v) => handleUpdate({ phoneEnabled: v, smsEnabled: v })}
            disabled={isSaving}
          />
          <ToggleCard 
            title="Anonymous Sign-In"
            description="Allow guest users to create temporary sessions without providing credentials."
            enabled={config.anonymousEnabled}
            icon={ShieldCheck}
            onToggle={(v) => handleUpdate({ anonymousEnabled: v })}
            disabled={isSaving}
          />
        </div>
      )}

      {activeTab === 'smtp' && (
        <div className="space-y-8 max-w-4xl">
            <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="text-emerald-500" size={24} />
                        <h3 className="text-white font-bold">SMTP Configuration</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.smtp.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                        {config.smtp.enabled ? 'Active' : 'Disabled'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SMTP Host</label>
                        <input 
                            type="text"
                            value={config.smtp.host}
                            onChange={(e) => handleUpdate({ smtp: { host: e.target.value } })}
                            className="w-full bg-zinc-950 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none"
                            placeholder="smtp.example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Port</label>
                        <input 
                            type="number"
                            value={config.smtp.port}
                            onChange={(e) => handleUpdate({ smtp: { port: parseInt(e.target.value) } })}
                            className="w-full bg-zinc-950 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none"
                            placeholder="587"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SMTP User</label>
                        <input 
                            type="text"
                            value={config.smtp.user}
                            onChange={(e) => handleUpdate({ smtp: { user: e.target.value } })}
                            className="w-full bg-zinc-950 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SMTP Password</label>
                        <input 
                            type="password"
                            placeholder={config.smtp.passSet ? "••••••••" : "Not set"}
                            onChange={(e) => handleUpdate({ smtp: { pass: e.target.value } })}
                            className="w-full bg-zinc-950 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                     <button 
                        onClick={() => handleUpdate({ smtp: { enabled: !config.smtp.enabled } })}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${config.smtp.enabled ? 'bg-zinc-900 text-white' : 'bg-emerald-500 text-black'}`}
                    >
                        {config.smtp.enabled ? 'Disable SMTP' : 'Enable SMTP'}
                    </button>
                </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Email Delivery Note</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                        By default, projects use the Afribase platform mailer (Mailtrap) which is limited to 100 emails/month. 
                        Enable your own SMTP for production use and unlimited delivery.
                    </p>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(PROVIDER_ICONS)
                    .filter(id => FEATURED_PROVIDERS.includes(id))
                    .map(providerId => {
                    const p = config.providers[providerId];
                    const Icon = PROVIDER_ICONS[providerId];
                    return (
                        <div key={providerId} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 bg-zinc-950 border border-white/5 rounded-xl text-zinc-400 group-hover:text-emerald-500 transition-colors">
                                    <Icon size={20} />
                                </div>
                                <div className={`w-2 h-2 rounded-full ${p?.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm capitalize">{providerId}</h4>
                                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                                    {p?.enabled ? 'ACTIVE' : 'INACTIVE'}
                                </p>
                            </div>
                            <button 
                                className="mt-4 w-full py-2 bg-zinc-900 border border-white/5 hover:border-emerald-500/30 text-zinc-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                                onClick={() => {
                                    setEditingProvider(providerId);
                                    const details = config.providers[providerId];
                                    setProviderDetails({
                                        clientId: details?.clientId || '',
                                        clientSecret: '', 
                                        redirectUri: details?.redirectUri || '',
                                        enabled: details?.enabled || false
                                    });
                                }}
                            >
                                {p?.enabled ? 'Configure' : 'Set Up'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4">
                <button 
                    onClick={() => setShowAllProviders(!showAllProviders)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                    {showAllProviders ? 'Hide extra providers' : 'Show all providers'}
                    <div className={`transition-transform duration-300 ${showAllProviders ? 'rotate-180' : ''}`}>
                         <RefreshCw size={12} />
                    </div>
                </button>
            </div>

            {showAllProviders && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    {Object.keys(PROVIDER_ICONS)
                        .filter(id => !FEATURED_PROVIDERS.includes(id))
                        .map(providerId => {
                        const p = config.providers[providerId];
                        const Icon = PROVIDER_ICONS[providerId];
                        return (
                            <div key={providerId} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2.5 bg-zinc-950 border border-white/5 rounded-xl text-zinc-400 group-hover:text-emerald-500 transition-colors">
                                        <Icon size={20} />
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${p?.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm capitalize">{providerId}</h4>
                                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                                        {p?.enabled ? 'ACTIVE' : 'INACTIVE'}
                                    </p>
                                </div>
                                <button 
                                    className="mt-4 w-full py-2 bg-zinc-900 border border-white/5 hover:border-emerald-500/30 text-zinc-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                                    onClick={() => {
                                        setEditingProvider(providerId);
                                        const details = config.providers[providerId];
                                        setProviderDetails({
                                            clientId: details?.clientId || '',
                                            clientSecret: '', 
                                            redirectUri: details?.redirectUri || '',
                                            enabled: details?.enabled || false
                                        });
                                    }}
                                >
                                    {p?.enabled ? 'Configure' : 'Set Up'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            {/* Removed extra div */}
            
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-between gap-8 group">
                <div className="space-y-1">
                    <h3 className="text-white font-bold text-sm">Custom OAuth Provider</h3>
                    <p className="text-zinc-500 text-xs font-medium">Bring your own OAuth2 provider for internal enterprise systems or custom identities.</p>
                </div>
                <button className="px-6 py-3 bg-zinc-900 border border-white/5 text-zinc-400 group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Register Custom Provider
                </button>
            </div>
        </div>
      )}

      {activeTab === 'mfa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ToggleCard 
                title="Multi-Factor Auth (Global)"
                description="Enable MFA support across the entire project. Users can enroll in second-factor methods."
                enabled={config.mfa.enabled}
                icon={Fingerprint}
                onToggle={(v) => handleUpdate({ mfa: { enabled: v } })}
                disabled={isSaving}
            />
            <div className="space-y-6">
                <div className={`p-6 rounded-2xl border transition-all ${config.mfa.enabled ? 'border-white/10 bg-zinc-900' : 'border-dashed border-white/5 opacity-50 grayscale pointer-events-none'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                                <Smartphone size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Authenticator App (TOTP)</h4>
                                <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest">Recommended</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={config.mfa.totpEnabled}
                            onChange={(e) => handleUpdate({ mfa: { totpEnabled: e.target.checked } })}
                            className="w-10 h-5 bg-zinc-800 rounded-full appearance-none cursor-pointer checked:bg-emerald-500 relative transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
                        />
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                        Verify identities using industry-standard TOTP apps like Google Authenticator, Authy, or 1Password.
                    </p>
                </div>

                <div className={`p-6 rounded-2xl border transition-all ${config.mfa.enabled ? 'border-white/10 bg-zinc-900' : 'border-dashed border-white/5 opacity-50 grayscale pointer-events-none'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-800 text-zinc-400 rounded-xl">
                                <RefreshCw size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Recovery Codes</h4>
                                <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest">Safety Net</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={config.mfa.recoveryEnabled}
                            onChange={(e) => handleUpdate({ mfa: { recoveryEnabled: e.target.checked } })}
                            className="w-10 h-5 bg-zinc-800 rounded-full appearance-none cursor-pointer checked:bg-emerald-500 relative transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
                        />
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                        Generate a set of single-use backup codes for users to regain access if they lose their MFA device.
                    </p>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'enterprise' && (
        <div className="space-y-8">
            <ToggleCard 
                title="SAML 2.0 / SSO"
                description="Connect your project to enterprise identity providers like Okta, Azure AD, or OneLogin."
                enabled={config.saml.enabled}
                icon={Lock}
                onToggle={(v) => handleUpdate({ saml: { enabled: v } })}
                disabled={isSaving}
            />
            {config.saml.enabled && (
                <div className="p-10 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-3xl flex flex-col items-center text-center space-y-4">
                    <ShieldCheck size={48} className="text-emerald-500 mb-2" />
                    <h3 className="text-white font-bold text-lg">Enterprise Identity Provider (IdP) Config</h3>
                    <p className="text-zinc-400 text-sm max-w-sm">Manage your SAML connections, ACS URLs, and entity IDs for this project.</p>
                    <button className="px-8 py-3 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 mt-4">
                        Manage SAML Providers
                    </button>
                </div>
            )}
            <ToggleCard 
                title="Web3 Wallet Auth"
                description="Allow users to sign in using Ethereum, Solana, or other wallet signatures (SIWE/SIWS)."
                enabled={config.web3.enabled}
                icon={Fingerprint}
                onToggle={(v) => handleUpdate({ web3: { enabled: v } })}
                disabled={isSaving}
            />
        </div>
      )}

      {activeTab === 'hooks' && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HookCard 
                    title="Custom Access Token"
                    description="Triggered when generating a JWT. Modify token claims before they are signed."
                    value={config.hooks.customAccessToken || ''}
                    onSave={(v) => handleUpdate({ hooks: { customAccessToken: v } })}
                />
                <HookCard 
                    title="Pre Sign-Up Hook"
                    description="Run custom logic before a user is allowed to register. Good for allow-lists."
                    value={config.hooks.preSignUp || ''}
                    onSave={(v) => handleUpdate({ hooks: { preSignUp: v } })}
                />
                <HookCard 
                    title="Post Sign-Up Hook"
                    description="Trigger actions (like Slack alerts) immediately after a successful sign-up."
                    value={config.hooks.postSignUp || ''}
                    onSave={(v) => handleUpdate({ hooks: { postSignUp: v } })}
                />
                <HookCard 
                    title="MFA Challenge Hook"
                    description="Customized challenge logic for second-factor authentication attempts."
                    value={config.hooks.mfaChallenge || ''}
                    onSave={(v) => handleUpdate({ hooks: { mfaChallenge: v } })}
                />
            </div>
            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Security Warning</p>
                    <p className="text-zinc-400 text-xs">Auth hooks call Edge Functions or external HTTP endpoints. Ensure your hook target is secure and idempotent.</p>
                </div>
            </div>
        </div>
      )}
      {/* Provider Details Modal */}
      <Modal 
        isOpen={!!editingProvider} 
        onClose={() => setEditingProvider(null)}
        title={`${editingProvider?.toUpperCase()} Configuration`}
      >
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client ID</label>
                <input 
                    type="text"
                    value={providerDetails.clientId}
                    onChange={(e) => setProviderDetails(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full bg-zinc-950 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none"
                    placeholder="Enter Client ID"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client Secret</label>
                <input 
                    type="password"
                    value={providerDetails.clientSecret}
                    onChange={(e) => setProviderDetails(prev => ({ ...prev, clientSecret: e.target.value }))}
                    className="w-full bg-zinc-950 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none"
                    placeholder="••••••••"
                />
                <p className="text-[9px] text-zinc-500 font-medium italic">Leave empty to keep existing secret.</p>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Redirect URI</label>
                <input 
                    type="text"
                    value={providerDetails.redirectUri}
                    onChange={(e) => setProviderDetails(prev => ({ ...prev, redirectUri: e.target.value }))}
                    className="w-full bg-zinc-950 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none"
                    placeholder="https://your-domain.com/auth/callback"
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button 
                    onClick={() => {
                        if (!editingProvider) return;
                        handleUpdate({
                            [editingProvider]: {
                                enabled: !providerDetails.enabled,
                                clientId: providerDetails.clientId,
                                clientSecret: providerDetails.clientSecret,
                                redirectUri: providerDetails.redirectUri
                            }
                        });
                        setEditingProvider(null);
                    }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${providerDetails.enabled ? 'bg-zinc-800 text-white' : 'bg-emerald-500 text-black'}`}
                >
                    {providerDetails.enabled ? 'Disable Provider' : 'Enable Provider'}
                </button>
                <button 
                    onClick={() => {
                        if (!editingProvider) return;
                        handleUpdate({
                            [editingProvider]: {
                                enabled: providerDetails.enabled,
                                clientId: providerDetails.clientId,
                                clientSecret: providerDetails.clientSecret,
                                redirectUri: providerDetails.redirectUri
                            }
                        });
                        setEditingProvider(null);
                    }}
                    className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                >
                    Save Changes
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
}

function ToggleCard({ title, description, enabled, icon: Icon, onToggle, disabled }: { title: string, description: string, enabled: boolean, icon: any, onToggle: (v: boolean) => void, disabled: boolean }) {
    return (
        <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group h-full">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-zinc-950 border border-white/5 rounded-2xl text-zinc-500 group-hover:text-emerald-500 transition-colors">
                        <Icon size={24} />
                    </div>
                    <input 
                        type="checkbox" 
                        checked={enabled}
                        disabled={disabled}
                        onChange={(e) => onToggle(e.target.checked)}
                        className="w-11 h-6 bg-zinc-800 rounded-full appearance-none cursor-pointer checked:bg-emerald-500 relative transition-all before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all disabled:opacity-50"
                    />
                </div>
                <div className="space-y-2">
                    <h3 className="text-white font-bold">{title}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed font-medium">{description}</p>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
        </div>
    );
}

function HookCard({ title, description, value, onSave }: { title: string, description: string, value: string, onSave: (v: string) => void }) {
    const [localValue, setLocalValue] = useState(value);
    const hasChanged = localValue !== value;

    return (
        <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
            <div>
                <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                <p className="text-zinc-500 text-[10px] leading-relaxed mb-4">{description}</p>
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Target Endpoint URL / Edge Function</label>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="https://hooks.afribase.dev/..."
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-white/10 p-3 rounded-xl text-xs text-emerald-400 font-mono focus:border-emerald-500 outline-none transition-all placeholder:text-zinc-800"
                    />
                    <button 
                        onClick={() => onSave(localValue)}
                        disabled={!hasChanged}
                        className={`px-4 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-0 disabled:translate-x-2`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
