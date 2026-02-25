import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_NAME_EN, absoluteUrl } from '@/lib/site';
import styles from './page.module.scss';

const BRAND_STORY_TITLE = `브랜드 스토리 | ${SITE_NAME}`;
const BRAND_STORY_DESCRIPTION =
  '바나나 웨딩(바나나웨딩)이 모바일 청첩장을 더 쉽고 더 빠르게 만들기 위해 만든 제품 철학을 소개합니다.';

export const metadata: Metadata = {
  title: BRAND_STORY_TITLE,
  description: BRAND_STORY_DESCRIPTION,
  alternates: {
    canonical: '/brand-story',
  },
  openGraph: {
    title: BRAND_STORY_TITLE,
    description: BRAND_STORY_DESCRIPTION,
    url: absoluteUrl('/brand-story'),
    siteName: `${SITE_NAME}(${SITE_NAME_EN})`,
    type: 'article',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND_STORY_TITLE,
    description: BRAND_STORY_DESCRIPTION,
    images: [absoluteUrl('/assets/icons/logo-banana-heart.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
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

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: BRAND_STORY_TITLE,
  description: BRAND_STORY_DESCRIPTION,
  url: absoluteUrl('/brand-story'),
  inLanguage: 'ko-KR',
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: absoluteUrl('/'),
  },
  about: ['바나나 웨딩', '바나나웨딩', '모바일 청첩장', '청첩장 만들기'],
};

export default function BrandStoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>바나나 웨딩(바나나웨딩) 브랜드 스토리</h1>
          <p className={styles.lead}>
            결혼 준비는 복잡한데, 모바일 청첩장 제작만큼은 간단해야 한다는 생각에서 시작했습니다.
            바나나웨딩은 처음 만드는 사람도 바로 이해하고 공유할 수 있도록, 핵심 흐름만 남겨 설계한
            서비스입니다.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>우리가 중요하게 보는 기준</h2>
          <ul className={styles.list}>
            <li>첫 화면은 감성적인 비주얼로 시작하고, 제작은 짧은 단계로 끝낸다.</li>
            <li>카카오톡 공유를 중심으로, 실제 전달과 열람 흐름을 우선한다.</li>
            <li>문구와 정보를 자주 수정해도 부담이 없도록 편집 흐름을 단순화한다.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>바나나웨딩이 해결하는 문제</h2>
          <p className={styles.paragraph}>
            기존 청첩장 제작 도구는 예쁜 템플릿이 있어도 설정이 복잡하거나 모바일 경험이 매끄럽지 않은
            경우가 많았습니다. 바나나 웨딩은 모바일에서 바로 만들고, 바로 고치고, 바로 공유하는 속도에
            집중합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>다음 단계</h2>
          <p className={styles.paragraph}>
            지금도 핵심은 동일합니다. 누구나 빠르게 시작할 수 있고, 공유 후에도 계속 다듬기 쉬운
            모바일 청첩장 제작 경험을 제공합니다.
          </p>
          <div className={styles.actions}>
            <Link href="/setup" className={styles.primaryAction}>
              3분 만에 시작하기
            </Link>
            <Link href="/" className={styles.secondaryAction}>
              홈으로 이동
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
