import type { Metadata } from 'next';
import { SITE_NAME, SITE_NAME_EN, absoluteUrl } from '@/lib/site';
import { BrandStoryContent } from './components/BrandStoryContent';

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
      <BrandStoryContent />
    </>
  );
}
