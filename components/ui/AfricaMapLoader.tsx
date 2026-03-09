'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import africaPaths from '@/lib/africa_paths.json';

interface AfricaMapLoaderProps {
    isLoading: boolean;
    message?: string;
}

export default function AfricaMapLoader({ isLoading, message = "Initializing..." }: AfricaMapLoaderProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" />

                    <div className="relative w-48 h-48 mb-8">
                        <svg
                            viewBox="0 0 1000 1100"
                            className="w-full h-full"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="loader-gradient" x1="0" y1="0" x2="1000" y2="1100" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#10b981" />
                                    <stop offset="1" stopColor="#3b82f6" />
                                </linearGradient>
                                <filter id="loader-glow">
                                    <feGaussianBlur stdDeviation="15" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {Object.entries(africaPaths).map(([iso, d], index) => (
                                <motion.path
                                    key={iso}
                                    d={d}
                                    stroke="url(#loader-gradient)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: [0, 1, 1],
                                        opacity: [0, 1, 0.4]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: (index % 10) * 0.1,
                                    }}
                                    className="drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                />
                            ))}
                        </svg>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
