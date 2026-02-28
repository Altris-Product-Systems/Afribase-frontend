"use client";

import React from "react";
import { motion } from "framer-motion";
import { Server, ShieldCheck, Zap } from "lucide-react";

export default function AfricaFirst() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sage/10 border border-sage/20 text-sage text-[10px] uppercase font-bold tracking-widest mb-6"
                        >
                            <span>Africa First</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1]"
                        >
                            Built for Africa. <br />
                            <span className="text-sage">By Developers Who Get It.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/60 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            5ms latency in Lagos, not 300ms. Local compliance built-in.
                            Infrastructure that respects your reality with low-bandwidth optimization
                            and local currency pricing.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto lg:mx-0">
                            {[
                                {
                                    icon: <Zap className="text-sage" />,
                                    title: "Low Latency",
                                    text: "Hosted in Lagos, Nairobi, and Cape Town."
                                },
                                {
                                    icon: <ShieldCheck className="text-sage" />,
                                    title: "Compliance",
                                    text: "NDPR, POPIA, and Kenya DPA built-in."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                                >
                                    <div className="p-2 rounded-lg bg-sage/10">
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
                            className="relative aspect-square w-full max-w-[500px] mx-auto"
                        >
                            {/* Visual representation of Africa/Latency - placeholder or abstract */}
                            <div className="absolute inset-0 bg-forest/20 rounded-full blur-[100px] animate-pulse" />
                            <div className="relative z-10 w-full h-full border border-white/5 rounded-3xl overflow-hidden bg-white/5 flex items-center justify-center backdrop-blur-3xl">
                                <div className="p-12 text-center">
                                    <Server size={120} className="text-sage mx-auto mb-8 opacity-50" />
                                    <div className="space-y-4">
                                        <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-sage"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "95%" }}
                                                transition={{ duration: 2 }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-sage uppercase tracking-widest">Lagos Node Active</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
