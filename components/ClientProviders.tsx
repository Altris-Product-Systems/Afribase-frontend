'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import AuthProvider from "@/components/AuthProvider";
import GlobalLoaderProvider from "@/components/ui/GlobalLoaderProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <GlobalLoaderProvider>
                {children}
                <Toaster
                    position="bottom-right"
                    containerStyle={{
                        zIndex: 9999,
                    }}
                    toastOptions={{
                        style: {
                            background: '#18181b',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderRadius: '12px'
                        },
                    }}
                />
            </GlobalLoaderProvider>
        </AuthProvider>
    );
}
