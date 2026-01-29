/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React 19 Strict Mode 활성화
  reactStrictMode: true,

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@toss/tds-mobile'],

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
    qualities: [75, 85, 100],
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
    // bundle-barrel-imports: lucide-react 등 barrel file 최적화
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-separator',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-visually-hidden',
      'date-fns',
    ],
    viewTransition: true,
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 보안 및 성능 헤더
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http:;
      style-src 'self' 'unsafe-inline' https: http:;
      img-src 'self' blob: data: https: http:;
      font-src 'self' data: https: http:;
      connect-src 'self' https: http: wss:;
      worker-src 'self' blob:;
      child-src 'self' blob: https: http:;
      frame-src 'self' https: http:;
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://sharer.kakao.com;
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // bundle-defer-third-party: Split vendor code
    if (config.name === 'client') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              enforce: true
            },
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 15
            }
          }
        }
      }
    }

    return config;
  },
};

// 개발 환경이 아닐 때만 PWA 설정을 입힙니다.
const config = process.env.NODE_ENV === 'production'
  ? require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    buildExcludes: [/middleware-manifest\.json$/],
  })(nextConfig)
  : nextConfig;

export default config;
