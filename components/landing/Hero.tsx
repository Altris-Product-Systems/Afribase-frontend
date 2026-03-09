"use client";

import React from "react";
import Link from "next/link";
import { GridBackground } from "@/components/lightswind/grid-dot-backgrounds";
import { Button } from "@/components/lightswind/button";
import { motion, useScroll, useTransform } from "framer-motion";
import Globe from "@/components/lightswind/globe";

export default function Hero() {
    const { scrollYProgress } = useScroll();

    // Scroll effects for the globe
    const globePhi = useTransform(scrollYProgress, [0, 0.5], [0.6, 3.14]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">
            <GridBackground
                gridSize={59}
                gridColor="rgba(29, 200, 32, 0.16)"
                darkGridColor="rgba(29, 200, 32, 0.16)"
                showFade={false}
                fadeIntensity={50}
                className="w-full h-full bg-black"
            >
                <div className="container mx-auto h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 relative z-20 gap-12 pt-44 lg:pt-0">
                    {/* Left Side: Centered on mobile, Left-aligned on Desktop */}
                    <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-forest/20 border border-forest/30 text-sage text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8"
                        >
                            <span className="w-1.5 h-1.5 bg-sage rounded-full" />
                            <span>Build from the Source</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] md:leading-[1] tracking-tighter mb-8"
                        >
                            Build Backends
                            <br />
                            <span className="text-sage">10x Faster</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-base md:text-lg lg:text-xl text-white/70 max-w-xl mb-12 font-medium leading-[1.6]"
                        >
                            The intelligent platform that generates your entire backend from plain English.
                            Hosted in Africa, built for scale.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
                        >
                            <Link href="/auth/sign-up" className="w-full sm:w-auto group">
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="h-16 px-10 rounded-full bg-forest text-white font-black text-lg relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 w-full border border-forest/50"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Building
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.span>
                                    </span>
                                    {/* Premium Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-sage/0 via-sage/30 to-sage/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                    <div className="absolute -inset-1 bg-forest/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-full" />
                                </Button>
                            </Link>

                            <Link href="/auth/sign-in" className="w-full sm:w-auto">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="h-16 px-10 rounded-full bg-white/5 border border-white/10 text-white font-black text-lg backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 w-full uppercase tracking-widest"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Side: Globe - Hidden on Mobile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ opacity }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="hidden lg:flex flex-1 w-full max-w-[500px] lg:max-w-none aspect-square flex items-center justify-center relative"
                    >
                        {/* Subtle glow behind the globe */}
                        <div className="absolute inset-0 bg-forest/5 rounded-full blur-[100px]" />
                        <Globe
                            className="w-full h-full"
                            baseColor="#8BA888" // Sage
                            glowColor="#1A3B2E" // Forest
                            markerColor="#4A6B5B" // Moss
                            theta={0.1}
                            phi={globePhi}
                            scale={1.2}
                            autoRotate={true}
                            autoRotateSpeed={0.002}
                        />
                    </motion.div>
                </div>
            </GridBackground>
        </section>
    );
}
