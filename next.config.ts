/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const withPWAInit = require('next-pwa');

const nextConfig: NextConfig = {
  // React 19 Strict Mode 활성화
  reactStrictMode: true,

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
  },

  // Turbopack 설정 (Next.js 16 대응)
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'k.kakaocdn.net' },
      { protocol: 'https', hostname: 'naver.com' },
      { protocol: 'https', hostname: 'dapi.kakao.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },


  // 로깅 (Next.js 15+ 권장)
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // 실험적 기능 및 최적화
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'wedding-invitation-zeta-one.vercel.app'],
    },
    optimizePackageImports: [
      'lucide-react',
      '@tiptap/react',
      'clsx',
      'swiper',
      'zustand',
      '@dnd-kit/core',
      '@dnd-kit/sortable'
    ],
  },

  // 보안 및 성능 헤더
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http:;
      style-src 'self' 'unsafe-inline' https: http:;
      img-src 'self' blob: data: https: http:;
      font-src 'self' data: https: http:;
      connect-src 'self' https: http: wss: sentry.io;
      worker-src 'self' blob:;
      child-src 'self' blob: https: http:;
      frame-src 'self' https: http:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },

  // 웹팩 최적화
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer && process.env.ANALYZE === 'true') {
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
};

const config = withSentryConfig(
  withPWAInit({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/middleware-manifest\.json$/],
  })(nextConfig),
  {
    silent: true,
    ...(process.env.SENTRY_ORG && process.env.SENTRY_PROJECT ? {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    } : {}),
  }
);

export default config;

