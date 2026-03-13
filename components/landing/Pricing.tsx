"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Coins, Rocket, Briefcase, LucideIcon } from "lucide-react";
import { Button } from "@/components/lightswind/button";
import { BorderBeam } from "@/components/lightswind/border-beam";
import InteractiveGradient from "@/components/lightswind/interactive-gradient-card";

interface PricingPlan {
    name: string;
    price: string;
    tagline: string;
    features: string[];
    button: string;
    icon: LucideIcon;
    featured?: boolean;
}

const plans: PricingPlan[] = [
    {
        name: "Community",
        price: "Free",
        tagline: "For learning & side projects.",
        features: ["3 Projects", "Unlimited Auth Users", "500MB Database", "1GB Bandwidth"],
        button: "Get Started",
        icon: Rocket,
    },
    {
        name: "Pro",
        price: "$25",
        tagline: "For growing startups.",
        features: ["Unlimited Projects", "Enhanced Auth Security", "8GB Database", "50GB Bandwidth", "SLA Support"],
        button: "Start Pro",
        featured: true,
        icon: Briefcase,
    },
    {
        name: "Enterprise",
        price: "Custom",
        tagline: "For large scale businesses.",
        features: ["High Availability", "White Labeling", "Dedicated Infrastructure", "24/7 Priority Support"],
        button: "Contact Us",
        icon: Coins,
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest mb-6"
                >
                    <span>Flexible Plans</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-2xl lg:text-4xl font-black text-white mb-8 leading-[1.1]"
                >
                    Priced for <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">African Startups</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-white/60 mb-16 max-w-xl mx-auto font-medium"
                >
                    Local currency. No dollar surprises. Pay-as-you-grow.
                    Start free and scale as your business expands.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {plans.map((plan, i) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative h-full"
                            >
                                <InteractiveGradient
                                    color={plan.featured ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.05)"}
                                    glowColor={plan.featured ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.1)"}
                                    className={`h-full relative p-8 rounded-[2rem] border ${plan.featured ? "border-emerald-500/40" : "border-white/10"} flex flex-col bg-zinc-950/50 backdrop-blur-xl transition-all duration-500 overflow-hidden`}
                                >
                                    <BorderBeam
                                        size={300}
                                        duration={10}
                                        delay={i * 2}
                                        colorFrom={plan.featured ? "#10b981" : "#ffffff"}
                                        colorTo={plan.featured ? "#ffffff" : "#666666"}
                                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${plan.featured ? "opacity-100" : ""}`}
                                    />

                                    {plan.featured && (
                                        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-b-2xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.5)] relative z-20">
                                            Popular Choice
                                        </div>
                                    )}

                                    <div className="mb-8 relative z-10 pt-4">
                                        <div className={`w-14 h-14 rounded-2xl ${plan.featured ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-white/5 text-white"} flex items-center justify-center mb-6 border border-white/5`}>
                                            <Icon size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">{plan.name}</h3>
                                        <p className="text-white/40 text-xs font-bold mb-4 uppercase tracking-widest">{plan.tagline}</p>
                                        <div className="flex items-baseline space-x-1 text-white">
                                            <span className="text-2xl font-black tracking-tight">{plan.price}</span>
                                            {plan.price !== "Custom" && <span className="text-white/30 text-sm font-bold lowercase">/mo</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10 flex-grow relative z-10">
                                        {plan.features.map(f => (
                                            <div key={f} className="flex items-start space-x-3 text-sm group/feature">
                                                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.featured ? "bg-emerald-500/20" : "bg-white/10"}`}>
                                                    <Check className={`w-3 h-3 ${plan.featured ? "text-emerald-400" : "text-white/40"}`} />
                                                </div>
                                                <span className="text-white/60 font-medium group-hover/feature:text-white transition-colors">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant={plan.featured ? "default" : "outline"}
                                        className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 relative z-10 ${plan.featured
                                            ? "bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                                            : "border-white/10 text-white hover:bg-white/5 hover:border-white/30"
                                            }`}
                                    >
                                        {plan.button}
                                    </Button>
                                </InteractiveGradient>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

