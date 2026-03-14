'use client';

import React from 'react';
import { Terminal, Command, LogIn, Database, Zap, Globe, Shield } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function CLIDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            {/* ── Hero ── */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Terminal size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">CLI Tool</span>
                </div>
                <h1 className="text-2xl md:text-6xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Afribase <span className="text-emerald-500">Command Line</span> Interface
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Manage your African infrastructure directly from your terminal. The Afribase CLI is a <strong>cross-platform native binary</strong> that allows you to deploy edge functions, push database migrations, and manage environments with a single command.
                </p>
            </section>

            {/* ── Installation ── */}
            <section className="space-y-6 pt-6 border-t border-white/5">
                <h2 className="text-lg font-black text-white uppercase tracking-widest">Installation</h2>
                <p className="text-zinc-400">The CLI is written in Go and supports macOS, Linux, and Windows natively.</p>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">macOS</span>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">via Homebrew</h4>
                        </div>
                        <CodeBlock code="brew install afribase/tap/afribase" language="bash" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">Linux</span>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">via Install Script</h4>
                        </div>
                        <CodeBlock code="curl -sSL https://useafribase.app/install.sh | sh" language="bash" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">Windows</span>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">via PowerShell</h4>
                        </div>
                        <CodeBlock code="powershell -Command & { iwr https://useafribase.app/install.ps1 | iex }" language="powershell" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">Any OS</span>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">via Go Toolchain</h4>
                        </div>
                        <CodeBlock code="go install github.com/afribase/cli@latest" language="bash" />
                    </div>
                </div>
            </section>

            {/* ── Getting Started ── */}
            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Getting Started</h2>
                
                <div className="space-y-8">
                    <Step number="01" title="Login">
                        Authenticate the CLI with your Afribase account.
                        <div className="mt-4">
                            <CodeBlock code="afribase login" language="bash" />
                        </div>
                    </Step>

                    <Step number="02" title="List Projects">
                        View all your active projects and their identifiers.
                        <div className="mt-4">
                            <CodeBlock code="afribase projects list" language="bash" />
                        </div>
                    </Step>

                    <Step number="03" title="Init Project">
                        Initialize a new Afribase context in your local directory.
                        <div className="mt-4">
                            <CodeBlock code="afribase init" language="bash" />
                        </div>
                    </Step>
                </div>
            </section>

            {/* ── Command Reference ── */}
            <section className="space-y-12">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase border-b border-white/5 pb-4">Command Reference</h2>

                {/* Authentication */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <LogIn size={20} />
                        <h3 className="text-lg font-black uppercase">Authentication</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase login</code>
                            <p className="text-sm text-zinc-400 mt-2">Starts the interactive login process.</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase logout</code>
                            <p className="text-sm text-zinc-400 mt-2">Removes credentials from your local machine.</p>
                        </div>
                    </div>
                </div>

                {/* Database */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-500">
                        <Database size={20} />
                        <h3 className="text-lg font-black uppercase">Database</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase db push --project PID --file migration.sql</code>
                            <p className="text-sm text-zinc-400 mt-2">Apply a local SQL migration to your remote project.</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase db migrations --project PID</code>
                            <p className="text-sm text-zinc-400 mt-2">List all migration history for a project.</p>
                        </div>
                    </div>
                </div>

                {/* Edge Functions */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-500">
                        <Zap size={20} />
                        <h3 className="text-lg font-black uppercase">Edge Functions</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase functions deploy --project PID --name my-fn --entry index.ts</code>
                            <p className="text-sm text-zinc-400 mt-2">Bundle and deploy a local function to the African edge.</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase functions list --project PID</code>
                            <p className="text-sm text-zinc-400 mt-2">List all deployed functions and their endpoints.</p>
                        </div>
                    </div>
                </div>

                {/* Environment */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-500">
                        <Shield size={20} />
                        <h3 className="text-lg font-black uppercase">Environment</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase env set --project PID --key API_KEY --value "..."</code>
                            <p className="text-sm text-zinc-400 mt-2">Set non-secret configuration variables for your functions.</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10">
                            <code className="text-emerald-400 font-mono text-sm">afribase env list --project PID</code>
                            <p className="text-sm text-zinc-400 mt-2">List all environment variables for a project.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Callout type="tip">
                Running into issues? Use the <code>--help</code> flag on any command to see available flags and subcommands.
            </Callout>
        </div>
    );
}
