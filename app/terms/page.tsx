'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0c0c0e] text-zinc-400 selection:bg-emerald-500/30">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                            <span className="text-black font-black text-lg italic">A</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Afribase</span>
                    </Link>
                    <Link href="/auth/sign-in" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">
                        Back to Sign In
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-zinc-500">Last updated: March 1, 2026</p>
                </div>

                <div className="space-y-12 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing or using Afribase, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
                        <p className="mb-4">
                            Afribase provides infrastructure services for the Global South, including database management, authentication, and edge computing solutions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. User Responsibilities</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You must provide accurate information when creating an account.</li>
                            <li>You are responsible for maintaining the security of your account and credentials.</li>
                            <li>You agree not to use the service for any illegal or unauthorized purposes.</li>
                            <li>You must comply with all local laws regarding online conduct and acceptable content.</li>
                        </ul> Section 3 content.
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Usage Policies</h2>
                        <p className="mb-4">
                            We aim to provide a high-quality service for all users. We reserve the right to suspend or terminate accounts that violate our fair use policies or engage in abusive behavior.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Modifications to Service</h2>
                        <p className="mb-4">
                            Afribase reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, please contact us at <span className="text-emerald-400">legal@afribase.io</span>.
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
