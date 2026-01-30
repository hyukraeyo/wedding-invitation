"use client";

import React from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import styles from "./Home.module.scss";
import { Flex, Box, Button } from "@/components/ui";

export function HomeClient() {
    const router = useRouter();

    const handleStart = () => {
        router.push("/setup");
    };

    return (
        <Flex direction="column" align="center" className={styles.container}>
            <Flex direction="column" align="center" justify="center" className={styles.innerMain}>
                {/* Typographic Hero */}
                <Flex direction="column" align="center" className={styles.hero}>
                    <Box className={styles.logo}>
                        <Image
                            src="/logo.png"
                            alt="Banana Wedding"
                            width={140}
                            height={140}
                            priority
                        />
                    </Box>
                    <h1 className={styles.title}>
                        달콤한 시작,<br /><span>바나나웨딩</span>
                    </h1>
                    <p className={styles.description}>
                        유통기한 없는 우리만의 달콤한 이야기,<br />
                        바나나웨딩에서 특별하게 전하세요.
                    </p>
                </Flex>

                {/* Simplified Start Button */}
                <Flex direction="column" align="center" className={styles.actions}>
                    <Button onClick={handleStart}>청첩장 만들기</Button>
                    <p className={styles.hint}>간편하게 만드는 나만의 모바일 청첩장</p>
                </Flex>
            </Flex>

            <Box as="footer" className={styles.footer}>
                <p>© 2026 banana wedding</p>
            </Box>
        </Flex>
    );
}
