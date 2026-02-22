'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AFRICA_PATH = "M184.8,42.4c1.1,2,3.3,3.3,5.6,3.3c0.4,0,0.8,0,1.2-0.1c4-1,8.3-0.3,11.8,2s6,5.8,7.1,10.1c1.5,5.6,0.3,11.5-3.3,16.2c-3.6,4.7-9,7.6-14.8,8c-1.6,0.1-3.1,0.5-4.5,1.1c-1.4,0.6-2.6,1.4-3.7,2.5c-1.1,1.1-1.9,2.3-2.5,3.7c-0.6,1.4-1,2.9-1.1,4.5c-0.1,2.6-0.6,5.1-1.6,7.5c-1,2.4-2.4,4.6-4.2,6.4c-1.8,1.8-4,3.2-6.4,4.2c-2.4,1-4.9,1.5-7.5,1.6c-4.5,0.1-8.9,1.6-12.5,4.3c-3.6,2.7-6.2,6.5-7.4,10.7c-0.4,1.4-1.1,2.7-2,3.8c-0.9,1.1-2.1,2-3.4,2.6c-1.3,0.6-2.7,0.9-4.2,1c-1.5,0.1-2.9-0.1-4.3-0.5c-3.2-0.9-6.6-0.8-9.8,0.3c-3.2,1.1-6,3.2-7.9,6c-1.5,2.1-3.6,3.6-6,4.3c-2.4,0.7-4.9,0.7-7.3,0.1c-4.2-1.1-8.5-1.1-12.8,0c-1.3,0.3-2.7,0.5-4.1,0.4c-1.4-0.1-2.7-0.4-4-0.9c-1.3-0.5-2.4-1.2-3.4-2.1c-1-0.9-1.8-1.9-2.4-3.1c-1-1.9-2.5-3.5-4.3-4.6c-1.8-1.1-3.9-1.6-6-1.6c-1.4,0-2.8,0.2-4.1,0.7c-1.3,0.5-2.5,1.2-3.5,2.1c-1,0.9-1.8,2-2.4,3.2s-0.9,2.5-1,3.8c-0.1,5-2.1,9.8-5.6,13.3c-3.5,3.5-8.3,5.5-13.3,5.6c-2.5,0-5,0.6-7.3,1.6c-2.3,1-4.3,2.5-5.9,4.4c-1.3,1.5-3.1,2.6-5.1,3.1c-2,0.5-4.1,0.4-6-0.3c-2.2-0.8-4.6-1-6.9-0.7c-2.3,0.3-4.5,1.3-6.4,2.8c-1.8,1.4-3.3,3.3-4.3,5.4s-1.5,4.4-1.5,6.8c0,2.1-0.3,4.2-1,6.2c-0.7,2-1.8,3.8-3.3,5.3c-1.5,1.5-3.3,2.6-5.3,3.3c-2,0.7-4.1,1-6.2,1c-2,0-4,0.1-5.9,0.5c-1.9,0.4-3.7,1.1-5.4,2.2s-2.9,2.6-3.8,4.3s-1.4,3.6-1.4,5.6c0,2.5-0.9,4.9-2.5,6.8s-3.7,3.3-6.1,4c-1.3,0.3-2.6,0.9-3.7,1.7s-2.1,1.8-2.6,3.1c-0.6,1.2-0.9,2.5-1,3.9c-0.1,1.4,0.1,2.8,0.5,4.1c1,3,0.9,6.2-0.2,9.1s-3,5.2-5.7,6.8c-1.5,0.9-2.8,2.1-3.8,3.6c-1,1.5-1.7,3.1-2,4.8c-0.6,3.4,0.1,6.8,1.9,9.8c1.8,3,4.6,5.3,7.9,6.4c1.1,0.4,2.1,0.6,3.2,0.7s2.2-0.1,3.2-0.4s2-0.8,2.9-1.5c0.9-0.7,1.6-1.5,2.1-2.5c1.6-3.1,4.1-5.6,7.2-7.2c3.1-1.6,6.6-2.1,10.1-1.5c11.9,1.9,24,2.5,36.1,1.9c1,0,2.1,0,3.1,0.1c2.1,0.2,4.1,1,5.8,2.3c3.7,3,8.4,4.6,13.2,4.6c3.2,0,6.3,0.7,9.1,2c2.8,1.3,5.4,3.2,7.4,5.6c1.6,1.9,3.7,3.3,6.1,4s5,0.7,7.4,0c4.1-1.2,8.4-1.3,12.5-0.1c3.5,1,7,2.8,9.8,5.1c2.7,2.2,4.6,5.2,5.5,8.6c0.5,2,1.6,3.7,3.2,5c1.6,1.3,3.5,2,5.6,2c4.8,0.1,9.4,2.2,12.6,5.8c3.2,3.6,5,8.3,4.9,13.1c0,1,0.2,2.1,0.6,3.1s1.1,1.9,1.9,2.6s1.8,1.2,2.8,1.5c1,0.3,2.1,0.4,3.2,0.2c2.8-0.5,5.7-0.3,8.5,0.6s5.2,2.6,7,4.8c1,1.2,2.2,2.2,3.6,2.8c1.4,0.6,3,1,4.5,1.1c1.5,0.1,3.1-0.1,4.5-0.6s2.8-1.2,3.9-2.2c1.9-1.9,4.4-3.1,7.1-3.6s5.4-0.1,7.9,0.9c10.7,4.4,21.8,7.9,33.1,10.4c1.4,0.3,2.7,0.4,4,0.2s2.6-0.6,3.8-1.3s2.1-1.6,2.8-2.7c0.7-1.1,1.1-2.3,1.2-3.6c0.3-4.1,2.1-8,5.1-10.8c3-2.8,7.1-4.2,11.2-3.9c1.4,0.1,2.8-0.1,4.1-0.5s2.5-1.1,3.5-1.9c1-0.8,1.8-1.9,2.4-3c0.6-1.1,0.9-2.4,1-3.6c0.2-3,.9-6,2.3-8.8c1.4-2.8,3.4-5.3,5.8-7.3c1.5-1.3,2.6-3,3.3-4.9c0.7-1.9,0.8-4,0.3-6.1c-0.5-2.4-0.3-4.8,0.5-7.1c0.8-2.3,2.2-4.3,4-5.9c1.8-1.6,4.1-2.6,6.5-2.8c2.4-0.2,4.8,0.3,7,1.5c1.1,0.6,2.3,1,3.6,1.1c1.3,0.1,2.6,0,3.9-0.4c1.3-0.4,2.4-1,3.4-1.9c1-0.9,1.8-2,2.4-3.2c1.4-2.8,3.6-5.2,6.3-6.9c2.7-1.7,5.9-2.5,9.1-2.3c1.4,0.1,2.8,0,4.2-0.3s2.7-1,3.8-1.8s2.1-1.8,2.8-3s1.2-2.5,1.4-3.8c0.6-4.5,2.6-8.7,5.7-11.9c3.1-3.2,7.2-5.3,11.6-5.9c1.2-0.2,2.4-0.6,3.4-1.3s1.9-1.6,2.5-2.6c0.6-1.1,1-2.2,1.2-3.4c0.2-1.2,0.1-2.4-0.2-3.6c-0.8-3.4-0.6-7,0.5-10.2s3.2-6,6.1-8.1c1.2-0.8,2.2-1.9,2.9-3.2s1.1-2.7,1.1-4.1c0.1-2.8,0.9-5.6,2.3-8.1s3.6-4.6,6.1-6.2c1.4-0.9,2.6-2,3.5-3.4s1.6-3,1.8-4.6c0.4-3.4-0.1-6.8-1.5-9.9s-3.7-5.8-6.6-7.8c-1.3-0.9-2.4-2-3.2-3.4c-0.8-1.4-1.3-2.9-1.4-4.5c-0.3-4.1-1.9-8.1-4.6-11.2c-2.7-3.1-6.3-5.2-10.4-6c-1.4-0.3-2.7-0.9-3.8-1.8s-2.1-2-2.7-3.3c-0.6-1.3-1-2.7-1.1-4.1c-0.1-1.4,0.1-2.8,0.5-4.2c1.7-5.6,1.4-11.6-1-16.9c-2.4-5.3-6.6-9.6-11.9-12s-11.3-2.7-16.9-1c-5.6,1.7-10.3,5.3-13.3,10.2c-1,1.5-2.3,2.8-3.8,3.8c-1.5,1-3.2,1.7-5,2c-4.4,1-9.1,0.5-13.2-1.4s-7.5-5-9.6-9c-1-1.9-2.5-3.5-4.2-4.6c-1.8-1.1-3.8-1.7-6-1.7c-5,0-9.8-2-13.3-5.6c-3.5-3.6-5.5-8.4-5.6-13.4c-0.1-4.1-1.3-8.1-3.5-11.6c-2.2-3.5-5.4-6.3-9.2-7.8c-2.4-1-4.9-1.4-7.5-1.4c-2.6,0.1-5.1,0.7-7.4,1.8c-2.3,1.1-4.4,2.7-6,4.7c-1.6,2-2.7,4.3-3.2,6.8L184.8,42.4z";

export default function AfricaMapAnimation() {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-12 overflow-hidden">
            {/* Dynamic Background Noise/Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)] opacity-60" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-soft-light" />
            </div>

            <div className="relative z-10 w-full max-w-2xl aspect-[1/1.1]">
                <svg
                    viewBox="0 0 350 400"
                    className="w-full h-full drop-shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Base Static Shadow Path */}
                    <path
                        d={AFRICA_PATH}
                        className="stroke-white/[0.03]"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Animated Map Outline */}
                    <motion.path
                        d={AFRICA_PATH}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0, 0.5, 0.3],
                            strokeWidth: [1, 2, 1]
                        }}
                        transition={{
                            duration: 4,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            opacity: { duration: 1.5 },
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 2
                        }}
                        stroke="url(#africa-gradient)"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Secondary Faster Drawing Line */}
                    <motion.path
                        d={AFRICA_PATH}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                        transition={{
                            duration: 3,
                            ease: "circInOut",
                            repeat: Infinity,
                            repeatDelay: 3,
                            delay: 1
                        }}
                        stroke="#10b981"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                    />

                    {/* Data Points / Hubs */}
                    <HubPoint cx={90} cy={110} delay={0.2} label="Lagos" />
                    <HubPoint cx={270} cy={130} delay={0.8} label="Nairobi" />
                    <HubPoint cx={180} cy={340} delay={1.4} label="Cape Town" />
                    <HubPoint cx={120} cy={30} delay={2.0} label="Casablanca" />
                    <HubPoint cx={250} cy={50} delay={2.6} label="Cairo" />
                    <HubPoint cx={150} cy={180} delay={3.2} label="Kigali" />

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="africa-gradient" x1="0" y1="0" x2="350" y2="400" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#10b981" />
                            <stop offset="0.5" stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#8b5cf6" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>

                {/* Floating Technical Symbols */}
                <div className="absolute inset-0 pointer-events-none">
                    <FloatingElement delay={0} className="top-[20%] left-[10%] opacity-20"><Database size={24} /></FloatingElement>
                    <FloatingElement delay={1.5} className="bottom-[30%] right-[15%] opacity-20"><Zap size={24} /></FloatingElement>
                    <FloatingElement delay={3} className="top-[40%] right-[10%] opacity-20"><Shield size={24} /></FloatingElement>
                </div>
            </div>

            {/* Brand Text Overlay */}
            <div className="absolute bottom-12 left-12 right-12 z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="glass p-6 rounded-2xl border border-white/10"
                >
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        Connecting the <span className="text-emerald-400">Next Billion</span>
                    </h3>
                    <p className="text-white/50 text-sm font-medium">
                        Join the decentralized foundation for the future of African digital infrastructure.
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
                r="3"
                fill="#10b981"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay, duration: 0.5 }}
            />
            <motion.circle
                cx={cx}
                cy={cy}
                r="8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{
                    delay,
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
                stroke="#10b981"
                strokeWidth="1"
                fill="none"
            />
            <motion.text
                x={cx + 8}
                y={cy + 4}
                initial={{ opacity: 0, x: cx + 15 }}
                animate={{ opacity: 0.3, x: cx + 8 }}
                transition={{ delay: delay + 0.3, duration: 0.8 }}
                className="text-[8px] font-black uppercase tracking-widest fill-white"
            >
                {label}
            </motion.text>
        </g>
    );
}

function FloatingElement({ children, delay, className }: { children: React.ReactNode; delay: number; className: string }) {
    return (
        <motion.div
            className={`absolute ${className} text-emerald-500`}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
                duration: 5,
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
    );
}

function Zap({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    );
}

function Shield({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    );
}
