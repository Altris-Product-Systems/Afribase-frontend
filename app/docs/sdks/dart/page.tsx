'use client';

import React from 'react';
import { Smartphone, Monitor, Globe, Database, Zap, HardDrive } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function DartSdkPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Zap size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Client Libraries</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Dart & <span className="text-emerald-500">Flutter</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    The official Dart and Flutter client for Afribase. Ideal for cross-platform mobile, web, and desktop development.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Installation</h2>
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Add the SDK to your <code>pubspec.yaml</code> file:
                    </p>
                    <CodeBlock code={`dependencies:
  afribase: ^0.2.0`} language="yaml" />
                    <CodeBlock code="flutter pub get" language="bash" />
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Initialization</h2>
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                        Initialize the client with your Project URL and Anonymous API Key.
                    </p>
                    <CodeBlock code={`import 'package:afribase/afribase.dart';

final client = AfribaseClient(
  'https://your-project.useafribase.app', 
  'your-anon-key'
);`} language="dart" />
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Common Operations</h2>

                <div className="space-y-10">
                    <Step number="01" title="Authentication">
                        <CodeBlock code={`final signInRes = await client.auth.signInWithPassword(
  email: 'user@example.com', 
  password: 'securePassword123'
);
print("Access Token: \${signInRes.session?.accessToken}");`} language="dart" />
                    </Step>

                    <Step number="02" title="Database Queries">
                        <p className="mb-4">Call <code>.execute()</code> at the end of the query chain to execute the HTTP request.</p>
                        <CodeBlock code={`final data = await client.from('posts')
    .select('*')
    .eq('id', 1)
    .execute();`} language="dart" />
                    </Step>

                    <Step number="03" title="Realtime Support">
                        <CodeBlock code={`final channel = client.channel('room-general');

channel.onBroadcast('message', (payload) {
  print('Received broadcast: \$payload');
});

channel.subscribe();`} language="dart" />
                    </Step>
                </div>
            </section>

            <Callout type="tip">
                In Flutter, call <code>client.dispose();</code> when your client is no longer needed (e.g., when a widget is disposed) to close websocket connections gracefully.
            </Callout>
        </div>
    );
}
