"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    Database,
    Lock,
    Code2,
    HardDrive,
    Zap,
    Box,
    Table2,
    CheckCircle2,
    GitMerge
} from "lucide-react";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/lightswind/border-beam";
import InteractiveGradient from "@/components/lightswind/interactive-gradient-card";

const features = [
    {
        title: "Postgres Database",
        description: "Every project is a full Postgres database, the world's most trusted relational database.",
        icon: <Database className="w-6 h-6" />,
        className: "md:col-span-2 md:row-span-1 lg:col-span-2",
        color: "#10b981", // Emerald
        glow: "rgba(16, 185, 129, 0.2)",
        details: [
            "100% portable",
            "Built-in Auth with RLS",
            "Easy to extend"
        ],
        image: (
            <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-center justify-center opacity-10 pointer-events-none">
                <Database size={180} strokeWidth={0.5} className="text-emerald-500" />
            </div>
        )
    },
    {
        title: "Authentication",
        description: "Add user sign ups and logins, securing your data with Row Level Security.",
        icon: <Lock className="w-6 h-6" />,
        color: "#f43f5e", // Rose
        glow: "rgba(244, 63, 94, 0.2)",
        className: "md:col-span-1",
    },
    {
        title: "Edge Functions",
        description: "Easily write custom code without deploying or scaling servers.",
        icon: <Code2 className="w-6 h-6" />,
        color: "#8b5cf6", // Violet
        glow: "rgba(139, 92, 246, 0.2)",
        className: "md:col-span-1",
    },
    {
        title: "Storage",
        description: "Store, organize, and serve large files, from videos to images.",
        icon: <HardDrive className="w-6 h-6" />,
        color: "#0ea5e9", // Sky Blue
        glow: "rgba(14, 165, 233, 0.2)",
        className: "md:col-span-1",
    },
    {
        title: "Realtime",
        description: "Build multiplayer experiences with real-time data synchronization.",
        icon: <Zap className="w-6 h-6" />,
        color: "#f59e0b", // Amber
        glow: "rgba(245, 158, 11, 0.2)",
        className: "md:col-span-1",
    },
    {
        title: "Vector",
        description: "Integrate your favorite ML-models to store, index and search vector embeddings.",
        icon: <Box className="w-6 h-6" />,
        color: "#ec4899", // Pink
        glow: "rgba(236, 72, 153, 0.2)",
        className: "md:col-span-1",
    },
    {
        title: "Data APIs",
        description: "Instant ready-to-use Restful APIs.",
        icon: <Table2 className="w-6 h-6" />,
        color: "#14b8a6", // Teal
        glow: "rgba(20, 184, 166, 0.2)",
        className: "md:col-span-1",
    },

];

export default function Features() {
    return (
        <section className="py-12 md:py-24 bg--brand-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-10 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black text-white mb-4"
                    >
                        Everything You Need to Build <span className="text-sage">Modern Apps</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-white/60 max-w-2xl mx-auto font-medium"
                    >
                        Authentication, database, realtime, storage, and AIall integrated,
                        all hosted in Africa.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min md:auto-rows-[280px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 shadow-sm hover:shadow-2xl hover:shadow-black/50 transition-all duration-500",
                                feature.className
                            )}
                        >
                            <InteractiveGradient
                                color={feature.glow}
                                glowColor={feature.glow}
                                className="w-full h-full p-6 md:p-8 flex flex-col items-start text-left bg-transparent border-none"
                                hoverOnly={true}
                                intensity={100}
                                backgroundColor="transparent"
                            >
                                <div className="relative z-10 h-full flex flex-col">
                                    <div
                                        className="mb-6 p-3 rounded-2xl transition-all duration-300"
                                        style={{
                                            backgroundColor: `${feature.color}20`,
                                            color: feature.color
                                        }}
                                    >
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sage transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    <p className="text-white/60 font-medium text-sm leading-relaxed mb-6">
                                        {feature.description}
                                    </p>

                                    {feature.details && (
                                        <div className="mt-auto space-y-2">
                                            {feature.details.map((detail, idx) => (
                                                <div key={idx} className="flex items-center space-x-2 text-xs font-bold text-white/80">
                                                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: feature.color }} />
                                                    <span>{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Moving Beam of Light */}
                                <BorderBeam
                                    size={250}
                                    duration={8}
                                    delay={index * 1.5}
                                    colorFrom={feature.color}
                                    colorTo="#FFFFFF"
                                    borderThickness={2}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    glowIntensity={2}
                                />

                                {feature.image}
                            </InteractiveGradient>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
