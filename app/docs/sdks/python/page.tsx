'use client';

import React from 'react';
import { Terminal, Code, Settings, Database, Activity, HardDrive } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function PythonSdkPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Activity size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Client Libraries</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Python <span className="text-emerald-500">SDK</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    The official Python client for Afribase. Perfect for backend scripts, data pipelines, and Python-based web applications.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Installation</h2>
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Install the SDK using <code>pip</code>:
                    </p>
                    <CodeBlock code="pip install afribase" language="bash" />
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Initialization</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Initialize the client with your Afribase Project URL and Anonymous API Key:
                </p>
                <CodeBlock code={`from afribase import create_client

url = "https://your-project.useafribase.app"
anon_key = "your-anon-key"

client = create_client(url, anon_key)`} language="python" />
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">CRUD Operations</h2>
                <Callout type="info"> Because <code>from</code> is a reserved keyword in Python, the SDK uses <code>from_()</code> to query tables.</Callout>

                <div className="space-y-10">
                    <Step number="01" title="Select Data">
                        <p className="mb-4">All PostgREST queries require calling <code>.execute()</code> at the end of the query chain.</p>
                        <CodeBlock code={`# Select
data = client.from_("posts").select("*").execute()`} language="python" />
                    </Step>

                    <Step number="02" title="Insert Data">
                        <CodeBlock code={`new_post = client.from_("posts").insert({
    "title": "Python SDK", 
    "body": "It's super easy to use."
}).execute()`} language="python" />
                    </Step>

                    <Step number="03" title="Filters">
                        <CodeBlock code={`data = (
    client.from_("products")
    .select("*")
    .eq("category", "electronics")
    .gt("price", 100)
    .execute()
)`} language="python" />
                    </Step>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Realtime Broadcast</h2>
                <CodeBlock code={`channel = client.channel("room-general")

def on_message(payload):
    print("Received broadcast payload:", payload)

channel.on_broadcast("message", callback=on_message)
channel.subscribe()

channel.send_broadcast("message", {"text": "Hello from Python!"})`} language="python" />
            </section>
        </div>
    );
}
