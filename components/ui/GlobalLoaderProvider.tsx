'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import AfricaMapLoader from './AfricaMapLoader';

type LoaderContextType = {
    setIsLoading: (loading: boolean, message?: string) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function useLoader() {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a GlobalLoaderProvider');
    }
    return context;
}

export default function GlobalLoaderProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoadingState] = useState(false);
    const [message, setMessage] = useState('Initializing Core');

    // Identify if we are on an auth page
    const isAuthPage = pathname?.includes('/auth/');

    const setIsLoading = React.useCallback((loading: boolean, msg?: string) => {
        if (msg) setMessage(msg);
        setIsLoadingState(loading);
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <LoaderContext.Provider value={{ setIsLoading }}>
            {isMounted && !isAuthPage && pathname !== '/' && (
                <AfricaMapLoader isLoading={isLoading} message={message} />
            )}
            {children}
        </LoaderContext.Provider>
    );
}
