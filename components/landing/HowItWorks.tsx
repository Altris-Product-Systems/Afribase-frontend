
import React from 'react';

const steps = [
    {
        number: '01',
        title: 'Architect & Sync',
        description: 'Develop locally and synchronize your codebase with the Afribase core infrastructure.',
    },
    {
        number: '02',
        title: 'Bridge & Provision',
        description: 'Connect your workspace to our mesh for instantaneous instance deployment and environment setup.',
    },
    {
        number: '03',
        title: 'Orchestrate & Scale',
        description: 'Go live across the edge. Automatic cluster scaling and low-latency delivery across all regions.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-24 bg-brand-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">
                        how it works
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                        Ready to Provision?
                    </h2>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-10 left-[15%] right-[15%] h-px bg-purple-500/30 hidden md:block shadow-[0_0_15px_rgba(168,85,247,0.4)]" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 md:mb-8 relative transition-all duration-500 group-hover:border-purple-500/50 group-hover:scale-110">
                                    <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-base md:text-lg font-black text-zinc-400 group-hover:text-white transition-colors">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-white mb-3 md:mb-4 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-zinc-500 text-[13px] md:text-sm leading-relaxed max-w-[280px] font-medium">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
