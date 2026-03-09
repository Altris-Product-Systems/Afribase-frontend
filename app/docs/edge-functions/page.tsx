'use client';

import React from 'react';
import { Zap, Terminal, Code, Activity, Cpu, Share2 } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function EdgeFunctionsDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Zap size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Serverless Execution</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Global <span className="text-emerald-500">Edge Logic</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Deploy your custom server-side logic to our globally distributed network. Built on the modern **Deno** runtime, Afribase Edge Functions provide ultra-low latency, automatic scaling, and native TypeScript support without the overhead of traditional server management.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Deno Runtime</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Edge Functions are built with the modern **Deno** runtime, providing built-in security and adherence to modern Web Standards.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center text-emerald-400">
                            <Code size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">TypeScript First</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Native TypeScript support without the need for complex transpilation or build steps.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center text-emerald-400">
                            <Share2 size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Web Standards</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Support for Fetch API, Streams, and standard URL parsing out of the box.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Development Workflow</h2>
                <div className="space-y-8">
                    <Step number="01" title="Write your Logic">
                        Standard HTTP handler using Deno's native server utilities.
                        <CodeBlock code={`import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { name } = await req.json();
  return new Response(JSON.stringify({ 
    message: \`Hello \${name} from the edge!\` 
  }));
});`} language="typescript" />
                    </Step>

                    <Step number="02" title="Deploy via CLI">
                        Instantly deploy your function to our global infrastructure.
                        <CodeBlock code="afribase functions deploy hello-world" language="bash" />
                    </Step>

                    <Step number="03" title="Invoke from Client">
                        Invoke your serverless function from any client library.
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                <CodeBlock code={`const { data, error } = await afribase.functions.invoke('hello-world', {
  body: { name: 'Afribase User' }
});`} language="typescript" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code={`result = client.functions.invoke("hello-world", body={"name": "Afribase User"})`} language="python" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart / Flutter</h4>
                                <CodeBlock code={`final result = await client.functions.invoke('hello-world', body: {'name': 'Afribase User'});`} language="dart" />
                            </div>
                        </div>
                    </Step>
                </div>
            </section>

            <Callout type="tip">
                Edge Functions can also be triggered by **Database Webhooks**, allowing you to execute logic automatically whenever data changes in your project.
            </Callout>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <div className="flex items-center gap-3">
                    <Activity className="text-emerald-500" size={24} />
                    <h2 className="text-2xl font-black text-white tracking-tight">Real-time Monitoring</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <h4 className="text-sm font-bold text-white">Invocation Logs</h4>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">Stream execution logs directly to your dashboard as they happen. Filter by status code, timestamp, or specific log level.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <h4 className="text-sm font-bold text-white">Performance Metrics</h4>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">Track cold start times, execution duration, and memory usage to optimize your serverless functions.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
