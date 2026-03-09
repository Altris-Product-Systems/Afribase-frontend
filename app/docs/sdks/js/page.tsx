'use client';

import React from 'react';
import { Terminal, Globe, Shield, Database, Zap, HardDrive } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function JsSdkPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Zap size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Client Libraries</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    JavaScript <span className="text-emerald-500">SDK</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    The official JavaScript and TypeScript client for Afribase. This SDK provides a single, unified interface that mimics the popular `supabase-js` API.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Installation</h2>
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Install the Afribase SDK via your preferred package manager:
                    </p>
                    <CodeBlock code="npm install @afribase/afribase-js" language="bash" />
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Initialization</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Initialize the client with your project URL and public anonymous key.
                </p>
                <CodeBlock code={`import { createClient } from '@afribase/afribase-js';

const apiUrl = 'https://your-project.useafribase.app';
const anonKey = 'your-anon-key';

export const afribase = createClient(apiUrl, anonKey);`} language="typescript" />
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Common Operations</h2>

                <div className="space-y-10">
                    <Step number="01" title="Authentication">
                        <p className="mb-4">Handle user sign-ins and sign-ups effortlessly.</p>
                        <CodeBlock code={`// Sign In
const { data, error } = await afribase.auth.signIn({
  email: 'user@example.com',
  password: 'securePassword123!',
});`} language="typescript" />
                    </Step>

                    <Step number="02" title="Database Queries">
                        <p className="mb-4">Query your PostgreSQL database through the auto-generated PostgREST API.</p>
                        <CodeBlock code={`// Fetching Data
const { data, error } = await afribase
  .from('posts')
  .select('*')
  .eq('published', true)
  .limit(10);`} language="typescript" />
                    </Step>

                    <Step number="03" title="Realtime Updates">
                        <p className="mb-4">Listen to database changes in real-time via WebSockets.</p>
                        <CodeBlock code={`const channel = afribase.channel('room:lobby');

channel
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    console.log('New message:', payload.new);
  })
  .subscribe();`} language="typescript" />
                    </Step>
                </div>
            </section>

            <Callout type="tip">
                Afribase responses always return a <code>{`{ data, error }`}</code> tuple object. Always check for errors before processing data.
            </Callout>
        </div>
    );
}
