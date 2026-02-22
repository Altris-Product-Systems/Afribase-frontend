'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken, getOrganizations } from '@/lib/api';

function CallbackContent() {
    const router = useRouter();

    useEffect(() => {
        // GoTrue (Supabase) returns tokens in the URL hash for implicit flow or PKCE
        const hash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);

        let accessToken = searchParams.get('access_token');

        if (!accessToken && hash) {
            // Parse hash manually if it's there
            const params = new URLSearchParams(hash.substring(1));
            accessToken = params.get('access_token');
        }

        if (accessToken) {
            setAuthToken(accessToken);

            // Check for organizations to decide where to redirect
            const checkAndRedirect = async () => {
                try {
                    const orgs = await getOrganizations();
                    if (orgs && orgs.length > 0) {
                        router.push('/dashboard');
                    } else {
                        router.push('/onboarding');
                    }
                } catch (err) {
                    console.error('Callback: Failed to check organizations', err);
                    router.push('/onboarding');
                }
            };

            // Clear the hash from the URL so tokens don't sit in the address bar
            if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }

            checkAndRedirect();
        } else {
            // No token found, redirect to sign-in
            console.error('Callback: No access token found in URL');
            router.push('/auth/sign-in?error=auth_failed');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0c0c0e] flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center animate-spin">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
            <div className="space-y-2 text-center">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Synchronizing Identity</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Establishing secure connection...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0c0c0e]" />}>
            <CallbackContent />
        </Suspense>
    );
}
