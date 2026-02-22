'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import africaPaths from '../../lib/africa_paths.json';

const CITY_HUBS = [
    { name: 'Lagos', cx: 468, cy: 344, delay: 2.0 }, // Approx center of Nigeria path
    { name: 'Nairobi', cx: 807, cy: 463, delay: 2.5 }, // Approx center of Kenya path
    { name: 'Cape Town', cx: 522, cy: 999, delay: 3.0 }, // Bottom of SA path
    { name: 'Casablanca', cx: 271, cy: 30, delay: 3.5 }, // Top of Morocco
    { name: 'Cairo', cx: 628, cy: 88, delay: 4.0 }, // Egypt
    { name: 'Kigali', cx: 667, cy: 533, delay: 4.5 }, // Rwanda
];

export default function AfricaMapAnimation() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_70%)] opacity-60" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-soft-light" />
            </div>

            <div className="relative z-10 w-full max-w-2xl aspect-[1/1.1]">
                <svg
                    viewBox="0 0 1000 1100"
                    className="w-full h-full drop-shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="africa-gradient" x1="0" y1="0" x2="1000" y2="1100" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#10b981" />
                            <stop offset="0.5" stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#8b5cf6" />
                        </linearGradient>

                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Draw Every Country Border */}
                    {Object.entries(africaPaths).map(([iso, path], index) => (
                        <React.Fragment key={iso}>
                            {/* Background faint static outline */}
                            <path
                                d={path}
                                className="stroke-white/[0.03]"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Animated drawing line */}
                            <motion.path
                                d={path}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: 1,
                                    opacity: [0, 1, 0.4],
                                }}
                                transition={{
                                    duration: 3,
                                    ease: "easeInOut",
                                    delay: (index % 15) * 0.1, // Stagger drawing in waves
                                    opacity: { duration: 1 },
                                }}
                                stroke="url(#africa-gradient)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter="url(#glow)"
                            />
                        </React.Fragment>
                    ))}

                    {/* Technical Hubs */}
                    {CITY_HUBS.map((hub) => (
                        <HubPoint key={hub.name} {...hub} />
                    ))}

                    {/* Connection Lines (Decorative) */}
                    <ConnectionLine x1={468} y1={344} x2={628} y2={88} delay={4.2} />
                    <ConnectionLine x1={468} y1={344} x2={807} y2={463} delay={4.4} />
                    <ConnectionLine x1={807} y1={463} x2={522} y2={999} delay={4.6} />
                    <ConnectionLine x1={468} y1={344} x2={271} y2={30} delay={4.8} />
                    <ConnectionLine x1={807} y1={463} x2={667} y2={533} delay={5.0} />
                </svg>

                {/* Floating Infrastructure Symbols */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <FloatingElement delay={0} className="top-[20%] left-[10%]"><Database size={32} /></FloatingElement>
                    <FloatingElement delay={1.5} className="bottom-[30%] right-[15%]"><Zap size={32} /></FloatingElement>
                    <FloatingElement delay={3} className="top-[40%] right-[10%]"><Shield size={32} /></FloatingElement>
                </div>
            </div>

            {/* Brand Overlay */}
            <div className="absolute bottom-12 left-12 right-12 z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="glass p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest leading-tight">
                            Afribase Unified Console
                        </h3>
                    </div>
                    <p className="text-white font-medium text-lg mb-1 leading-snug">
                        Distributed Systems. <span className="text-emerald-400">African Borders.</span>
                    </p>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        Deploying infrastructure across 54 nations.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function HubPoint({ cx, cy, delay, label }: { cx: number; cy: number; delay: number; label: string }) {
    return (
        <g>
            <motion.circle
                cx={cx}
                cy={cy}
                r="4"
                fill="#10b981"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay, duration: 0.5 }}
            />
            <motion.circle
                cx={cx}
                cy={cy}
                r="12"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                transition={{
                    delay,
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
                stroke="#10b981"
                strokeWidth="1.5"
                fill="none"
            />
            <motion.text
                x={cx + 15}
                y={cy + 5}
                initial={{ opacity: 0, x: cx + 25 }}
                animate={{ opacity: 0.4, x: cx + 15 }}
                transition={{ delay: delay + 0.3, duration: 0.8 }}
                className="text-[12px] font-black uppercase tracking-[0.3em] fill-white pointer-events-none"
            >
                {label}
            </motion.text>
        </g>
    );
}

function ConnectionLine({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
    return (
        <motion.line
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#10b981"
            strokeWidth="0.5"
            strokeDasharray="4,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay, duration: 1.5 }}
        />
    );
}

function FloatingElement({ children, delay, className }: { children: React.ReactNode; delay: number; className: string }) {
    return (
        <motion.div
            className={`absolute ${className} text-emerald-500`}
            animate={{
                y: [0, -40, 0],
                rotate: [0, 15, -15, 0],
                opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
                duration: 6,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
}

function Database({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
    );
}

function Zap({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    );
}

function Shield({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    );
}
