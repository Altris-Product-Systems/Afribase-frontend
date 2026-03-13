"use client";

import React from "react";
import { motion } from "framer-motion";
import { Server, ShieldCheck, Zap } from "lucide-react";
import { BorderBeam } from "@/components/lightswind/border-beam";
import InteractiveGradient from "@/components/lightswind/interactive-gradient-card";

export default function AfricaFirst() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest mb-8"
                        >
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Localized Infrastructure</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-2xl lg:text-4xl font-black text-white mb-8 leading-[1.05] tracking-tighter"
                        >
                            Built for Africa. <br />
                            <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">By Developers Who Get It.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-white/50 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                        >
                            5ms latency in Lagos, not 300ms. Local compliance built-in.
                            Infrastructure that respects your reality with low-bandwidth optimization
                            and local currency pricing.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
                            {[
                                {
                                    icon: <Zap size={20} className="text-emerald-400" />,
                                    title: "Low Latency",
                                    text: "Hosted in Lagos, Nairobi, and Cape Town.",
                                    color: "#10b981"
                                },
                                {
                                    icon: <ShieldCheck size={20} className="text-emerald-400" />,
                                    title: "Compliance",
                                    text: "NDPR, POPIA, and Kenya DPA built-in.",
                                    color: "#10b981"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="group relative p-5 rounded-2xl bg-zinc-950/50 border border-white/5 overflow-hidden"
                                >
                                    <BorderBeam
                                        size={150}
                                        duration={6}
                                        colorFrom={item.color}
                                        colorTo="#FFFFFF"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="relative z-10 flex items-start space-x-4">
                                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                                            {item.icon}
                                        </div>
                                        <div className="text-left py-0.5">
                                            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-1.5">{item.title}</h4>
                                            <p className="text-white/40 text-[11px] leading-relaxed font-medium">{item.text}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative group">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square w-full max-w-[550px] mx-auto"
                        >
                            <InteractiveGradient
                                color="rgba(16, 185, 129, 0.15)"
                                glowColor="rgba(16, 185, 129, 0.2)"
                                className="w-full h-full border border-white/10 rounded-[3rem] overflow-hidden bg-zinc-950 flex items-center justify-center backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                                intensity={40}
                            >
                                <BorderBeam
                                    size={600}
                                    duration={15}
                                    colorFrom="#10b981"
                                    colorTo="#FFFFFF"
                                    borderThickness={4}
                                    glowIntensity={2}
                                />

                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                                <div className="p-12 text-center relative z-10">
                                    <div className="relative mb-12 group-hover:scale-105 transition-transform duration-700">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full animate-pulse" />
                                        <Server size={140} strokeWidth={1} className="text-emerald-400 mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]" />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Node Latency</span>
                                                <span className="text-[10px] font-black text-white/40">4.2ms</span>
                                            </div>
                                            <div className="h-1.5 w-64 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: "95%" }}
                                                    transition={{ duration: 2.5, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 py-2.5 px-6 rounded-2xl">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] italic">Lagos Region Active</p>
                                        </div>
                                    </div>
                                </div>
                            </InteractiveGradient>

                            {/* Decorative elements */}
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-1000" />
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-zinc-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-zinc-500/20 transition-colors duration-1000" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

