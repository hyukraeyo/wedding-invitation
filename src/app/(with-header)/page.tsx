import type { Metadata } from 'next';
import { HomeClient } from './HomeClient';
import { SITE_NAME, SITE_NAME_EN, SITE_URL, absoluteUrl } from '@/lib/site';

const HOME_TITLE = `${SITE_NAME} | 3분 완성 모바일 청첩장`;
const HOME_DESCRIPTION =
  '복잡한 준비 없이 3분 만에 시작하는 모바일 청첩장. 감성 테마, 실시간 미리보기, 간편 공유까지 한 번에 준비하세요.';
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
  about: ['모바일 청첩장', '청첩장 만들기', '웨딩 초대장'],
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
        text: '기본 정보 입력 후 약 3분 안에 모바일 청첩장을 만들고 공유할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '모바일 청첩장을 카카오톡으로 공유할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네. 생성된 링크를 카카오톡, 문자, 링크 복사 등 다양한 방식으로 전달할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '청첩장 수정 횟수에 제한이 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '제한 없이 수정할 수 있으며 변경 사항은 저장 즉시 반영됩니다.',
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
      <HomeClient />
    </>
  );
}
