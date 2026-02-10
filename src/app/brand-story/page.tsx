import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE_NAME, SITE_NAME_EN, absoluteUrl } from '@/lib/site';
import styles from './MainLanding.module.scss';
import {
  ArrowRight,
  Award,
  Banana,
  ClipboardCheck,
  Heart,
  Images,
  Map as MapIcon,
  MessageCircle,
  Palette,
  PartyPopper,
  Smartphone,
  Sparkles,
  Type,
} from 'lucide-react';

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSeuogdGG71tlsk3wSWH6uT3KuSxaXiF9YMswcJ2V2roREZy-Z3MJ3ADVTDR8ZF6y6yzZ-8maS6RCCAlTW6SqwU1SCU2HGDOWRdN7sY81hWQY8L22Gol5SJFffEUary8L4iL3QJBy4L2XVrwVf-I3rjCB_tOZ4reIz2iwyOskVgrVlyAeHGiBVGjlyzd9ThbtAj8xigOR7NvMl7hByRevQNrRQM6bLl_VEsAyzI82LU0T6DpVN5FPNX3oaGFy0JCeReIxU8HYPwigu';
const GALLERY_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Xv4j1T1By57Iyn4U4K6mjapz1zsIoLTSyKROc-XF1uGwHySZOXkwkE1-hHGBj-_bm6RxlLqi8AhNdC2S-TsFDjxCJgCY0YI0Mh3LMguEbfNGT9lDb3pb74D_hEhbOWZYR7MOCAoFUjPr_oeLYYIuvS2Xry33nSo7MFQvZgpGeiX_xPg6nWgIADyQSDXhsyYXYG8ZoILDTACWUc3E3CCTGblzi5Gl7SfTtagy5KF-3gTm9XsEy1iOAwwzvM80Xh9ZiafV3WGj8mri';

export const metadata: Metadata = {
  title: `브랜드 스토리 | ${SITE_NAME}`,
  description: `${SITE_NAME}의 철학과 모바일 청첩장 제작 경험을 소개합니다.`,
  alternates: {
    canonical: '/brand-story',
  },
  openGraph: {
    title: `브랜드 스토리 | ${SITE_NAME}`,
    description: `${SITE_NAME}의 철학과 모바일 청첩장 제작 경험을 소개합니다.`,
    url: absoluteUrl('/brand-story'),
    siteName: `${SITE_NAME}(${SITE_NAME_EN})`,
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/assets/icons/logo-banana-heart.png',
        width: 800,
        height: 800,
        alt: `${SITE_NAME} 브랜드 스토리`,
      },
    ],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: absoluteUrl('/'),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '브랜드 스토리',
      item: absoluteUrl('/brand-story'),
    },
  ],
};

export default function BrandStoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon} aria-hidden="true">
                <Banana size={24} />
              </div>
              <span className={styles.logoText}>{SITE_NAME}</span>
            </Link>

            <div className={styles.navActions}>
              <Link href="/setup" className={styles.startButton}>
                시작하기
              </Link>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>New Standard</span>
              </div>
              <h1 className={styles.heroTitle}>
                완벽한 시작을 <br />
                위하여
              </h1>
              <p className={styles.heroDesc}>
                토스처럼 간편하고 애플처럼 세련된 모바일 청첩장. 이제 바나나 웨딩에서 가장 아름다운
                시작을 준비하세요.
              </p>
              <div className={styles.heroActionGroup}>
                <Link href="/setup" className={styles.heroPrimaryBtn}>
                  지금 만들기
                </Link>
                <a href="#brand-story-features" className={styles.heroSecondaryBtn}>
                  기능 보기
                </a>
              </div>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <div
                className={styles.heroVisualImage}
                style={{ backgroundImage: `url(${HERO_IMG})` }}
              />
              <div className={styles.heroVisualOverlay} />
            </div>
          </section>

        <section className={styles.trust}>
          <span className={styles.trustLabel}>10,000+ 커플이 선택한 이유</span>
          <div className={styles.trustIcons}>
            <Heart size={24} aria-hidden="true" />
            <Sparkles size={24} aria-hidden="true" />
            <Award size={24} aria-hidden="true" />
            <PartyPopper size={24} aria-hidden="true" />
          </div>
        </section>

        <section id="brand-story-features" className={styles.features}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>고급스러운 디테일</h2>
            <p className={styles.featuresSubtitle}>
              단순한 안내장을 넘어 진심을 전하는 공간이 됩니다.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.bentoCardLarge}>
              <div
                className={styles.bentoCardImage}
                style={{ backgroundImage: `url(${GALLERY_IMG})` }}
              />
              <div className={styles.bentoCardContent}>
                <div className={styles.bentoCardHeader}>
                  <Images size={24} aria-hidden="true" />
                  <h3 className={styles.bentoCardTitle}>고해상도 갤러리</h3>
                </div>
                <p className={styles.bentoCardDesc}>원본 그대로의 감동을 전달하는 선명한 화질</p>
              </div>
            </div>

            <div className={styles.rowGrid}>
              <div className={styles.bentoCard}>
                <div className={cn(styles.bentoCardIconBox, styles.yellow)}>
                  <Type size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.bentoCardTitle}>감성 폰트</h3>
                  <p className={styles.bentoCardDesc}>엄선된 프리미엄 서체</p>
                </div>
              </div>

              <div className={styles.bentoCard}>
                <div className={cn(styles.bentoCardIconBox, styles.blue)}>
                  <ClipboardCheck size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.bentoCardTitle}>실시간 RSVP</h3>
                  <p className={styles.bentoCardDesc}>즉시 확인하는 참석 명단</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.services}>
          <h2 className={styles.servicesTitle}>모든 것을 하나로</h2>
          <div className={styles.serviceList}>
            <div className={styles.serviceItem}>
              <div className={cn(styles.serviceItemIcon, styles.blue)}>
                <Smartphone size={24} aria-hidden="true" />
              </div>
              <div className={styles.serviceItemContent}>
                <h3 className={styles.serviceItemName}>모바일 최적화</h3>
                <p className={styles.serviceItemDesc}>iOS, 안드로이드 완벽 대응</p>
              </div>
            </div>

            <div className={styles.serviceItem}>
              <div className={cn(styles.serviceItemIcon, styles.yellow)}>
                <Palette size={24} aria-hidden="true" />
              </div>
              <div className={styles.serviceItemContent}>
                <h3 className={styles.serviceItemName}>커스텀 디자인</h3>
                <p className={styles.serviceItemDesc}>나만의 감성을 담은 테마</p>
              </div>
            </div>

            <div className={styles.serviceItem}>
              <div className={cn(styles.serviceItemIcon, styles.blue)}>
                <MapIcon size={24} aria-hidden="true" />
              </div>
              <div className={styles.serviceItemContent}>
                <h3 className={styles.serviceItemName}>스마트 지도</h3>
                <p className={styles.serviceItemDesc}>카카오/네이버 맵 연동 지원</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionTitle}>
            당신의 소중한 순간,
            <br />
            <span>바나나</span>가 함께합니다.
          </h2>
          <p className={styles.ctaSectionDesc}>
            준비는 5분이면 충분합니다.
            <br />
            지금 바로 무료로 시작해보세요.
          </p>
          <Link href="/setup" className={styles.ctaSectionButton}>
            무료로 시작하기
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </section>

        <footer className={styles.mainFooter}>
          <div className={styles.footerLinks}>
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <a href="mailto:cs@bananawedding.com">문의하기</a>
          </div>
          <p className={styles.footerCopy}>© 2026 Banana Wedding. All rights reserved.</p>
        </footer>
        </main>

        <div className={styles.fab}>
          <a href="mailto:cs@bananawedding.com" className={styles.fabButton} aria-label="문의하기">
            <MessageCircle size={24} aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  );
}
