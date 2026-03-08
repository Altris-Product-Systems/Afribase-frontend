'use client';

import React from 'react';
import { HardDrive, Upload, Folder, Shield, Globe, Layers } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function StorageDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <HardDrive size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Object Store</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Global <span className="text-emerald-500">Storage</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Afribase Storage is high-performance file storage for any digital asset. Store, serve, and transform media with built-in security and global distribution.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Buckets & Organization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Folder size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2">Logical Containers</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">Buckets are high-level containers for your media and files. Group files logically by application, user, or project requirements.</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2">Edge Caching</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">Every asset uploaded to Afribase is automatically distributed across our global CDN for ultra-fast, low-latency delivery to users.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-black text-white tracking-tight">Integrating Storage</h2>
                <div className="space-y-8">
                    <Step number="01" title="Create a Bucket">
                        Initialize a new bucket via the dashboard and set its core privacy rules.
                    </Step>

                    <Step number="02" title="Upload an Image">
                        Use our SDK to securely upload files from your user's devices.
                        <CodeBlock code={`import { storage } from '@/lib/afribase';

const { data, error } = await storage
  .from('avatars')
  .upload('profiles/avatar-1.png', file);`} language="typescript" />
                    </Step>

                    <Step number="03" title="Generate Public Link">
                        Retrieve a high-speed public URL for your media assets.
                        <CodeBlock code={`const { publicUrl } = storage
  .from('avatars')
  .getPublicUrl('profiles/avatar-1.png');`} language="typescript" />
                    </Step>
                </div>
            </section>

            <Callout type="info">
                Buckets can be marked as **Public** for assets intended for everyone, or **Private** to protect sensitive user documents using Row Level Security.
            </Callout>

            <section className="space-y-8 border-t border-white/5 pt-12">
                <div className="flex items-center gap-3">
                    <Shield className="text-emerald-500" size={24} />
                    <h2 className="text-2xl font-black text-white tracking-tight">Fine-grained Security</h2>
                </div>

                <p className="text-sm text-zinc-400 font-medium leading-relaxed">Control who can read and write files using **Storage Roles**. You can define specific permissions for different user levels or automated services.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Viewer</div>
                        <p className="text-[10px] text-zinc-600 font-bold">Read-only access to specific buckets.</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Editor</div>
                        <p className="text-[10px] text-zinc-600 font-bold">Upload and manage files within a bucket.</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Admin</div>
                        <p className="text-[10px] text-zinc-600 font-bold">Full control over bucket configuration and data.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
