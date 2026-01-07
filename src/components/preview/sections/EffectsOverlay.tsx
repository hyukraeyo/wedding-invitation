'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Particle {
    id: number;
    style: React.CSSProperties;
    pathIndex?: number;
    color?: string;
}

// Simple and iconic leaf paths (Generic, Maple, Oak) - Fits 0 0 24 24
const SINGLE_LEAF_PATHS = [
    "M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z", // Generic Leaf
    "M12 2L9.5 7H4L6.5 11L4 16L9 14.5L12 19L15 14.5L20 16L17.5 11L20 7H14.5L12 2Z", // Distinct Maple Leaf
    "M19.66,9.63c-0.61-0.64-1.6-0.37-1.89-0.39c0.46-0.86,0.68-2.07-0.06-2.69c-0.59-0.5-1.57-0.24-1.85-0.25c0.32-0.86,0.34-2.04-0.41-2.58C13.93,2.59,12.77,5.43,12.4,5.97c-0.27-1.87-2.64-2.45-3.39-0.72c-0.32,0.75,0.09,1.68,0.44,2.35c-0.9-0.07-2.03-0.28-2.5,0.63c-0.4,0.78,0.12,1.81,0.65,2.45c-0.95,0.38-1.97,0.63-1.76,1.85c0.15,0.88,1.32,1.15,2.05,1.18c-0.25,1.72,1.72,2.54,2.87,1.51c0.35,1.29,0.74,3.19,0.63,4.62c-0.04,0.53,1.72,0.53,1.76,0c0.11-1.43,0.49-3.34,0.84-4.62c1.15,1.03,3.12,0.21,2.87-1.51c0.72-0.03,1.89-0.3,2.05-1.18C19.36,11.09,18.96,10.91,19.66,9.63z" // Oak Leaf
];

// Soft petal paths for natural cherry blossom effect
const CHERRY_PETAL_PATHS = [
    "M12,21.35L10.55,20.03C5.4,15.36,2,12.27,2,8.5C2,5.41,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.08C13.09,3.81,14.76,3,16.5,3C19.58,3,22,5.41,22,8.5c0,3.77-3.4,6.86-8.55,11.53L12,21.35z", // Heart-like petal
    "M12,22c4.97,0,9-4.03,9-9c0-4.97-9-13-9-13S3,8.03,3,13C3,17.97,7.03,22,12,22z", // Teardrop petal
    "M12,20c4.42,0,8-3.58,8-8-8s-8,3.58-8,8C4,16.42,7.58,20,12,20z" // Simple oval petal
];

const LEAF_COLORS = ['#d97706', '#b45309', '#a16207', '#ca8a04']; // Autumn colors
const PETAL_COLORS = ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6']; // Soft pinks

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)] as T;
}

export default function EffectsOverlay() {
    const { theme } = useInvitationStore();
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const newParticles: Particle[] = [];

        if (theme.effect === 'snow') {
            for (let i = 0; i < 40; i++) {
                const depth = Math.random();
                const size = 3 + depth * 5;
                const opacity = 0.4 + depth * 0.5;
                const duration = 3 + (1 - depth) * 4;
                newParticles.push({
                    id: i,
                    style: {
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 100 + 10}%`,
                        opacity: opacity,
                        animationDuration: `${duration}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        filter: `blur(${depth < 0.3 ? 0 : depth * 2}px)`
                    }
                });
            }
        } else if (theme.effect === 'cherry-blossom') {
            for (let i = 0; i < 40; i++) {
                const size = 10 + Math.random() * 8;
                newParticles.push({
                    id: i,
                    pathIndex: Math.floor(Math.random() * CHERRY_PETAL_PATHS.length),
                    color: getRandomItem(PETAL_COLORS),
                    style: {
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 100 + 10}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDuration: `${5 + Math.random() * 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.5 + Math.random() * 0.4
                    }
                });
            }
        } else if (theme.effect === 'leaves') {
            for (let i = 0; i < 35; i++) {
                const size = 18 + Math.random() * 12;
                newParticles.push({
                    id: i,
                    pathIndex: Math.floor(Math.random() * SINGLE_LEAF_PATHS.length),
                    color: getRandomItem(LEAF_COLORS),
                    style: {
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 100 + 20}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDuration: `${6 + Math.random() * 6}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.6 + Math.random() * 0.4
                    }
                });
            }
        } else if (theme.effect === 'forsythia') {
            for (let i = 0; i < 30; i++) {
                const size = 12 + Math.random() * 12;
                newParticles.push({
                    id: i,
                    style: {
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 100 + 10}%`,
                        fontSize: `${size}px`,
                        animationDuration: `${5 + Math.random() * 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.7 + Math.random() * 0.3
                    }
                });
            }
        } else if (theme.effect === 'babys-breath') {
            for (let i = 0; i < 50; i++) {
                newParticles.push({
                    id: i,
                    style: {
                        width: Math.random() * 4 + 'px',
                        height: Math.random() * 4 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDelay: Math.random() * 5 + 's',
                        animationDuration: '3s'
                    }
                });
            }
        }

        setParticles(newParticles);
    }, [theme.effect]);

    if (!mounted || theme.effect === 'none') return null;

    return (
        <div className={`sticky top-0 left-0 w-full z-[100] pointer-events-none overflow-visible ${theme.effectOnlyOnMain ? 'h-0' : 'h-0'}`}>
            <div className={`absolute top-0 left-0 w-full overflow-hidden ${theme.effectOnlyOnMain ? 'h-[600px]' : 'h-screen'}`}>
                {theme.effect === 'snow' && particles.map(p => (
                    <div key={p.id} className="absolute bg-white rounded-full animate-fall" style={p.style} />
                ))}

                {theme.effect === 'cherry-blossom' && particles.map(p => (
                    <div key={p.id} className="absolute animate-fall-sway" style={{ ...p.style, color: p.color }}>
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current transform rotate-45">
                            <path d={CHERRY_PETAL_PATHS[p.pathIndex ?? 0]} />
                        </svg>
                    </div>
                ))}

                {theme.effect === 'leaves' && particles.map(p => (
                    <div key={p.id} className="absolute animate-fall-tumbling" style={{ ...p.style, color: p.color }}>
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                            <path d={SINGLE_LEAF_PATHS[p.pathIndex ?? 0]} />
                        </svg>
                    </div>
                ))}

                {theme.effect === 'forsythia' && particles.map(p => (
                    <div key={p.id} className="absolute text-yellow-400/80 animate-fall-sway" style={p.style}>
                        🌼
                    </div>
                ))}

                {theme.effect === 'babys-breath' && (
                    <div className="absolute inset-0 animate-float-slow backdrop-blur-[0.5px]">
                        {particles.map(p => (
                            <div key={p.id} className="absolute bg-white/40 rounded-full animate-pulse blur-[1px]" style={p.style} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
