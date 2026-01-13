// Application Constants

// App Configuration
export const APP_CONFIG = {
  name: '바나나웨딩 (Banana Wedding)',
  version: '1.0.0',
  description: '유통기한 없는 달콤한 시작, 바나나웨딩',
  url: 'https://wedding-invitation-zeta-one.vercel.app',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retries: 3,
} as const;

// External Services
export const EXTERNAL_SERVICES = {
  kakao: {
    appKey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY,
    mapUrl: 'https://dapi.kakao.com/v2/maps/sdk.js',
  },
  naver: {
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
    mapUrl: 'https://openapi.map.naver.com/openapi/v3/maps.js',
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  name: {
    minLength: 1,
    maxLength: 50,
  },
  message: {
    minLength: 10,
    maxLength: 1000,
  },
  phone: {
    pattern: /^(\+82|0)[0-9]{8,11}$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: 'ease-out',
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  zIndex: {
    dropdown: 1000,
    modal: 2000,
    tooltip: 3000,
  },
} as const;

// Theme Constants
export const THEME_CONSTANTS = {
  fonts: {
    serif: 'font-serif',
    sans: 'font-sans',
  },
  colors: {
    primary: '#4A5D45',
    secondary: '#F9F8E6',
    accent: '#8B7355',
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableErrorReporting: process.env.NODE_ENV === 'production',
  enableExperimentalFeatures: process.env.NODE_ENV === 'development',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  revalidation: {
    static: false, // Never revalidate static content
    dynamic: 3600, // Revalidate dynamic content every hour
    api: 300, // Revalidate API responses every 5 minutes
  },
  tags: {
    wedding: 'wedding',
    invitation: 'invitation',
    guest: 'guest',
  },
} as const;