'use client';

import React from 'react';
import { Users, ShieldCheck, Mail, Key, Lock, Fingerprint } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function AuthDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Users size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Identity & Access</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Mission-Critical <span className="text-emerald-500">Authentication</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Afribase Auth provides a hardened, enterprise-grade authentication solution built on the industry-standard **GoTrue** API. Deploy secure social login, magic links, and multi-factor authentication across your entire organization with zero infrastructure management.
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
                <h2 className="text-2xl font-black text-white tracking-tight">Implementation</h2>

                <div className="space-y-6">
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Afribase provides a strongly-typed interface for managing authentication. Below are the core methods available in our SDKs (JavaScript, Python, Dart).
                    </p>

                    <div className="space-y-4">
                        <Step number="01" title="Sign Up / Sign In">
                            Users can sign up for a new account or sign in with their existing credentials.
                            <div className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                    <CodeBlock code={`// Sign Up
const { data, error } = await afribase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123'
});

// Sign In with Password
const { data, error } = await afribase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
});`} language="typescript" />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                    <CodeBlock code={`# Sign Up
client.auth.sign_up(email="user@example.com", password="securePassword123")

# Sign In with Password
client.auth.sign_in_with_password(email="user@example.com", password="securePassword123")`} language="python" />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                    <CodeBlock code={`// Sign Up
await client.auth.signUp(email: 'user@example.com', password: 'securePassword123');

// Sign In with Password
await client.auth.signInWithPassword(email: 'user@example.com', password: 'securePassword123');`} language="dart" />
                                </div>
                            </div>
                        </Step>

                        <Step number="02" title="Passwordless & OAuth">
                            Send one-time passwords (OTP) or magic links, and handle Social Logins like Google or GitHub.
                            <div className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                    <CodeBlock code={`// Send OTP / Magic Link
await afribase.auth.signInWithOtp({ email: 'user@example.com' });

// Social Login
const { url } = await afribase.auth.signInWithOAuth({ provider: 'google' });`} language="typescript" />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                    <CodeBlock code={`# Send OTP / Magic Link
client.auth.sign_in_with_otp(email="user@example.com")

# Social Login
url = client.auth.sign_in_with_oauth(provider="google")`} language="python" />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                    <CodeBlock code={`// Send OTP / Magic Link
await client.auth.signInWithOtp(email: 'user@example.com');

// Social Login
final url = await client.auth.signInWithOAuth(provider: 'google');`} language="dart" />
                                </div>
                            </div>
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
