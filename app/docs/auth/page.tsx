'use call';

import React from 'react';
import { Users, ShieldCheck, Mail, Key, Lock, Fingerprint } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function AuthDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Users size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Identity</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Secure <span className="text-emerald-500">Authentication</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Afribase Auth provides a complete authentication solution. Manage users, enable social providers, and define secure access control policies in record time.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Identity Providers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-5 rounded-xl border border-white/5 space-y-3">
                        <Mail className="text-emerald-500" size={20} />
                        <h4 className="text-sm font-bold text-white">Email & Magic Links</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Standard password-based login or secure, passwordless magic links delivered via email.</p>
                    </div>
                    <div className="glass-card p-5 rounded-xl border border-white/5 space-y-3">
                        <Lock className="text-emerald-500" size={20} />
                        <h4 className="text-sm font-bold text-white">OAuth Providers</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Instantly enable social login with Google, GitHub, Slack, Discord, and dozens of others.</p>
                    </div>
                    <div className="glass-card p-5 rounded-xl border border-white/5 space-y-3">
                        <Fingerprint className="text-emerald-500" size={20} />
                        <h4 className="text-sm font-bold text-white">WebAuthn (Passkeys)</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Coming soon. Modern, biometric-based passwordless authentication methods.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Session Management</h2>

                <div className="space-y-6">
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Afribase uses JSON Web Tokens (JWT) for secure, stateless authentication. Every request to your infrastructure is validated against these specialized cryptographic tokens.
                    </p>

                    <div className="space-y-4">
                        <Step number="01" title="Initial Sign-in">
                            Users sign in using their chosen provider. The server validates credentials and returns a short-lived Access Token.
                            <CodeBlock code={`const { user, token } = await api.login({
  email: 'dev@afribase.com',
  password: 'secure-infrastructure'
});`} language="typescript" />
                        </Step>

                        <Step number="02" title="Inactivity Protection">
                            To ensure production-grade security, Afribase projects feature a built-in **10-minute inactivity logout**. Sessions are automatically invalidated if no user interaction is detected.
                        </Step>
                    </div>
                </div>
            </section>

            <Callout type="tip">
                Leverage our <code>useAuthInactivity()</code> hook in your React applications to automatically handle session expiration and redirect users to the sign-in page.
            </Callout>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={24} />
                    <h2 className="text-2xl font-black text-white tracking-tight">Global Policies</h2>
                </div>

                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Organize users into **User Groups** and assign global permissions that dictate access across all services (Database, Storage, Edge Functions).</p>

                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Key size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white tracking-tight">Access Control (RBAC)</h4>
                            <p className="text-xs text-zinc-500 font-medium">Fine-grained Role Based Access Control for your entire organization.</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                        Learn More
                    </button>
                </div>
            </section>
        </div>
    );
}
