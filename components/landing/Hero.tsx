"use client";

import React from "react";
import InteractiveGridBackground from "@/components/lightswind/interactive-grid-background";
import { Button } from "@/components/lightswind/button"; // Assuming it was installed by lightswind init
import { motion } from "framer-motion";
import Globe from "@/components/lightswind/globe";

export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-white-off">
            <InteractiveGridBackground
                gridSize={60}
                gridColor="#E8EEEA" // Subtle sage/gray grid
                effectColor="rgba(26, 59, 46, 0.15)" // Deep forest with opacity
                glow={true}
                glowRadius={30}
                fadeIntensity={10}
                className="w-full h-full"
            >
                <div className="container mx-auto h-full flex flex-col lg:flex-row items-center justify-center px-6 gap-12 relative z-20">
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            <span className="w-1.5 h-1.5 bg-forest rounded-full" />
                            <span>Built for the African market</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-charcoal leading-[0.9] tracking-tighter mb-8"
                        >
                            THE NEW STANDARD
                            <br />
                            <span className="text-forest">OF BUSINESS</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-charcoal/70 max-w-xl mb-12 font-medium leading-relaxed"
                        >
                            Empowering the next generation of African entrepreneurs with
                            enterprise-grade tools for payments, inventory, and growth.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <Button variant="default" size="lg" className="h-16 px-10 rounded-full bg-forest text-white font-bold text-lg hover:shadow-xl hover:shadow-forest/20 transition-all active:scale-95">
                                Start Building
                            </Button>
                            <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-2 border-charcoal/10 text-charcoal font-bold text-lg hover:bg-charcoal/5 transition-all active:scale-95">
                                Request Demo
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex-1 w-full max-w-[500px] lg:max-w-none aspect-square flex items-center justify-center relative"
                    >
                        {/* Glow effect behind the globe */}
                        <div className="absolute inset-0 bg-forest/5 rounded-full blur-[100px]" />
                        <Globe
                            className="w-full h-full"
                            baseColor="#8BA888" // Sage
                            glowColor="#1A3B2E" // Forest
                            markerColor="#4A6B5B" // Moss
                            theta={0.1} // Slight tilt
                            phi={0.6} // Focused on Africa roughly
                            scale={1.2}
                            autoRotate={true}
                            autoRotateSpeed={0.002}
                        />
                    </motion.div>
                </div>
            </InteractiveGridBackground>
        </section>
    );
}
