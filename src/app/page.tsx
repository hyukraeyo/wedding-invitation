import type { Metadata } from 'next';
import { HomeClient } from './(with-header)/HomeClient';

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://wedding-invitation-zeta-one.vercel.app';
const HOME_TITLE = '바나나웨딩 | 나만의 모바일 청첩장';
const HOME_DESCRIPTION =
  '유통기한 없는 우리만의 달콤한 이야기, 바나나웨딩에서 3분 만에 모바일 청첩장을 제작하고 공유하세요.';
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
    name: '바나나웨딩',
    url: SITE_URL,
  },
  about: ['모바일 청첩장', '결혼식 초대장', '웨딩 웹 초대장'],
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
        text: '기본 정보만 입력하면 약 3분 안에 모바일 청첩장을 만들고 공유할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '모바일 청첩장을 카카오톡으로 공유할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 제작한 청첩장을 카카오톡을 포함한 다양한 채널로 쉽게 공유할 수 있습니다.',
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
    '결혼식 초대장',
    '카카오톡 청첩장',
    '웨딩 인비테이션',
    '바나나웨딩',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: '바나나웨딩(Banana Wedding)',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: OG_IMAGE_PATH,
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
    images: [OG_IMAGE_PATH],
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
      <HomeClient />
    </>
  );
}
