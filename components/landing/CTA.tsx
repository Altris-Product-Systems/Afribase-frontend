"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/lightswind/button";

export default function CTA() {
    return (
        <section className="py-24 bg-brand-background relative overflow-hidden">
            <div className="absolute inset-0 bg-forest/5 blur-3xl rounded-full scale-110 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-16 rounded-[48px] bg-white/[0.03] border border-white/5 backdrop-blur-3xl overflow-hidden relative"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-forest/20 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest/10 blur-[80px] translate-y-1/2 -translate-x-1/2 rounded-full" />

                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-2xl lg:text-4xl font-black text-white mb-8 leading-[1.1]"
                        >
                            Start Building Today
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/60 mb-12 font-medium leading-relaxed"
                        >
                            Free tier includes 3 projects, all features.
                            No credit card required. Join 1,000+ developers
                            already building with Afribase.
                        </motion.p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                            <Link href="/auth/sign-up" className="w-full sm:w-auto">
                                <Button className="h-16 px-12 rounded-full bg-forest text-white font-black text-lg hover:shadow-2xl hover:shadow-forest/30 transition-all hover:scale-105 active:scale-95 w-full uppercase tracking-widest">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/docs" className="w-full sm:w-auto">
                                <Button variant="ghost" className="h-16 px-12 rounded-full border border-white/10 text-white font-black text-lg hover:bg-white/5 transition-all w-full uppercase tracking-widest">
                                    Read Docs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
