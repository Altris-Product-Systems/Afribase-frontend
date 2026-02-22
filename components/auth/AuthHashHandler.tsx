'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthHashHandler() {
    const router = useRouter();

    useEffect(() => {
        // If we land on the home page with an access token in the hash,
        // redirect to the specialized callback page which handles everything.
        if (window.location.hash && window.location.hash.includes('access_token=')) {
            router.push(`/auth/callback${window.location.hash}`);
        }
    }, [router]);

    return null;
}
