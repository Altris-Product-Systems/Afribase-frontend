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
                <div className="container mx-auto h-full flex flex-col lg:flex-row items-center justify-between px-6 relative z-20 gap-12">
                    {/* Left Side: Left-aligned Text */}
                    <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-forest/20 border border-forest/30 text-sage text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            <span className="w-1.5 h-1.5 bg-sage rounded-full" />
                            <span>Built for the African market</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8"
                        >
                            THE NEW STANDARD
                            <br />
                            <span className="text-sage">OF BUSINESS</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/70 max-w-xl mb-12 font-medium leading-relaxed"
                        >
                            Empowering the next generation of African entrepreneurs with
                            enterprise-grade tools for payments, inventory, and growth.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
                        >
                            <Link href="/auth/sign-up" className="w-full sm:w-auto">
                                <Button variant="default" size="lg" className="h-16 px-10 rounded-full bg-forest text-white font-bold text-lg hover:shadow-xl hover:shadow-forest/40 transition-all active:scale-95 w-full">
                                    Start Building
                                </Button>
                            </Link>
                            <Link href="/auth/sign-in" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-2 border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all active:scale-95 w-full">
                                    Sign In
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Side: Globe */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ opacity }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex-1 w-full max-w-[500px] lg:max-w-none aspect-square flex items-center justify-center relative"
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
