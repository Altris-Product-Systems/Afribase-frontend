'use client';

import React from 'react';
import { HardDrive, Upload, Shield, Layers, Zap, Radio } from 'lucide-react';
import { CodeBlock, Callout, Step } from '@/components/DocsComponents';

export default function StorageDocsPage() {
    return (
        <div className="space-y-12 pb-32">
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <HardDrive size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">Object Storage</span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter mb-4 animate-gelatinous-in">
                    Enterprise <span className="text-emerald-500">Asset Storage</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                    Store and serve massive digital assets with our S3-compatible object storage. Automatically optimized by a global CDN, Afribase Storage provides lightning-fast delivery for images, videos, and documents across the continent.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Storage Infrastructure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tighter">Unified S3 Access</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">Afribase Storage is fully S3-compatible, allowing you to use existing tools and libraries to manage your files with enterprise-grade interoperability.</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 group">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Radio size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tighter">African CDN Nodes</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">Static assets are cached at the edge across our regional nodes, ensuring your users in Lagos or Cairo receive content with minimal latency.</p>
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
                        <CodeBlock code={`const { data, error } = await afribase.storage
  .from('avatars')
  .upload('profiles/avatar-1.png', file);`} language="typescript" />
                    </Step>

                    <Step number="03" title="Generate Public Link">
                        Retrieve a high-speed public URL for your media assets stored in public buckets.
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                <CodeBlock code={`const { data } = afribase.storage.from('avatars').getPublicUrl('avatar-1.png');`} language="typescript" />
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code={`url = client.storage.from_("avatars").get_public_url("avatar-1.png")`} language="python" />
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart</h4>
                                <CodeBlock code={`final url = client.storage.from('avatars').getPublicUrl('avatar-1.png');`} language="dart" />
                            </div>
                        </div>
                    </Step>

                    <Step number="04" title="Transform & Sign">
                        Optimize images on the fly or generate temporary signed URLs for private files.
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">JavaScript</h4>
                                <CodeBlock code={`// Generate a signed URL valid for 60 seconds
const { data, error } = await afribase.storage.from('docs').createSignedUrl('private.pdf', 60);

// Optimize image via CDN transformations
const { data: img } = afribase.storage.from('avatars').getPublicUrl('user.png', {
  transform: { width: 200, height: 200, resize: 'cover' }
});`} language="typescript" />
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Python</h4>
                                <CodeBlock code={`# Signed URL
signed_url = client.storage.from_("docs").create_signed_url("private.pdf", expires_in=60)

# Image Transform
url = client.storage.from_("avatars").get_public_url("user.png", transform={"width": 200})`} language="python" />
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dart</h4>
                                <CodeBlock code={`// Signed URL
final signedUrl = await client.storage.from('docs').createSignedUrl('private.pdf', expiresIn: 60);

// Image Transform
final url = client.storage.from('avatars').getPublicUrl('user.png',
  transform: TransformOptions(width: 200, height: 200, resize: 'cover')
);`} language="dart" />
                            </div>
                        </div>
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
