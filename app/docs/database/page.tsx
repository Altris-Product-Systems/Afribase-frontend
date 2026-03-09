'use client';

import React from 'react';
import { Database, Terminal, Search, ExternalLink, ShieldAlert, Cpu } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function DatabaseDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Database size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Persistence Layer</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Elastic <span className="text-emerald-500">PostgreSQL</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Every Afribase project comes with a dedicated, high-performance PostgreSQL instance. We automatically generate a secure, unified REST API via **PostgREST**, allowing you to interact with your data directly from the client with zero backend code.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Core Tooling</h2>

                <div className="space-y-4">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 group">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <Terminal size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white tracking-tight">SQL Editor</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-medium">The built-in SQL Editor allows you to write and execute raw SQL queries directly from the Afribase Dashboard with full IntelliSense support.</p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="text-[10px] font-black text-zinc-600 border border-white/5 bg-white/5 px-2 py-0.5 rounded-full uppercase">Autocomplete</span>
                                    <span className="text-[10px] font-black text-zinc-600 border border-white/5 bg-white/5 px-2 py-0.5 rounded-full uppercase">Save Queries</span>
                                    <span className="text-[10px] font-black text-zinc-600 border border-white/5 bg-white/5 px-2 py-0.5 rounded-full uppercase">History</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 group">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <Search size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white tracking-tight">Table Explorer</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-medium">A visual interface for managing your data without writing SQL. Insert, update, and manage rows via a professional spreadsheet-like UI.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white tracking-tight">Advanced Scaling</h2>
                    <Cpu className="text-zinc-700" size={24} />
                </div>

                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Afribase databases are hosted on high-performance infrastructure, ensuring your project remains fast and responsive at any scale.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            Automatic Backups
                        </h4>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">Daily backups and point-in-time recovery (PITR) to protect your infrastructure against data loss.</p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            Connection Pooling
                        </h4>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">Integrated PgBouncer allows you to handle thousands of simultaneous connections without performance degradation.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-emerald-500" size={24} />
                    <h2 className="text-2xl font-black text-white tracking-tight">Row Level Security (RLS)</h2>
                </div>

                <p className="text-sm text-zinc-400 font-medium leading-relaxed">The cornerstone of Afribase infrastructure is database-level security. Row Level Security allows you to define policies that restrict access to data based on user identity.</p>

                <CodeBlock code={`-- Enable RLS for a specific table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy for users to see only their own row
CREATE POLICY "Users can see only their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);`} language="sql" />

                <Callout type="warning">
                    Always enable RLS for production project tables. Without RLS, your data may be exposed to the public internet via the Data API.
                </Callout>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Application Integration</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Query your database from any supported platform using our official client libraries.</p>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript / TypeScript</h4>
                        <CodeBlock code={`const { data, error } = await afribase
  .from('posts')
  .select('*')
  .eq('id', '1');`} language="typescript" />
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                        <CodeBlock code={`data = client.from_("posts").select("*").eq("id", "1").execute()`} language="python" />
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                        <CodeBlock code={`final response = await client.from('posts').select('*').eq('id', 1).execute();`} language="dart" />
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-center p-12 border-t border-white/5">
                <a href="/docs/auth" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Next: Authentication</span>
                    <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
            </div>
        </div>
    );
}
