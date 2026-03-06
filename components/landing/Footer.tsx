
import React from 'react';

export default function Footer() {
    return (
        <footer className="py-20 bg-brand-background border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center mb-6">
                            <img src="/AFR.png" alt="Afribase Logo" className="h-10 w-auto object-contain drop-shadow-lg" />
                        </div>
                        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-medium">
                            The high-performance platform for modern applications.
                            Build, scale, and manage your infrastructure with absolute confidence.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                            <li className="hover:text-white transition-colors cursor-pointer">Database</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Authentication</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Storage</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Edge Functions</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Company</h4>
                        <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                            <li className="hover:text-white transition-colors cursor-pointer">About</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Security</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Status</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    <p>© 2026 Afribase. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                        <span className="hover:text-white transition-colors cursor-pointer">GDPR</span>
                    </div>
                </div>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none overflow-hidden h-[300px] flex items-end">
                <h2 className="text-[25vw] font-black leading-none text-white/[0.02] -mb-[5vw] ml-[-2vw] tracking-tighter uppercase italic">
                    Afribase
                </h2>
            </div>
        </footer>
    );
}
