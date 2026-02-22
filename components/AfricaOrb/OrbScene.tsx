'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { Environment, Preload } from '@react-three/drei';
import Orb from './Orb';
import Particles from './Particles';

export default function OrbScene() {
    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = winScroll / height;
            setScrollOffset(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-screen pointer-events-none z-0">
            <Canvas
                shadows
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    {/* Lighting based on spec */}
                    <ambientLight intensity={0.5} color="#404040" />

                    <pointLight
                        position={[5, 5, 5]}
                        intensity={1.5}
                        color="#FFD700"
                    />

                    <pointLight
                        position={[-5, 3, 5]}
                        intensity={1.2}
                        color="#3B82F6"
                    />

                    <directionalLight
                        position={[1, 2, 1]}
                        intensity={0.8}
                    />

                    <Orb scrollOffset={scrollOffset} />
                    <Particles count={2000} />

                    <Environment preset="night" />
                </Suspense>
                <Preload all />
            </Canvas>
        </div>
    );
}
