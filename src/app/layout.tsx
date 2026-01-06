import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "심플하고 아름다운 모바일 청첩장",
  description: "소중한 날, 특별한 순간에 여러분을 초대합니다. 정성을 담아 만든 저희의 모바일 청첩장을 확인해 보세요.",
  keywords: ["모바일 청첩장", "결혼식 초대장", "셀프 모바일 청첩장", "무료 청첩장", "심플한 청첩장"],
  openGraph: {
    title: "저희의 결혼식에 초대합니다",
    description: "아름다운 시작의 순간, 함께 축복해 주세요.",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >

        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "심플 모바일 청첩장",
              "url": "https://wedding-invitation-zeta-one.vercel.app",
              "description": "아름답고 심플한 모바일 청첩장 제작 서비스",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://wedding-invitation-zeta-one.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
