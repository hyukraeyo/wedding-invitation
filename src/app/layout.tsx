import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import ClientProviders from './ClientProviders';
import { fontVariables } from '@/lib/fonts';
import { SkipLink } from '@/hooks/useAccessibility';
import { PALETTE } from '@/constants/palette';
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_EN, SITE_URL, absoluteUrl } from '@/lib/site';
import './globals.scss';
import '../styles/_accessibility.scss';
import styles from './layout.module.scss';

const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;
const NAVER_SITE_VERIFICATION = process.env.NAVER_SITE_VERIFICATION;
const SUPPORT_EMAIL = 'cs@bananawedding.com';
const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_KaiAX';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: PALETTE.PRIMARY_50,
  interactiveWidget: 'resizes-content',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `쉽고 빠른 모바일 청첩장 | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    '모바일 청첩장',
    '결혼식 초대장',
    '무료 모바일 청첩장',
    '청첩장 만들기',
    '웨딩 초대장',
    '카카오톡 청첩장',
    '웹 청첩장',
    '웨딩 카드',
    '결혼 축하',
    '웨딩 인비테이션',
  ],
  authors: [{ name: 'Hyuk Rae Yoon' }],
  creator: 'Hyuk Rae Yoon',
  publisher: `${SITE_NAME}(${SITE_NAME_EN})`,
  category: 'wedding',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    types: {
      'application/rss+xml': absoluteUrl('/rss.xml'),
    },
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION || undefined,
    other: NAVER_SITE_VERIFICATION
      ? {
          'naver-site-verification': NAVER_SITE_VERIFICATION,
        }
      : undefined,
  },
  openGraph: {
    title: `${SITE_NAME} - 쉽고 빠른 모바일 청첩장`,
    description: '복잡한 과정 없이 나만의 모바일 청첩장을 쉽게 만들고 공유하세요.',
    url: SITE_URL,
    siteName: `${SITE_NAME}(${SITE_NAME_EN})`,
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/assets/icons/logo-banana-heart.png',
        width: 800,
        height: 800,
        alt: '바나나웨딩 - 모바일 청첩장 제작',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - 모바일 청첩장`,
    description: '쉽고 간편하게 모바일 청첩장을 제작해 보세요.',
    images: ['/logo.png'],
    creator: '@hyukraeyo',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={fontVariables}>
      <head />
      <body suppressHydrationWarning>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
          integrity="sha384-l+xbElFSnPZ2rOaPrU//2FF5B4LB8FiX5q4fXYTlfcG4PGpMkE1vcL7kNXI6Cci0"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="kakao-init" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
              window.Kakao.init('${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}');
            }
          `}
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: SITE_NAME,
                alternateName: SITE_NAME_EN,
                url: SITE_URL,
                description: SITE_DESCRIPTION,
                inLanguage: 'ko-KR',
                publisher: {
                  '@type': 'Person',
                  name: 'Hyuk Rae Yoon',
                  url: 'https://github.com/hyukraeyo',
                },
                potentialAction: {
                  '@type': 'CreateAction',
                  target: `${SITE_URL}/setup`,
                  description: '나만의 모바일 청첩장을 제작해요.',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Wedding Invitation Studio',
                description: '모바일 청첩장 제작 웹 애플리케이션',
                url: SITE_URL,
                applicationCategory: 'WebApplication',
                operatingSystem: 'Web Browser',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'KRW',
                },
                featureList: [
                  '실시간 미리보기',
                  '카카오톡 공유',
                  '지도 연동',
                  '갤러리 기능',
                  '계좌번호 관리',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: SITE_NAME,
                url: SITE_URL,
                sameAs: [KAKAO_CHANNEL_URL],
                contactPoint: [
                  {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: SUPPORT_EMAIL,
                    availableLanguage: ['ko', 'en'],
                  },
                ],
              },
            ]),
          }}
        />
        <SkipLink href="#main-content">본문 바로가기</SkipLink>
        <Suspense fallback={null}>
          <ClientProviders>
            <div suppressHydrationWarning vaul-drawer-wrapper="" className={styles.appShell}>
              <main id="main-content" className={styles.mainContent}>
                {children}
              </main>
            </div>
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
