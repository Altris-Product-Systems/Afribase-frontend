"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Database, WifiOff } from "lucide-react";
import { BorderBeam } from "@/components/lightswind/border-beam";
import InteractiveGradient from "@/components/lightswind/interactive-gradient-card";

export default function OfflineFirst() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest mb-6"
                        >
                            <span>Offline Sync</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-2xl lg:text-4xl font-black text-white mb-8 leading-[1.1]"
                        >
                            Works Where <br />
                            <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Others Don&apos;t</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/60 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                        >
                            Full functionality offline. Automatic sync when you&apos;re back online.
                            Built for African connectivity with CRDT-based sync.
                            Your users never lose data, even on the go.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto lg:mx-0">
                            {[
                                {
                                    icon: <WifiOff size={24} className="text-emerald-400" />,
                                    title: "Offline Ready",
                                    text: "Your app keeps working everywhere.",
                                    color: "#10b981"
                                },
                                {
                                    icon: <RefreshCcw size={20} className="text-emerald-400" />,
                                    title: "Auto-Sync",
                                    text: "Resilient data synchronization.",
                                    color: "#10b981"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="group relative p-4 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden"
                                >
                                    <BorderBeam
                                        size={200}
                                        duration={8}
                                        colorFrom={item.color}
                                        colorTo="#FFFFFF"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="relative z-10 flex items-start space-x-4">
                                        <div className="p-2 rounded-lg bg-emerald-500/10">
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                                            <p className="text-white/50 text-xs leading-relaxed">{item.text}</p>
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
                            className="relative aspect-square w-full max-w-[500px] mx-auto"
                        >
                            <InteractiveGradient
                                color="rgba(16, 185, 129, 0.2)"
                                className="w-full h-full border border-white/5 rounded-[2.5rem] overflow-hidden bg-zinc-950 flex items-center justify-center p-12"
                                glowColor="rgba(16, 185, 129, 0.3)"
                            >
                                <BorderBeam
                                    size={400}
                                    duration={12}
                                    colorFrom="#10b981"
                                    colorTo="#FFFFFF"
                                    borderThickness={3}
                                />
                                {/* Abstract Offline to Online visualization */}
                                <div className="absolute inset-x-0 top-0 h-1/2 bg-emerald-500/5 blur-3xl opacity-50" />
                                <div className="flex flex-col items-center space-y-8 relative z-10">
                                    <motion.div
                                        animate={{
                                            opacity: [0.3, 1, 0.3],
                                            y: [0, -10, 0],
                                            filter: ["drop-shadow(0 0 0px #10b981)", "drop-shadow(0 0 20px #10b981)", "drop-shadow(0 0 0px #10b981)"]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="p-8 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    >
                                        <Database size={80} strokeWidth={1.5} />
                                    </motion.div>
                                    <div className="h-24 w-px bg-gradient-to-b from-emerald-400 via-emerald-400/50 to-transparent shadow-[0_0_10px_#10b981]" />
                                    <div className="p-6 rounded-full bg-zinc-900 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                                        <RefreshCcw size={40} className="text-white/20 group-hover:text-emerald-400 transition-colors group-hover:animate-spin-slow" />
                                    </div>
                                </div>
                            </InteractiveGradient>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

