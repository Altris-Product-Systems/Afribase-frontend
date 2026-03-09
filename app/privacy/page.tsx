'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0c0c0e] text-zinc-400 selection:bg-emerald-500/30">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center group">
                        <img src="/AFR.png" alt="Afribase Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md" />
                    </Link>
                    <Link href="/auth/sign-in" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">
                        Back to Sign In
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-zinc-500">Last updated: March 1, 2026</p>
                </div>

                <div className="space-y-12 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Contact information (email address)</li>
                            <li>Authentication credentials (password hashes)</li>
                            <li>Project configuration and metadata</li>
                            <li>Usage data and logs</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. How We Use Information</h2>
                        <p className="mb-4">
                            We use the collected information to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Authenticate users and protect account security.</li>
                            <li>Send technical notices, updates, and support messages.</li>
                            <li>Detect and prevent fraudulent or illegal activity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Data Sharing and Disclosure</h2>
                        <p className="mb-4">
                            We do not sell your personal data. We may share information with third-party service providers who perform services for us, or to comply with legal obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
                        <p className="mb-4">
                            We implement industry-standard measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Your Choices</h2>
                        <p className="mb-4">
                            You can access and update your account information through the Afribase dashboard. You may also request deletion of your account and associated data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Contact Information</h2>
                        <p className="mb-4">
                            For privacy-related inquiries, please contact our data protection team at <span className="text-emerald-400">privacy@afribase.io</span>.
                        </p>
                    </section>
                </div>

                <footer className="mt-20 pt-8 border-t border-white/5">
                    <p className="text-xs text-zinc-600">
                        &copy; 2026 Afribase Systems. All rights reserved.
                    </p>
                </footer>
            </main>
        </div>
    );
}
