"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    SiJavascript,
    SiNodedotjs,
    SiNestjs,
    SiPython,
    SiFlutter,
    SiDart,
    SiRust,
    SiGo,
    SiPhp,
    SiLaravel,
    SiTypescript,
    SiReact,
    SiNextdotjs
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const languages = [
    { name: "JavaScript", color: "#F7DF1E", icon: <SiJavascript className="w-12 h-12" /> },
    { name: "Node.js", color: "#339933", icon: <SiNodedotjs className="w-12 h-12" /> },
    { name: "NestJS", color: "#E0234E", icon: <SiNestjs className="w-12 h-12" /> },
    { name: "Python", color: "#3776AB", icon: <SiPython className="w-12 h-12" /> },
    { name: "Dart", color: "#0175C2", icon: <SiDart className="w-12 h-12" /> },
    { name: "Rust", color: "#DEA584", icon: <SiRust className="w-12 h-12" /> },
    { name: "Go", color: "#00ADD8", icon: <SiGo className="w-12 h-12" /> },
    { name: "Java", color: "#007396", icon: <FaJava className="w-12 h-12" /> },
    { name: "Laravel", color: "#FF2D20", icon: <SiLaravel className="w-12 h-12" /> },
    { name: "TypeScript", color: "#007ACC", icon: <SiTypescript className="w-12 h-12" /> },
    { name: "React", color: "#61DAFB", icon: <SiReact className="w-12 h-12" /> },
    { name: "Next.js", color: "#ffffff", icon: <SiNextdotjs className="w-12 h-12" /> },
];

export default function Languages() {
    return (
        <section id="languages" className="py-24 bg--brand-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tighter"
                    >
                        NATIVE SUPPORT FOR <span className="text-sage">EVERY STACK</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto font-medium"
                    >
                        Afribase works with any language and framework. Our client SDKs and
                        auto-generated APIs allow you to build with the tools you already love.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {languages.map((lang, index) => (
                        <motion.div
                            key={lang.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="group relative"
                        >
                            <div
                                className="relative z-10 flex flex-col items-center justify-center p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-500 overflow-hidden min-h-[160px]"
                            >
                                {/* Logo with color transition */}
                                <div
                                    className="mb-4 flex items-center justify-center transition-all duration-500 transform group-hover:scale-110"
                                    style={{ color: "rgba(255, 255, 255, 0.4)" }}
                                >
                                    <div className="group-hover:text-[var(--lang-color)] transition-colors duration-500" style={{ "--lang-color": lang.color } as React.CSSProperties}>
                                        {lang.icon}
                                    </div>
                                </div>

                                <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors duration-500 uppercase tracking-widest text-center mt-auto">
                                    {lang.name}
                                </span>

                                {/* Hover Glow Effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                                    style={{
                                        background: `radial-gradient(circle at center, ${lang.color}20 0%, transparent 70%)`
                                    }}
                                />

                                <div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500"
                                    style={{ backgroundColor: lang.color }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(44,95,45,0.05),transparent_70%)]" />
            </div>
        </section>
    );
}
