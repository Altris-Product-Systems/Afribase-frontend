
import React from 'react';

const steps = [
    {
        number: '01',
        title: 'Code & Push',
        description: 'Write your code locally and push it to a GitHub repository.',
    },
    {
        number: '02',
        title: 'Connect & Deploy',
        description: 'Connect your repository to Afriibase and deploy with one click. No extra configuration needed.',
    },
    {
        number: '03',
        title: 'Live & Scale',
        description: 'Your app goes live instantly with automatic scaling and global CDN distribution.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-brand-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">
                        how it works
                    </p>
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                        shippin to the cloud?
                    </h2>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-10 left-[15%] right-[15%] h-px bg-purple-500/30 hidden md:block shadow-[0_0_15px_rgba(168,85,247,0.4)]" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-8 relative transition-all duration-500 group-hover:border-purple-500/50 group-hover:scale-110">
                                    <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-lg font-black text-zinc-400 group-hover:text-white transition-colors">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px] font-medium">
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
