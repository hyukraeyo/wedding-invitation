'use client';

import { ArrowRight, CheckCircle2, Images, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import styles from './Home.module.scss';

const FEATURE_ITEMS = [
  {
    title: '3분 완성 제작',
    description: '복잡한 설정 없이 핵심 정보만 입력하면 모바일 청첩장을 빠르게 완성할 수 있습니다.',
    icon: <CheckCircle2 size={30} aria-hidden="true" />,
  },
  {
    title: '감각적인 이미지 구성',
    description: '사진, 문구, 순서를 자유롭게 배치해 두 사람만의 분위기를 자연스럽게 담아냅니다.',
    icon: <Images size={30} aria-hidden="true" />,
  },
  {
    title: '간편한 공유',
    description:
      '완성된 링크를 카카오톡과 메신저에 바로 공유해 하객에게 빠르게 전달할 수 있습니다.',
    icon: <Share2 size={30} aria-hidden="true" />,
  },
] as const;

export function HomeClient() {
  return (
    <div className={styles.container}>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <div className={styles.heroContent}>
          <h1 id="home-hero-title">
            가장 완벽한 시작을 위하여,
            <br />
            <span>바나나웨딩</span>
          </h1>
          <p>
            모바일 청첩장, 바나나 웨딩에서 3분 만에 완성하세요.
            <br />
            감각적인 디자인과 편리한 기능을 담았습니다.
          </p>
          <Button
            asChild
            variant="hero"
            size="lg"
            radius="full"
          >
            <Link href="/setup" aria-label="모바일 청첩장 제작 시작하기">
              무료로 만들기 <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className={styles.mockupWrapper} aria-hidden="true">
          <div className={styles.mockup}>
            <div className={styles.mockupScreen}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupTitle}>
                  <h3>
                    Wedding
                    <br />
                    Invitation
                  </h3>
                  <p>Hyun & Jiwoo</p>
                </div>
              </div>
              <div className={styles.mockupBody}>
                <div className={`${styles.line} ${styles.long}`} />
                <div className={`${styles.line} ${styles.short}`} />
                <div
                  className={`${styles.line} ${styles.long}`}
                  style={{ marginTop: '1rem', opacity: 0.5 }}
                />
                <div className={`${styles.line} ${styles.short}`} style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.features}`}
        aria-labelledby="home-features-title"
      >
        <h2 id="home-features-title">모바일 청첩장 제작을 더 쉽게</h2>
        <p className={styles.subtitle}>
          결혼식 준비에 집중할 수 있도록 제작부터 공유까지 필요한 기능을 간결하게 제공합니다.
        </p>
        <div className={styles.grid}>
          {FEATURE_ITEMS.map((item) => (
            <article key={item.title} className={styles.featureCard}>
              <div className={styles.iconWrapper} aria-hidden="true">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.cta}`} aria-labelledby="home-cta-title">
        <h2 id="home-cta-title">지금 바로 우리만의 청첩장을 시작하세요</h2>
        <p>회원가입 후 바로 제작을 시작하고, 링크 하나로 하객에게 전달할 수 있습니다.</p>
        <div className={styles.buttonGroup}>
          <Button asChild size="lg" radius="full">
            <Link href="/setup">청첩장 만들기</Link>
          </Button>
          <Button asChild variant="outline" size="lg" radius="full">
            <Link href="/privacy">개인정보 처리방침</Link>
          </Button>
        </div>
      </section>

      <footer className={styles.footer} aria-label="바나나웨딩 안내">
        <nav className={styles.links} aria-label="주요 페이지 링크">
          <Link href="/setup">청첩장 시작하기</Link>
          <Link href="/login">로그인</Link>
          <Link href="/privacy">개인정보 처리방침</Link>
        </nav>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Banana Wedding. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
