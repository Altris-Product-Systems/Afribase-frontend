"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Globe from "@/components/lightswind/globe";
import { GridBackground } from "@/components/lightswind/grid-dot-backgrounds";

export default function GlobeSection() {
    const { scrollYProgress } = useScroll();

    // Parallax and movement effects for the globe
    const globePhi = useTransform(scrollYProgress, [0.1, 0.6], [0.6, 6.28]);
    const globeScale = useTransform(scrollYProgress, [0.1, 0.4], [0.8, 1.2]);
    const opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.5, 0.6], [0, 1, 1, 0]);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-brand-background flex items-center justify-center">
            <GridBackground
                gridSize={60}
                gridColor="rgba(255, 255, 255, 0.03)"
                darkGridColor="rgba(255, 255, 255, 0.03)"
                showFade={true}
                fadeIntensity={40}
                className="w-full h-full"
            >
                <div className="container mx-auto h-full flex items-center justify-center relative z-20">
                    <motion.div
                        style={{
                            opacity,
                            scale: globeScale
                        }}
                        className="w-full max-w-[800px] aspect-square flex items-center justify-center relative"
                    >
                        {/* Dramatic Glow behind the white globe */}
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-[120px]" />

                        <Globe
                            className="w-full h-full"
                            baseColor="#FFFFFF" // White
                            glowColor="#FFFFFF" // White glow
                            markerColor="#FFFFFF" // White markers
                            theta={0.2}
                            phi={globePhi}
                            scale={1.2}
                            autoRotate={true}
                            autoRotateSpeed={0.001}
                        />
                    </motion.div>

                    <motion.div
                        style={{ opacity }}
                        className="absolute bottom-10 left-0 w-full text-center"
                    >
                        <h2 className="text-white/20 text-8xl md:text-[12rem] font-black pointer-events-none select-none uppercase tracking-tighter">
                            A Global Network
                        </h2>
                    </motion.div>
                </div>
            </GridBackground>
        </section>
    );
}
