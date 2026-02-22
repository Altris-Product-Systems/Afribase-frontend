'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeAuthToken } from '@/lib/api';

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = () => {
        removeAuthToken();
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-primary/80 backdrop-blur-md border-b border-bg-tertiary py-3' : 'bg-transparent py-5'
                }`}
        >
            <nav className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <span className="text-xl font-bold text-text-primary tracking-tight">
                        Afribase
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {['Product', 'Solutions', 'Pricing', 'Docs'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-text-secondary hover:text-brand-secondary transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <button
                            onClick={handleSignOut}
                            className="text-sm font-medium text-text-secondary hover:text-text-primary"
                        >
                            Sign out
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/auth/sign-in"
                                className="text-sm font-medium text-text-secondary hover:text-text-primary"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth/sign-up"
                                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
