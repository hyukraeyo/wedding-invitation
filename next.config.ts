import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React 19 Strict Mode 활성화 (Next.js 16 권장)
  reactStrictMode: true,

  // TypeScript 엄격 모드와 함께 사용 시 권장
  typescript: {
    // 빌드 시 타입 에러 무시하지 않음 (개발 시 타입 에러 확인)
    ignoreBuildErrors: false,
  },


  // 이미지 최적화 설정
  images: {
    // 외부 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net', // 카카오 지도 타일
      },
      {
        protocol: 'https',
        hostname: 'naver.com', // 네이버 지도 (필요시 추가)
      },
      {
        protocol: 'https',
        hostname: 'dapi.kakao.com', // 카카오 API
      },
    ],
    // WebP 우선 사용
    formats: ['image/webp', 'image/avif'],
    // 이미지 크기 제한 (청첩장용으로 충분)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // 실험적 기능 (Next.js 16 안정화)
  experimental: {
    // 서버 액션 (향후 API 라우트 대체용)
    serverActions: {
      allowedOrigins: ['localhost:3000', 'wedding-invitation.vercel.app'],
    },
    // 패키지 임포트 최적화 (트리셰이킹)
    optimizePackageImports: ['lucide-react', '@tiptap/react', 'clsx'],
  },

  // Turbopack 설정
  turbopack: {},

  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 리다이렉트 설정 (필요시)
  async redirects() {
    return [
      // 예시: 구 버전 URL에서 신 버전으로 리다이렉트
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // 웹팩 최적화 (필요시)
  webpack: (config, { isServer }) => {
    // SVG를 컴포넌트로 임포트 가능하게 설정
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 번들 분석 (개발 시에만)
    if (!isServer && process.env.ANALYZE === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    return config;
  },

  // PWA 설정 (향후 추가 가능)
  // pwa: {
  //   dest: 'public',
  //   disable: process.env.NODE_ENV === 'development',
  // },
};

export default nextConfig;
