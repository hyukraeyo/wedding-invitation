import React, { useEffect, useState } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Particle {
    id: number;
    style: React.CSSProperties;
    pathIndex?: number;
    color?: string;
}

// Realistic leaf paths (Maple, Oak, and Broad Maple)
const SINGLE_LEAF_PATHS = [
    "M13.25,2.02c-0.29,1.75-2.26,3.67-4.04,3.06C8.89,4.98,9,3.75,9,2.5c0-1.85-2.11-2.02-2.5-0.25c-0.1,0.45-0.08,0.92,0.06,1.35C5.81,4.36,3.62,5.2,3.31,6.85c-0.23,1.23,0.72,2.06,1.67,2.25c-0.69,0.71-1.35,2.44-0.19,3.83c0.66,0.79,1.86,0.86,2.69,0.38c-0.14,1.44,1.06,3.48,3.23,3.81c-0.58,1.52-0.81,3.42-0.69,5.04c0.04,0.58,1.96,0.58,2,0c0.12-1.63-0.1-3.54-0.69-5.06c2.17-0.33,3.37-2.38,3.23-3.81c0.83,0.48,2.02,0.42,2.69-0.38c1.17-1.39,0.5-3.12-0.19-3.83c0.96-0.19,1.9-1.02,1.67-2.25c-0.31-1.65-2.5-2.48-3.25-3.25c0.14-0.43,0.16-0.9,0.06-1.35C15.36,0.48,13.25,0.65,13.25,2.5C13.25,3.75,13.36,4.98,13.04,5.08C11.26,5.69,13.54,3.77,13.25,2.02z", // Realistic Maple Leaf
    "M18.62,14.63c0.77-0.94,1.15-2.31,0.33-3.08c-0.62-0.58-1.74-0.42-2.06-0.44c0.5-0.94,0.75-2.25-0.06-2.94c-0.65-0.55-1.71-0.27-2.02-0.27c0.35-0.94,0.37-2.23-0.44-2.83c-1.65-1.23-2.92,1.88-3.33,2.46c-0.29-2.04-2.88-2.67-3.69-0.79c-0.35,0.81,0.1,1.83,0.48,2.56c-0.98-0.08-2.21-0.31-2.73,0.69c-0.44,0.85,0.13,1.98,0.71,2.67c-1.04,0.42-2.15,0.69-1.92,2.02c0.17,0.96,1.44,1.25,2.23,1.29c-0.27,1.88,1.88,2.77,3.13,1.65c0.38,1.4,0.81,3.48,0.69,5.04c-0.04,0.58,1.88,0.58,1.92,0c0.12-1.56,0.54-3.65,0.92-5.04c1.25,1.12,3.4,0.23,3.13-1.65c0.79-0.04,2.06-0.33,2.23-1.29C18.29,14.04,17.85,13.84,18.62,14.63z", // Oak Leaf
    "M21.5,10.5 c-1.5,0.5 -2.5,2 -2.5,3.5 c0,0.5 0,1 0.5,1.5 c-1.5,-0.5 -3,-0.5 -4.5,0.5 c-0.5,0.5 -1,1 -1,2 c0,1.5 1,3 2.5,3.5 c-0.5,0.5 -1,1.5 -1,2.5 c0,1 0,2.5 -0.5,3.5 c-0.5,1 -0.5,2 -0.5,2.5 c0,0.5 -0.5,0.5 -0.5,0.5 c0,0 -0.5,0 -0.5,-0.5 c0,-0.5 0,-1.5 -0.5,-2.5 c-0.5,-1 -0.5,-2.5 -0.5,-3.5 c-1,-0.5 -2.5,-0.5 -3.5,0 c-1,0.5 -2,1 -2.5,2 c-0.5,-1.5 -0.5,-3 -0.5,-4.5 c0,-0.5 0,-1 0.5,-1.5 c-1.5,-0.5 -3,-0.5 -4.5,0.5 c-0.5,0.5 -1.5,2 -2.5,2 c0,-1.5 1,-3 2.5,-3.5 c0.5,-0.5 1.5,-0.5 2.5,0 c-0.5,-1.5 -0.5,-3 0.5,-4.5 c0.5,-1 2,-1.5 3.5,-1 c0.5,0.5 1,1 1.5,2 c0.5,-1.5 2,-2.5 3.5,-2.5 c1.5,0 3,1 3.5,2.5 c0.5,-1 1,-1.5 2,-1.5 c1.5,0 3,1 3.5,2.5 Z" // Broad Maple
];

const LEAF_COLORS = ['#d97706', '#b45309', '#a16207', '#ca8a04']; // Autumn colors

export default function EffectsOverlay() {
    const { theme } = useInvitationStore();
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
                        top: `-${size}px`,
                        opacity: opacity,
                        animationDuration: `${duration}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        filter: `blur(${depth < 0.3 ? 0 : depth * 2}px)`
                    }
                });
            }
        } else if (theme.effect === 'cherry-blossom') {
            for (let i = 0; i < 30; i++) {
                const size = 10 + Math.random() * 15;
                newParticles.push({
                    id: i,
                    style: {
                        left: `${Math.random() * 100}%`,
                        top: `-${size}px`,
                        fontSize: `${size}px`,
                        animationDuration: `${4 + Math.random() * 4}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.6 + Math.random() * 0.4
                    }
                });
            }
        } else if (theme.effect === 'leaves') {
            for (let i = 0; i < 35; i++) {
                const size = 12 + Math.random() * 10;
                newParticles.push({
                    id: i,
                    pathIndex: Math.floor(Math.random() * SINGLE_LEAF_PATHS.length),
                    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
                    style: {
                        left: `${Math.random() * 100}%`,
                        top: `-${size}px`,
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
                        top: `-${size}px`,
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

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticles(newParticles);
    }, [theme.effect]);

    if (!mounted || theme.effect === 'none') return null;

    return (
        <div className={`sticky top-0 left-0 w-full z-[100] pointer-events-none overflow-visible ${theme.effectOnlyOnMain ? 'h-0' : 'h-0'}`}>
            <div className={`absolute top-0 left-0 w-full overflow-hidden ${theme.effectOnlyOnMain ? 'h-[600px]' : 'h-screen'}`}>

                {/* Snow */}
                {theme.effect === 'snow' && particles.map(p => (
                    <div key={p.id} className="absolute bg-white rounded-full animate-fall" style={p.style} />
                ))}

                {/* Cherry Blossom */}
                {theme.effect === 'cherry-blossom' && particles.map(p => (
                    <div key={p.id} className="absolute text-pink-200/80 animate-fall-sway" style={p.style}>
                        🌸
                    </div>
                ))}

                {/* Leaves */}
                {theme.effect === 'leaves' && particles.map(p => (
                    <div key={p.id} className="absolute animate-fall-tumbling" style={{ ...p.style, color: p.color }}>
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                            <path d={SINGLE_LEAF_PATHS[p.pathIndex ?? 0]} />
                        </svg>
                    </div>
                ))}

                {/* Forsythia */}
                {theme.effect === 'forsythia' && particles.map(p => (
                    <div key={p.id} className="absolute text-yellow-400/80 animate-fall-sway" style={p.style}>
                        🌼
                    </div>
                ))}

                {/* Mist (Babys-breath) */}
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
