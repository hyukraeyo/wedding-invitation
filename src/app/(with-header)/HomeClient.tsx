'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Images, CheckCircle2, Share2, ArrowRight } from 'lucide-react';
import styles from './Home.module.scss';
import Link from 'next/link';

export function HomeClient() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/setup');
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            가장 완벽한 시작을 위하여,
            <br />
            <span>바나나웨딩</span>
          </h1>
          <p>
            모바일 청첩장, 바나나 웨딩에서 3분 만에 완성하세요.
            <br />
            감각적인 디자인과 편리한 기능을 담았습니다.
          </p>
          <Button onClick={handleStart} variant="hero" size="lg" radius="full">
            무료로 만들기 <ArrowRight size={20} />
          </Button>
        </div>

        <div className={styles.mockupWrapper}>
          <div className={styles.mockup}>
            <div className={styles.mockupScreen}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupTitle}>
                  <h3>Wedding Invitation</h3>
                  <p>Minji & Junho</p>
                </div>
              </div>
              <div className={styles.mockupBody}>
                <div className={`${styles.line} ${styles.long}`} />
                <div className={`${styles.line} ${styles.long}`} />
                <div className={`${styles.line} ${styles.short}`} />
                <br />
                <div className={`${styles.line} ${styles.long}`} />
                <div className={`${styles.line} ${styles.short}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>완벽한 초대장을 위한 기능</h2>
        <p className={styles.subtitle}>필요한 모든 기능을 가장 심플하게 담았습니다.</p>

        <div className={styles.grid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Images />
            </div>
            <h3>고화질 갤러리</h3>
            <p>
              소중한 순간을 생생하게.
              <br />
              용량 제한 없이 고화질 사진을 담아보세요.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <CheckCircle2 />
            </div>
            <h3>참석 여부 관리</h3>
            <p>
              실시간으로 확인하는 RSVP.
              <br />
              식사 여부와 동행 인원까지 한눈에.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Share2 />
            </div>
            <h3>카카오톡 공유 최적화</h3>
            <p>
              썸네일부터 남다르게.
              <br />
              클릭을 부르는 아름다운 미리보기를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className={styles.themes}>
        <h2>취향에 맞는 테마</h2>

        <div className={styles.grid}>
          <div className={styles.themeCard}>
            <div className={styles.placeholder}>Modern Clean Preview</div>
            <div className={styles.themeInfo}>
              <h3>Modern Clean</h3>
              <p>군더더기 없는 깔끔함</p>
            </div>
          </div>

          <div className={styles.themeCard}>
            <div className={styles.placeholder}>Warm Classic Preview</div>
            <div className={styles.themeInfo}>
              <h3>Warm Classic</h3>
              <p>따뜻하고 우아한 감성</p>
            </div>
          </div>

          <div className={styles.themeCard}>
            <div className={styles.placeholder}>Pure White Preview</div>
            <div className={styles.themeInfo}>
              <h3>Pure White</h3>
              <p>순백의 아름다움</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>
          평생 잊지 못할 시작,
          <br />
          지금 바로 만들어보세요.
        </h2>
        <p>
          회원가입 없이도 디자인을 미리 만들어볼 수 있습니다.
          <br />
          마음에 들면 그때 결정하세요.
        </p>
        <div className={styles.buttonGroup}>
          <Button onClick={handleStart} size="lg">
            지금 바로 시작하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.links}>
          <Link href="#">소개</Link>
          <Link href="#">이용요금</Link>
          <Link href="#">자주 묻는 질문</Link>
          <Link href="#">고객센터</Link>
          <Link href="#">Instagram</Link>
        </div>
        <p className={styles.copyright}>© 2026 Banana Wedding. All rights reserved.</p>
      </footer>
    </div>
  );
}
