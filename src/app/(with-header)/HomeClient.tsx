'use client';

import React from 'react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import styles from './Home.module.scss';
import { Button } from '@/components/ui';

export function HomeClient() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/setup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerMain}>
        {/* Typographic Hero */}
        <div className={styles.hero}>
          <h1 className={styles.title}>
            달콤한 시작,
            <br />
            <span>바나나웨딩</span>
          </h1>
          <p className={styles.description}>
            유통기한 없는 우리만의 달콤한 이야기,
            <br />
            바나나웨딩에서 특별하게 전하세요.
          </p>
        </div>

        {/* Simplified Start Button */}
        <div className={styles.actions}>
          <Button onClick={handleStart}>청첩장 만들기</Button>
        </div>
      </div>

      <div className={styles.footer}>
        <p>© 2026 banana wedding</p>
      </div>
    </div>
  );
}
