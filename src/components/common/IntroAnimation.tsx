"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import styles from './IntroAnimation.module.scss';

export default function IntroAnimation() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Unmount from DOM after animation completes to prevent z-index issues or blocking interactions
        const timer = setTimeout(() => {
            setShow(false);
        }, 3500); // 3s animation + buffer

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Layer 1: SVG Drawing Animation (Background) */}
                <svg
                    className={styles.svg}
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="intro_gradient" x1="0" y1="100" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="40%" stopColor="#FBC02D" />
                            <stop offset="60%" stopColor="#80C0FF" />
                            <stop offset="100%" stopColor="#4169E1" />
                        </linearGradient>
                    </defs>

                    {/* Refined Heart Path matching Logo Shape */}
                    <path
                        className={styles.path}
                        d="M 100 175 
                           C 20 100 40 40 100 60 
                           C 160 40 180 100 100 175"
                        stroke="url(#intro_gradient)"
                        strokeWidth="35"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.6"
                    />
                </svg>

                {/* Layer 2: Real 3D Logo Image (Fade In) */}
                <div className={styles.logoImage}>
                    <Image
                        src="/logo.png"
                        alt="Logo Animation"
                        width={200}
                        height={200}
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
