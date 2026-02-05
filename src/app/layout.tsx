import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import ClientProviders from './ClientProviders';
import { fontVariables } from '@/lib/fonts';
import { SkipLink } from '@/hooks/useAccessibility';
import './globals.scss';
import '../styles/_accessibility.scss';
import styles from './layout.module.scss';
import Link from 'next/link';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // 🍌 Safari에서 인풋 포커스 시 줌 현상을 강제로 막기 위해 1로 설정 (접근성 고려 시 주의 필요)
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F9F8E6',
  // 🍌 최신 모바일 브라우저 기법: 키보드가 올라올 때 뷰포트 높이를 조절하여 UI가 가려지거나 확대되는 현상 방지
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: {
    default: '쉽고 빠른 모바일 청첩장 | 바나나웨딩',
    template: '%s | 바나나웨딩',
  },
  description:
    '복잡한 과정 없이 바로 시작하는 모바일 청첩장 제작, 바나나웨딩에서 지금 만들어보세요.',
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
  publisher: '바나나웨딩(Banana Wedding)',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wedding-invitation-zeta-one.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '바나나웨딩 - 쉽고 빠른 모바일 청첩장',
    description: '복잡한 과정 없이 나만의 모바일 청첩장을 쉽게 만들고 공유하세요.',
    url: 'https://wedding-invitation-zeta-one.vercel.app',
    siteName: '바나나웨딩(Banana Wedding)',
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
    title: '바나나웨딩 - 모바일 청첩장',
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
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
                name: '바나나웨딩',
                alternateName: 'Banana Wedding',
                url: 'https://wedding-invitation-zeta-one.vercel.app',
                description: '쉽고 빠르게 모바일 청첩장을 만들 수 있는 서비스예요.',
                inLanguage: 'ko-KR',
                publisher: {
                  '@type': 'Person',
                  name: 'Hyuk Rae Yoon',
                  url: 'https://github.com/hyukraeyo',
                },
                potentialAction: {
                  '@type': 'CreateAction',
                  target: 'https://wedding-invitation-zeta-one.vercel.app/builder',
                  description: '나만의 모바일 청첩장을 제작해요.',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Wedding Invitation Studio',
                description: '모바일 청첩장 제작 웹 애플리케이션',
                url: 'https://wedding-invitation-zeta-one.vercel.app',
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
            ]),
          }}
        />
        <SkipLink href="#main-content">본문 바로가기</SkipLink>
        <Suspense fallback={null}>
          <ClientProviders>
            <div suppressHydrationWarning vaul-drawer-wrapper="" className={styles.appShell}>
              <div id="main-content" role="main" className={styles.mainContent}>
                {children}
              </div>
            </div>
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
