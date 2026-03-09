"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Code2 } from "lucide-react";

export default function AIFeatures() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-forest/20 blur-[60px] rounded-full group-hover:bg-forest/40 transition-colors" />

                            <div className="flex items-center space-x-3 mb-6">
                                <Terminal size={20} className="text-white/40" />
                                <div className="text-[10px] uppercase font-black tracking-widest text-white/40">AI Generator</div>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex items-start space-x-3 text-white/60">
                                    <span className="text-forest shrink-0">prompt&gt;</span>
                                    <span>Build me a logistics platform with real-time tracking, auth, and fleet management.</span>
                                </div>
                                <div className="pl-12 space-y-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 }}
                                        className="text-sage"
                                    >✓ Initializing schema for 'logistics_db'...</motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.0 }}
                                        className="text-sage"
                                    >✓ Generating Auth rules for 'drivers' and 'clients'...</motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.5 }}
                                        className="text-white font-bold"
                                    >✓ Backend ready in 4.2 seconds.</motion.div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <div className="h-2 w-24 bg-forest/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-forest"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1.5 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 order-1 lg:order-2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-sage text-[10px] uppercase font-bold tracking-widest mb-6"
                        >
                            <Sparkles size={12} className="text-sage" />
                            <span>AI Native</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1]"
                        >
                            Your AI <br />
                            <span className="text-forest">Backend Engineer</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/60 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                        >
                            Don&apos;t write code. Describe it. Type &quot;Build me a logistics platform&quot;
                            and watch Afribase generate production-ready databases,
                            APIs, and auth rules in seconds.
                        </motion.p>

                        <div className="flex items-center space-x-6 justify-center lg:justify-start grayscale opacity-50">
                            {/* Visual tech icons represent AI generated results */}
                            <Code2 size={24} className="text-white" />
                            <div className="h-4 w-px bg-white/10" />
                            <div className="text-xs font-black text-white uppercase tracking-[0.2em]">Next.js</div>
                            <div className="text-xs font-black text-white uppercase tracking-[0.2em]">React Native</div>
                            <div className="text-xs font-black text-white uppercase tracking-[0.2em]">Flutter</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
