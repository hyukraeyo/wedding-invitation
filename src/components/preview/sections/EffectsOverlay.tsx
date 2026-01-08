'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Particle {
    id: number;
    style: React.CSSProperties;
    pathIndex?: number;
    color?: string;
    animationClass?: string;
}

// Simple and iconic leaf paths (Generic, Maple, Oak) - Fits 0 0 24 24


// New cherry blossom components
// New cherry blossom components
const CherryBlossomDefs = () => (
    <svg width="0" height="0" className="absolute hidden">
        <defs>
            <filter id="blur-soft">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <linearGradient id="gradient-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD0E0" />
                <stop offset="100%" stopColor="#F8B8D0" />
            </linearGradient>
        </defs>
    </svg>
);

const CHERRY_BLOSSOM_VARIANTS = [
    // Variant 1: Outlined
    () => (
        <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <g transform="translate(10, 0) scale(0.7, 1)">
                <path d="M10 32C10 18 26 6 42 6C58 6 62 22 62 34C62 50 46 62 30 62C14 62 10 46 10 32Z" fill="#F8B8D0" opacity="0.7" />
                <path d="M32 10C40 10 54 24 54 36C54 48 40 58 32 58C24 58 10 48 10 36C10 24 24 10 32 10Z" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.3" />
            </g>
        </svg>
    ),
    // Variant 2: Detailed Petal
    () => (
        <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <g transform="scale(0.5333)">
                <path
                    d="M62 12 C48 24, 34 44, 34 64 C34 84, 48 103, 62 108 C74 102, 92 84, 92 60 C92 40, 76 22, 62 12 Z M62 18 C67 30, 66 48, 58 62 C54 69, 51 74, 48 78"
                    fill="#F7B6C7"
                />
                <path
                    d="M60 18 C50 28, 40 46, 40 64 C40 80, 50 96, 60 104"
                    stroke="#FFD7E2"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.8"
                    fill="none"
                />
                <path
                    d="M62 12 C59 16, 56 20, 54 25"
                    stroke="#EFA1B8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.9"
                    fill="none"
                />
            </g>
        </svg>
    ),
    // Variant 3: New Radial Gradient Petal
    () => (
        <svg viewBox="0 0 140 220" className="w-full h-full overflow-visible">
            <defs>
                <radialGradient id="grad-new-petal" cx="45%" cy="35%" r="75%" fx="45%" fy="35%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor="#fff5f8" />
                    <stop offset="100%" stopColor="#ff9eaa" />
                </radialGradient>
            </defs>
            <path d="M 70 220 Q 15 160 35 70 Q 55 15 95 35 Q 140 75 120 160 Q 100 210 70 220 Z" fill="url(#grad-new-petal)" />
        </svg>
    ),
    // Variant 4: Rotated Petal with Dual Gradients (User Provided)
    () => (
        <svg viewBox="0 0 120 180" className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id="petal1_g" x1="20" y1="20" x2="95" y2="170" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FFF6FA" />
                    <stop offset="0.5" stopColor="#FFD2DE" />
                    <stop offset="1" stopColor="#F5A8C3" />
                </linearGradient>

                <radialGradient id="petal1_h" cx="42" cy="55" r="85" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
                    <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.10" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
            </defs>

            <g transform="rotate(18 60 90)">
                <path d="M78 8
                 C99 20 112 48 109 82
                 C106 118 82 156 52 170
                 C26 182 10 160 12 124
                 C15 78 38 28 60 12
                 C68 6 74 6 78 8 Z"
                    fill="url(#petal1_g)" />
                <path d="M78 8
                 C99 20 112 48 109 82
                 C106 118 82 156 52 170
                 C26 182 10 160 12 124
                 C15 78 38 28 60 12
                 C68 6 74 6 78 8 Z"
                    fill="url(#petal1_h)" />
            </g>
        </svg>
    )
];

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
                // Reduced size as requested (approx 16px to 28px)
                const size = 16 + Math.random() * 12;
                const animationType = getRandomItem(['animate-fall-tumbling', 'animate-fall-sway', 'animate-fall-diagonal']);
                newParticles.push({
                    id: i,
                    pathIndex: Math.floor(Math.random() * CHERRY_BLOSSOM_VARIANTS.length),
                    color: getRandomItem(PETAL_COLORS),
                    animationClass: animationType,
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
        }

        setParticles(newParticles);
    }, [theme.effect]);

    if (!mounted || theme.effect === 'none') return null;

    return (
        <div className={
            theme.effectOnlyOnMain
                ? "absolute top-0 left-0 w-full h-[100vh] z-[20] pointer-events-none overflow-hidden"
                : "sticky top-0 left-0 w-full z-[100] h-0 pointer-events-none overflow-visible"
        }>
            <div className={`absolute top-0 left-0 w-full ${theme.effectOnlyOnMain ? 'h-full' : 'h-screen overflow-hidden'}`}>
                {theme.effect === 'cherry-blossom' && <CherryBlossomDefs />}

                {theme.effect === 'snow' && particles.map(p => (
                    <div key={p.id} className="absolute bg-white rounded-full animate-fall" style={p.style} />
                ))}

                {theme.effect === 'cherry-blossom' && particles.map(p => {
                    const Variant = CHERRY_BLOSSOM_VARIANTS[p.pathIndex ?? 0] || CHERRY_BLOSSOM_VARIANTS[0];
                    const Comp = Variant as React.ElementType; // Cast to fix TS error
                    return (
                        <div key={p.id} className={`absolute ${p.animationClass || 'animate-fall-sway'}`} style={{ ...p.style }}>
                            <Comp />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
