'use client';

import dynamic from 'next/dynamic';

// Use dynamic import for Three.js components to avoid SSR issues
const OrbScene = dynamic(() => import('./OrbScene'), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0A]">
            <div className="text-blue-500 animate-pulse font-sans text-xl tracking-widest">
                LOADING AFRIBASE ORB...
            </div>
        </div>
    ),
});

export default function AfricaOrb() {
    return <OrbScene />;
}
