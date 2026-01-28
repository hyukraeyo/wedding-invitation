"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./Home.module.scss";

export function HomeClient() {
    const router = useRouter();

    const handleStart = () => {
        router.push("/setup");
    };

    return (
        <div className={styles.container}>
            <div className={styles.innerMain}>
                {/* Typographic Hero */}
                <div className={styles.hero}>
                    <div className={styles.logo}>
                        <Image
                            src="/logo.png"
                            alt="Banana Wedding"
                            width={140}
                            height={140}
                            priority
                        />
                    </div>
                    <h1 className={styles.title}>
                        달콤한 시작,<br /><span>바나나웨딩</span>
                    </h1>
                    <p className={styles.description}>
                        유통기한 없는 우리만의 달콤한 이야기,<br />
                        바나나웨딩에서 특별하게 전하세요.
                    </p>
                </div>

                {/* Simplified Start Button */}
                <div className={styles.actions}>
                    <button
                        onClick={handleStart}
                        className={styles.submitButton}
                        aria-label="청첩장 만들기 시작"
                    >
                        <span className={styles.text}>청첩장 만들기</span>
                        <ArrowRight className={styles.icon} aria-hidden="true" />
                    </button>
                    <p className={styles.hint}>간편하게 만드는 나만의 모바일 청첩장</p>
                </div>
            </div>

            <footer className={styles.footer}>
                <p>© 2026 banana wedding</p>
            </footer>
        </div>
    );
}
