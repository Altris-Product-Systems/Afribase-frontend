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
                <h1 className="text-2xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Elastic <span className="text-emerald-500">PostgreSQL</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Every Afribase project includes a full, dedicated PostgreSQL instance. We combine the reliability of relational data with the speed of **zero-code API generation** via PostgREST, allowing both developers and no-code creators to build robust backends instantly.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Management Interface</h2>

                <div className="space-y-4">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 group">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <Terminal size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white tracking-tight">Advanced SQL Workbench</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-medium">A robust environment for schema design and complex data manipulation. Our SQL Workbench features intelligent autocomplete, query snippets, and a complete execution history to streamline your database development.</p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="text-[10px] font-black text-emerald-500/50 border border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 rounded-full uppercase tracking-widest">IntelliSense</span>
                                    <span className="text-[10px] font-black text-zinc-600 border border-white/5 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest">Postgres 15+</span>
                                    <span className="text-[10px] font-black text-zinc-600 border border-white/5 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest">Query Profiling</span>
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
                                <h3 className="text-lg font-bold text-white tracking-tight">Visual Schema Explorer</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-medium">Manage your tables, relationships, and raw data via a high-fidelity visual interface. Afribase eliminates the need for external database managers by providing a seamless, spreadsheet-like experience for rapid prototyping.</p>
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
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Query your database from any supported platform using our official client libraries. Note that Python uses <code>from_()</code> to avoid keyword conflicts.</p>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript / TypeScript</h4>
                        <CodeBlock code={`const { data, error } = await afribase
  .from('posts')
  .select('*')
  .eq('published', true)
  .order('created_at', { ascending: false });`} language="typescript" />
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                        <CodeBlock code={`data = client.from_("posts").select("*").eq("published", True).order("created_at", desc=True).execute()`} language="python" />
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                        <CodeBlock code={`final response = await client.from('posts').select('*').eq('published', true).order('created_at', ascending: false).execute();`} language="dart" />
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Database Functions (RPC)</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Execute custom PostgreSQL stored procedures directly from your application logic. This allows you to offload intensive computation to the database layer.</p>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                        <CodeBlock code={`const { data, error } = await afribase.rpc('get_top_users', { limit_count: 10 });`} language="typescript" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                        <CodeBlock code={`result = client.rpc("get_top_users", {"limit_count": 10}).execute()`} language="python" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart</h4>
                        <CodeBlock code={`final result = await client.rpc('get_top_users', {'limit_count': 10}).execute();`} language="dart" />
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
