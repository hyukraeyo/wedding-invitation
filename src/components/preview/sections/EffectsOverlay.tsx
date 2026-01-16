'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, memo } from 'react';
import styles from './EffectsOverlay.module.scss';
import { clsx } from 'clsx';

interface Particle {
    id: number;
    style: React.CSSProperties;
    pathIndex?: number | undefined;
    color?: string | undefined;
    animationClass?: string | undefined;
}

interface EffectsOverlayProps {
    effect: 'none' | 'cherry-blossom' | 'snow';
    effectOnlyOnMain: boolean;
}

const CherryBlossomDefs = () => (
    <svg width="0" height="0" className={styles.hiddenSvg}>
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

const Variant1 = () => (
    <svg viewBox="0 0 64 64" className={styles.svgContainer}>
        <g transform="translate(10, 0) scale(0.7, 1)">
            <path d="M10 32C10 18 26 6 42 6C58 6 62 22 62 34C62 50 46 62 30 62C14 62 10 46 10 32Z" fill="#F8B8D0" opacity="0.7" />
            <path d="M32 10C40 10 54 24 54 36C54 48 40 58 32 58C24 58 10 48 10 36C10 24 24 10 32 10Z" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.3" />
        </g>
    </svg>
);

const Variant2 = () => (
    <svg viewBox="0 0 64 64" className={styles.svgContainer}>
        <g transform="scale(0.5333)">
            <path d="M62 12 C48 24, 34 44, 34 64 C34 84, 48 103, 62 108 C74 102, 92 84, 92 60 C92 40, 76 22, 62 12 Z" fill="#F7B6C7" />
            <path d="M60 18 C50 28, 40 46, 40 64 C40 80, 50 96, 60 104" stroke="#FFD7E2" strokeWidth="3" strokeLinecap="round" opacity="0.8" fill="none" />
        </g>
    </svg>
);

const Variant3 = () => (
    <svg viewBox="0 0 140 220" className={styles.svgContainer}>
        <defs>
            <radialGradient id="grad-new-petal" cx="45%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ff9eaa" />
            </radialGradient>
        </defs>
        <path d="M 70 220 Q 15 160 35 70 Q 55 15 95 35 Q 140 75 120 160 Q 100 210 70 220 Z" fill="url(#grad-new-petal)" />
    </svg>
);

const Variant4 = () => (
    <svg viewBox="0 0 120 180" className={styles.svgContainer}>
        <path d="M78 8 C99 20 112 48 109 82 C106 118 82 156 52 170 C26 182 10 160 12 124 C15 78 38 28 60 12 C68 6 74 6 78 8 Z" fill="#FFD2DE" />
    </svg>
);

const PETAL_COLORS = ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6'];

const EffectsOverlay = memo(({
    effect,
    effectOnlyOnMain
}: EffectsOverlayProps) => {
    const [mounted, setMounted] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || effect === 'none') {
            setParticles([]);
            return;
        }

        const generate = () => {
            const newParticles: Particle[] = [];
            const count = 40;

            for (let i = 0; i < count; i++) {
                if (effect === 'snow') {
                    const depth = Math.random();
                    const size = 3 + depth * 5;
                    newParticles.push({
                        id: i,
                        style: {
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${Math.random() * 100}%`,
                            top: `-${Math.random() * 100 + 10}%`,
                            opacity: 0.4 + depth * 0.5,
                            animationDuration: `${3 + (1 - depth) * 4}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            filter: `blur(${depth < 0.3 ? 0 : depth * 2}px)`
                        }
                    });
                } else if (effect === 'cherry-blossom') {
                    const size = 16 + Math.random() * 12;
                    newParticles.push({
                        id: i,
                        pathIndex: Math.floor(Math.random() * 4),
                        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
                        animationClass: [styles.animateFallTumbling, styles.animateFallSway, styles.animateFallDiagonal][Math.floor(Math.random() * 3)],
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
        };

        const timer = setTimeout(generate, 0);
        return () => clearTimeout(timer);
    }, [effect, mounted]);

    if (!mounted || effect === 'none') return null;

    return (
        <div className={effectOnlyOnMain ? styles.overlayMain : styles.overlayGlobal}>
            <div className={clsx(styles.inner, effectOnlyOnMain ? styles.hFull : styles.hScreen)}>
                {effect === 'cherry-blossom' ? <CherryBlossomDefs /> : null}

                {effect === 'snow' ? (
                    particles.map(p => (
                        <div key={p.id} className={clsx(styles.snowParticle, styles.animateFall)} style={p.style} />
                    ))
                ) : null}

                {effect === 'cherry-blossom' ? (
                    particles.map(p => (
                        <div key={p.id} className={clsx(styles.cherryParticle, p.animationClass || styles.animateFallSway)} style={p.style}>
                            {p.pathIndex === 0 ? <Variant1 /> : null}
                            {p.pathIndex === 1 ? <Variant2 /> : null}
                            {p.pathIndex === 2 ? <Variant3 /> : null}
                            {p.pathIndex === 3 ? <Variant4 /> : null}
                        </div>
                    ))
                ) : null}
            </div>
        </div>
    );
});

EffectsOverlay.displayName = 'EffectsOverlay';

export default EffectsOverlay;
