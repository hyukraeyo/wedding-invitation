import type { Metadata } from 'next';
import Link from 'next/link';
import { StaticMorphHero } from '@/components/ui/StaticMorphHero';
import { SITE_NAME, SITE_NAME_EN, SITE_URL, absoluteUrl } from '@/lib/site';
import styles from './page.module.scss';

const HOME_TITLE = `${SITE_NAME} | 3분 완성 모바일 청첩장`;
const HOME_DESCRIPTION =
  '복잡한 준비 없이 3분 만에 시작하는 모바일 청첩장. 바나나웨딩(바나나 웨딩)에서 감성 테마, 실시간 미리보기, 간편 공유까지 한 번에 준비하세요.';
const OG_IMAGE_PATH = '/assets/icons/logo-banana-heart.png';

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: HOME_TITLE,
  description: HOME_DESCRIPTION,
  url: SITE_URL,
  inLanguage: 'ko-KR',
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
  },
  about: ['모바일 청첩장', '청첩장 만들기', '웨딩 초대장', '바나나웨딩', '바나나 웨딩'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '바나나웨딩으로 얼마나 빨리 청첩장을 만들 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '기본 정보 입력 후 약 3분 안에 모바일 청첩장을 만들고 공유할 수 있어요.',
      },
    },
    {
      '@type': 'Question',
      name: '모바일 청첩장을 카카오톡으로 공유할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네. 생성된 링크를 카카오톡, 문자, 링크 복사 등 다양한 방식으로 전달할 수 있어요.',
      },
    },
    {
      '@type': 'Question',
      name: '청첩장 수정 횟수에 제한이 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '제한 없이 수정할 수 있으며 변경 사항은 저장 즉시 반영돼요.',
      },
    },
  ],
};

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    '모바일 청첩장',
    '청첩장 만들기',
    '모바일 웨딩 초대장',
    '카카오톡 청첩장',
    '무료 청첩장',
    '바나나웨딩',
    '바나나 웨딩',
    'banana wedding',
    'banana-wedding',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: absoluteUrl('/'),
    siteName: `${SITE_NAME}(${SITE_NAME_EN})`,
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: absoluteUrl(OG_IMAGE_PATH),
        width: 800,
        height: 800,
        alt: '바나나웨딩 모바일 청첩장 서비스 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [absoluteUrl(OG_IMAGE_PATH)],
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className={styles.main}>
        <section className={styles.heroSection} aria-label="바나나웨딩 홈 히어로">
          <StaticMorphHero />
        </section>
        <section className={styles.brandSummary} aria-labelledby="brand-summary-title">
          <h2 id="brand-summary-title" className={styles.summaryTitle}>
            바나나 웨딩(바나나웨딩), 무료 모바일 청첩장
          </h2>
          <p className={styles.summaryDescription}>
            첫 화면은 감성적인 비주얼 그대로, 제작은 3분 안에 끝낼 수 있도록 설계했어요.
            바나나웨딩은 카카오톡 공유, 실시간 미리보기, 간편 수정으로 모바일 청첩장 제작을
            단순하게 만듭니다.
          </p>
          <div className={styles.summaryLinks}>
            <Link href="/setup" className={styles.primaryLink}>
              청첩장 만들기
            </Link>
            <Link href="/brand-story" className={styles.secondaryLink}>
              브랜드 스토리
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
