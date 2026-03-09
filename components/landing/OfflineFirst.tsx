"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Database, WifiOff } from "lucide-react";

export default function OfflineFirst() {
    return (
        <section className="py-24 bg-brand-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-sage text-[10px] uppercase font-bold tracking-widest mb-6"
                        >
                            <span>Offline Sync</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1]"
                        >
                            Works Where <br />
                            <span className="text-forest">Others Don&apos;t</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/60 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Full functionality offline. Automatic sync when you&apos;re back online.
                            Built for African connectivity with CRDT-based sync.
                            Your users never lose data, even on the go.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto lg:mx-0">
                            {[
                                {
                                    icon: <WifiOff size={24} className="text-forest" />,
                                    title: "Offline Ready",
                                    text: "Your app keeps working everywhere."
                                },
                                {
                                    icon: <RefreshCcw size={20} className="text-forest" />,
                                    title: "Auto-Sync",
                                    text: "Resilient data synchronization."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                                >
                                    <div className="p-2 rounded-lg bg-forest/10">
                                        {item.icon}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                                        <p className="text-white/50 text-xs leading-relaxed">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square w-full max-w-[500px] mx-auto border border-white/5 rounded-3xl overflow-hidden bg-white/5 flex items-center justify-center p-12"
                        >
                            {/* Abstract Offline to Online visualization */}
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-forest/5 blur-3xl opacity-50" />
                            <div className="flex flex-col items-center space-y-8">
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        y: [0, -10, 0]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="p-6 rounded-2xl bg-forest/20 text-sage"
                                >
                                    <Database size={64} />
                                </motion.div>
                                <div className="h-24 w-px bg-gradient-to-b from-sage to-transparent" />
                                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                                    <RefreshCcw size={32} className="text-white/20" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
