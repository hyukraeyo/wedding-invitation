import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.scss";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "심플하고 아름다운 모바일 청첩장 | Wedding Invitation Studio",
    template: "%s | Wedding Invitation Studio"
  },
  description: "소중한 날, 특별한 순간에 여러분을 초대합니다. Next.js 16으로 제작된 고품격 모바일 청첩장으로 특별한 순간을 더욱 빛나게 만들어보세요.",
  keywords: [
    "모바일 청첩장", "결혼식 초대장", "셀프 모바일 청첩장", "무료 청첩장",
    "심플한 청첩장", "웨딩 초대장", "카카오톡 청첩장", "디지털 청첩장",
    "웨딩 카드", "결혼 축하", "웨딩 인비테이션"
  ],
  authors: [{ name: "Hyuk Rae Yoon" }],
  creator: "Hyuk Rae Yoon",
  publisher: "Wedding Invitation Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wedding-invitation-zeta-one.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "심플하고 아름다운 모바일 청첩장",
    description: "Next.js 16으로 제작된 고품격 모바일 청첩장으로 특별한 순간을 더욱 빛나게 만들어보세요.",
    url: "https://wedding-invitation-zeta-one.vercel.app",
    siteName: "Wedding Invitation Studio",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wedding Invitation Studio - 모바일 청첩장 제작 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "심플하고 아름다운 모바일 청첩장",
    description: "Next.js 16으로 제작된 고품격 모바일 청첩장 플랫폼",
    images: ["/og-image.jpg"],
    creator: "@hyukraeyo",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
    other: {
      "naver-site-verification": "your-naver-site-verification-code",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard CDN */}
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        {/* Google Fonts - Offline 빌드 대응을 위해 CDN 사용 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:wght@400..900&family=Gowun+Batang:wght@400;700&family=Gowun+Dodum:wght@400&family=Nanum+Myeongjo:wght@400;700;800&family=Yeon+Sung:wght@400&family=Do+Hyeon:wght@400&family=Song+Myung:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">

        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Wedding Invitation Studio",
                "alternateName": "심플 모바일 청첩장",
                "url": "https://wedding-invitation-zeta-one.vercel.app",
                "description": "Next.js 16으로 제작된 고품격 모바일 청첩장 제작 플랫폼",
                "inLanguage": "ko-KR",
                "publisher": {
                  "@type": "Person",
                  "name": "Hyuk Rae Yoon",
                  "url": "https://github.com/hyukraeyo"
                },
                "potentialAction": {
                  "@type": "CreateAction",
                  "target": "https://wedding-invitation-zeta-one.vercel.app/builder",
                  "description": "나만의 모바일 청첩장 만들기"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Wedding Invitation Studio",
                "description": "모바일 청첩장 제작 웹 애플리케이션",
                "url": "https://wedding-invitation-zeta-one.vercel.app",
                "applicationCategory": "WebApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "KRW"
                },
                "featureList": [
                  "실시간 미리보기",
                  "카카오톡 공유",
                  "지도 연동",
                  "갤러리 시스템",
                  "계좌번호 관리"
                ]
              }
            ])
          }}
        />
        {children}
      </body>
    </html>
  );
}
