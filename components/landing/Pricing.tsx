"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Coins, Rocket, Briefcase } from "lucide-react";
import { Button } from "@/components/lightswind/button";

const plans = [
    {
        name: "Community",
        price: "Free",
        tagline: "For learning & side projects.",
        features: ["3 Projects", "Unlimited Auth Users", "500MB Database", "1GB Bandwidth"],
        button: "Get Started",
        icon: <Rocket />,
    },
    {
        name: "Pro",
        price: "$25",
        tagline: "For growing startups.",
        features: ["Unlimited Projects", "Enhanced Auth Security", "8GB Database", "50GB Bandwidth", "SLA Support"],
        button: "Start Pro",
        featured: true,
        icon: <Briefcase />,
    },
    {
        name: "Enterprise",
        price: "Custom",
        tagline: "For large scale businesses.",
        features: ["High Availability", "White Labeling", "Dedicated Infrastructure", "24/7 Priority Support"],
        button: "Contact Us",
        icon: <Coins />,
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
                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-sage text-[10px] uppercase font-bold tracking-widest mb-6"
                >
                    <span>Flexible Plans</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1]"
                >
                    Priced for <span className="text-forest">African Startups</span>
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
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-8 rounded-3xl border ${plan.featured ? "border-forest/50 bg-forest/5" : "border-white/10 bg-white/5"} flex flex-col`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-forest text-white text-[10px] font-black uppercase tracking-widest">
                                    Popular Choice
                                </div>
                            )}
                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-2xl ${plan.featured ? "bg-forest/20 text-sage" : "bg-white/10 text-white"} flex items-center justify-center mb-6`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">{plan.name}</h3>
                                <p className="text-white/40 text-xs font-medium mb-4">{plan.tagline}</p>
                                <div className="flex items-baseline space-x-1 text-white">
                                    <span className="text-3xl font-black">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-white/30 text-sm font-bold lowercase">/mo</span>}
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-grow">
                                {plan.features.map(f => (
                                    <div key={f} className="flex items-start space-x-3 text-sm">
                                        <Check className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                                        <span className="text-white/60 font-medium">{f}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.featured ? "default" : "outline"}
                                className={`w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${plan.featured
                                        ? "bg-forest text-white hover:shadow-xl hover:shadow-forest/20"
                                        : "border-white/10 text-white hover:bg-white/5"
                                    }`}
                            >
                                {plan.button}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
