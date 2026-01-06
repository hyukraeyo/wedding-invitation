import React, { useEffect, useState } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Particle {
    id: number;
    style: React.CSSProperties;
}

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
            for (let i = 0; i < 25; i++) {
                const size = 10 + Math.random() * 12;
                newParticles.push({
                    id: i,
                    style: {
                        left: `${Math.random() * 100}%`,
                        top: `-${size}px`,
                        fontSize: `${size}px`,
                        animationDuration: `${5 + Math.random() * 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.7
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
                        animationDelay: Math.random() * 3 + 's',
                        boxShadow: '0 0 4px rgba(255,255,255,0.8)'
                    }
                });
            }
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticles(newParticles);
    }, [theme.effect]);

    if (!mounted || theme.effect === 'none') return null;

    return (
        <div className={`absolute inset-0 pointer-events-none z-20 overflow-hidden ${theme.effectOnlyOnMain ? 'h-[400px]' : 'h-full'}`}>

            {/* Snow */}
            {theme.effect === 'snow' && particles.map(p => (
                <div key={p.id} className="absolute bg-white rounded-full animate-fall" style={p.style} />
            ))}

            {/* Cherry Blossom */}
            {theme.effect === 'cherry-blossom' && particles.map(p => (
                <div key={p.id} className="absolute text-pink-200 animate-float-sway" style={p.style}>
                    🌸
                </div>
            ))}

            {/* Leaves */}
            {theme.effect === 'leaves' && particles.map(p => (
                <div key={p.id} className="absolute text-amber-700/60 animate-float-sway" style={p.style}>
                    🍂
                </div>
            ))}

            {/* Mist (Babys-breath) */}
            {theme.effect === 'babys-breath' && (
                <div className="absolute inset-0 bg-white/10 animate-pulse-slow backdrop-blur-[1px]">
                    {particles.map(p => (
                        <div key={p.id} className="absolute bg-white rounded-full opacity-60 animate-pulse" style={p.style} />
                    ))}
                </div>
            )}
        </div>
    );
}
