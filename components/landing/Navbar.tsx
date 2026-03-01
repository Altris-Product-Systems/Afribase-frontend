"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/lightswind/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent"
            )}
        >
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 shrink-0">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <span className="text-black font-black text-xl">A</span>
                    </div>
                    <span className="text-lg md:text-xl font-black text-white tracking-tighter uppercase hidden min-[450px]:block">
                        Afribase
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#features" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="/projects" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                        Projects
                    </Link>
                    <Link href="/dashboard" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                </div>

                <div className="flex items-center space-x-1 md:space-x-4">
                    <Link href="/auth/sign-in" className="hidden min-[380px]:block">
                        <Button variant="ghost" className="text-white hover:bg-white/10 font-bold px-3 py-1 text-xs md:text-sm">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                        <Button className="bg-white text-black hover:bg-white/90 font-bold px-4 md:px-6 py-2 text-[10px] md:text-sm rounded-full whitespace-nowrap">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
