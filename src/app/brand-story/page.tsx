'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './MainLanding.module.scss';
import {
  Banana,
  Heart,
  Sparkles,
  Award,
  PartyPopper,
  Images,
  Type,
  ClipboardCheck,
  Smartphone,
  Palette,
  Map as MapIcon,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSeuogdGG71tlsk3wSWH6uT3KuSxaXiF9YMswcJ2V2roREZy-Z3MJ3ADVTDR8ZF6y6yzZ-8maS6RCCAlTW6SqwU1SCU2HGDOWRdN7sY81hWQY8L22Gol5SJFffEUary8L4iL3QJBy4L2XVrwVf-I3rjCB_tOZ4reIz2iwyOskVgrVlyAeHGiBVGjlyzd9ThbtAj8xigOR7NvMl7hByRevQNrRQM6bLl_VEsAyzI82LU0T6DpVN5FPNX3oaGFy0JCeReIxU8HYPwigu';
const GALLERY_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Xv4j1T1By57Iyn4U4K6mjapz1zsIoLTSyKROc-XF1uGwHySZOXkwkE1-hHGBj-_bm6RxlLqi8AhNdC2S-TsFDjxCJgCY0YI0Mh3LMguEbfNGT9lDb3pb74D_hEhbOWZYR7MOCAoFUjPr_oeLYYIuvS2Xry33nSo7MFQvZgpGeiX_xPg6nWgIADyQSDXhsyYXYG8ZoILDTACWUc3E3CCTGblzi5Gl7SfTtagy5KF-3gTm9XsEy1iOAwwzvM80Xh9ZiafV3WGj8mri';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export default function BrandStoryPage() {
  return (
    <div className={styles.page}>
      {/* 1. Header (App Bar) */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Banana size={24} />
            </div>
            <span className={styles.logoText}>바나나 웨딩</span>
          </Link>

          <div className={styles.navActions}>
            <Link href="/builder">
              <button className={styles.startButton}>시작하기</button>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* 2. Hero Section */}
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
              <Link href="/builder">
                <button className={styles.heroPrimaryBtn}>지금 만들기</button>
              </Link>
              <button className={styles.heroSecondaryBtn}>샘플 보기</button>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div
              className={styles.heroVisualImage}
              style={{ backgroundImage: `url(${HERO_IMG})` }}
            />
            <div className={styles.heroVisualOverlay} />
          </div>
        </section>

        {/* 3. Social Proof */}
        <section className={styles.trust}>
          <span className={styles.trustLabel}>10,000+ 커플이 선택한 이유</span>
          <div className={styles.trustIcons}>
            <Heart size={24} />
            <Sparkles size={24} />
            <Award size={24} />
            <PartyPopper size={24} />
          </div>
        </section>

        {/* 4. Features (Bento Grid) */}
        <section className={styles.features}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>고급스러운 디테일</h2>
            <p className={styles.featuresSubtitle}>
              단순한 안내장을 넘어 진심을 전하는 공간이 됩니다.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {/* Big Card */}
            <div className={styles.bentoCardLarge}>
              <div
                className={styles.bentoCardImage}
                style={{ backgroundImage: `url(${GALLERY_IMG})` }}
              />
              <div className={styles.bentoCardContent}>
                <div className={styles.bentoCardHeader}>
                  <Images size={24} />
                  <h3 className={styles.bentoCardTitle}>고해상도 갤러리</h3>
                </div>
                <p className={styles.bentoCardDesc}>원본 그대로의 감동을 전달하는 선명한 화질</p>
              </div>
            </div>

            {/* Small Cards Row */}
            <div className={styles.rowGrid}>
              {/* Card 1 */}
              <div className={styles.bentoCard}>
                <div className={cn(styles.bentoCardIconBox, styles.yellow)}>
                  <Type size={24} />
                </div>
                <div>
                  <h3 className={styles.bentoCardTitle}>감성 폰트</h3>
                  <p className={styles.bentoCardDesc}>엄선된 프리미엄 서체</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className={styles.bentoCard}>
                <div className={cn(styles.bentoCardIconBox, styles.blue)}>
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className={styles.bentoCardTitle}>실시간 RSVP</h3>
                  <p className={styles.bentoCardDesc}>즉시 확인하는 참석 명단</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Service List */}
        <section className={styles.services}>
          <h2 className={styles.servicesTitle}>모든 것을 하나로</h2>
          <div className="flex flex-col gap-3">
            <div className={styles.serviceItem}>
              <div className={cn(styles.serviceItemIcon, styles.blue)}>
                <Smartphone size={24} />
              </div>
              <div className={styles.serviceItemContent}>
                <h3 className={styles.serviceItemName}>모바일 최적화</h3>
                <p className={styles.serviceItemDesc}>iOS, 안드로이드 완벽 대응</p>
              </div>
            </div>

            <div className={styles.serviceItem}>
              <div className={cn(styles.serviceItemIcon, styles.yellow)}>
                <Palette size={24} />
              </div>
              <div className={styles.serviceItemContent}>
                <h3 className={styles.serviceItemName}>커스텀 디자인</h3>
                <p className={styles.serviceItemDesc}>나만의 감성을 담은 테마</p>
              </div>
            </div>

            <div className={styles.serviceItem}>
              <div className={cn(styles.serviceItemIcon, styles.blue)}>
                <MapIcon size={24} />
              </div>
              <div className={styles.serviceItemContent}>
                <h3 className={styles.serviceItemName}>스마트 지도</h3>
                <p className={styles.serviceItemDesc}>카카오/네이버 맵 연동 지원</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA Footer */}
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
          <button className={styles.ctaSectionButton}>
            무료로 시작하기
            <ArrowRight size={20} />
          </button>
        </section>

        {/* 7. Footer */}
        <footer className={styles.mainFooter}>
          <div className={styles.footerLinks}>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>문의하기</span>
          </div>
          <p className={styles.footerCopy}>© 2024 Banana Wedding. All rights reserved.</p>
        </footer>
      </main>

      {/* FAB */}
      <div className={styles.fab}>
        <button className={styles.fabButton}>
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
}
