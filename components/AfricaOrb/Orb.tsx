'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface OrbProps {
    scrollOffset: number;
}

export default function Orb({ scrollOffset }: OrbProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.ShaderMaterial>(null);

    const [mapTexture, cloudTexture] = useTexture([
        '/assets/africa-political-map.jpg',
        '/assets/clouds.jpg',
    ]);

    // Visual specifications from user
    const brandColors = {
        primary: '#0066FF',
        secondary: '#FFD700',
        tertiary: '#CD7F32',
    };

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Rotation behavior from spec
            const baseRotationSpeed = 0.001;
            const scrollRotationSpeed = baseRotationSpeed + (scrollOffset * 0.004);
            meshRef.current.rotation.y += scrollRotationSpeed;

            // Position behavior from spec
            // Initial y: 0.5, Target y: -0.8
            const targetY = 0.5 - (scrollOffset * 1.3);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
        }

        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.0005;
            cloudsRef.current.rotation.x += 0.0002;
        }

        if (glowRef.current) {
            glowRef.current.uniforms.scrollPosition.value = scrollOffset;
        }
    });

    return (
        <group>
            {/* Main Orb */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere ref={meshRef} args={[2.5, 64, 64]}>
                    <meshStandardMaterial
                        map={mapTexture}
                        emissive={new THREE.Color(brandColors.primary)}
                        emissiveIntensity={0.2 + scrollOffset * 0.5}
                        roughness={0.4}
                        metalness={0.7}
                    />
                </Sphere>
            </Float>

            {/* Cloud Layer */}
            <Sphere ref={cloudsRef} args={[2.55, 64, 64]}>
                <meshStandardMaterial
                    map={cloudTexture}
                    transparent
                    opacity={0.3}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>

            {/* Atmospheric Glow */}
            <Sphere args={[2.8, 64, 64]}>
                <shaderMaterial
                    ref={glowRef}
                    transparent
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
                    fragmentShader={`
            uniform vec3 color;
            uniform float intensity;
            uniform float scrollPosition;
            varying vec3 vNormal;
            void main() {
              float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              float dynamicIntensity = intensity + (scrollPosition * 2.0);
              gl_FragColor = vec4(color, glow * dynamicIntensity);
            }
          `}
                    uniforms={{
                        color: { value: new THREE.Color(brandColors.primary) },
                        intensity: { value: 0.5 },
                        scrollPosition: { value: 0 },
                    }}
                />
            </Sphere>
        </group>
    );
}
