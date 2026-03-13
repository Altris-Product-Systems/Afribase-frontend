"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Code2 } from "lucide-react";
import { BorderBeam } from "@/components/lightswind/border-beam";

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
                            className="p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden group"
                        >
                            <BorderBeam
                                size={400}
                                duration={12}
                                delay={0}
                                colorFrom="#10b981"
                                colorTo="#FFFFFF"
                                borderThickness={3}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                glowIntensity={3}
                            />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full group-hover:bg-emerald-500/40 transition-colors" />

                            <div className="flex items-center space-x-3 mb-6 relative z-10">
                                <Terminal size={20} className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[10px] uppercase font-black tracking-widest text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">AI Generator</div>
                            </div>

                            <div className="space-y-4 font-mono text-sm relative z-10">
                                <div className="flex items-start space-x-3 text-white/60">
                                    <span className="text-emerald-500 shrink-0 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">prompt&gt;</span>
                                    <span>Build me a logistics platform with real-time tracking, auth, and fleet management.</span>
                                </div>
                                <div className="pl-12 space-y-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 }}
                                        className="text-emerald-400"
                                    >✓ Initializing schema for 'logistics_db'...</motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.0 }}
                                        className="text-emerald-400"
                                    >✓ Generating Auth rules for 'drivers' and 'clients'...</motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.5 }}
                                        className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                    >✓ Backend ready in 4.2 seconds.</motion.div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end relative z-10">
                                <div className="h-2 w-24 bg-emerald-500/20 rounded-full overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <motion.div
                                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1.5 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 order-1 lg:order-2 text-center lg:text-left">

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-2xl lg:text-4xl font-black text-white mb-8 leading-[1.1]"
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
