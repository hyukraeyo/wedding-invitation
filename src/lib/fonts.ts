/**
 * Next.js 16+ 권장 방식의 폰트 설정
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/fonts
 *
 * `next/font`를 사용하면:
 * - 자동 self-hosting (외부 요청 없음)
 * - Layout shift 방지
 * - preload 최적화
 */

import {
  Inter,
  Playfair_Display,
  Nanum_Myeongjo,
  Do_Hyeon,
  Song_Myung,
  Great_Vibes,
  Gowun_Dodum,
  Gowun_Batang,
  Yeon_Sung,
} from 'next/font/google';
import localFont from 'next/font/local';

// ============================================================================
// 기본 UI 폰트
// ============================================================================

/**
 * Pretendard - 한국어 메인 UI 폰트
 * Google Fonts에 없어서 로컬 폰트로 로드
 */
export const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'optional', // Layout shift 방지를 위해 optional 사용
  adjustFontFallback: false, // Next.js의 자동 fallback 조정 비활성화
});

/**
 * Inter - 영문 메인 UI 폰트
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// ============================================================================
// 청첩장 테마용 폰트
// ============================================================================

/**
 * Gowun Dodum - 고운돋움 & Gowun Batang - 고운바탕
 */
export const gowunDodum = Gowun_Dodum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gowun-dodum',
  display: 'swap',
  preload: false,
});

export const gowunBatang = Gowun_Batang({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-gowun-batang',
  display: 'swap',
  preload: false,
});

/**
 * Yeon Sung - 연성체
 */
export const yeonSung = Yeon_Sung({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-yeon-sung',
  display: 'swap',
  preload: false,
});

/**
 * Playfair Display - 우아한 세리프 폰트 (영문)
 */
export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
});

/**
 * Nanum Myeongjo - 나눔명조 (한글 세리프)
 * 한글 폰트는 latin subset만 지원
 */
export const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
  preload: false,
});

/**
 * Do Hyeon - 도현 (한글 고딕)
 * 한글 폰트는 latin subset만 지원
 */
export const doHyeon = Do_Hyeon({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-do-hyeon',
  display: 'swap',
  preload: false,
});

/**
 * Song Myung - 송명 (한글 세리프)
 * 한글 폰트는 latin subset만 지원
 */
export const songMyung = Song_Myung({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-song-myung',
  display: 'swap',
  preload: false,
});

/**
 * Great Vibes - 필기체 폰트 (영문)
 */
export const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
  preload: false,
});

// ============================================================================
// 폰트 클래스 조합
// ============================================================================

/**
 * 모든 폰트 변수를 하나의 className으로 결합
 */
export const fontVariables = [
  pretendard.variable,
  inter.variable,
  playfairDisplay.variable,
  nanumMyeongjo.variable,
  doHyeon.variable,
  songMyung.variable,
  greatVibes.variable,
  gowunDodum.variable,
  gowunBatang.variable,
  yeonSung.variable,
].join(' ');

/**
 * 폰트 CSS 변수 매핑 (SCSS/CSS에서 사용)
 *
 * 사용 예시:
 * ```css
 * font-family: var(--font-pretendard), sans-serif;
 * font-family: var(--font-nanum-myeongjo), serif;
 * ```
 */
export const fontFamilyMap = {
  pretendard: 'var(--font-pretendard)',
  inter: 'var(--font-inter)',
  playfair: 'var(--font-playfair)',
  nanumMyeongjo: 'var(--font-nanum-myeongjo)',
  doHyeon: 'var(--font-do-hyeon)',
  songMyung: 'var(--font-song-myung)',
  greatVibes: 'var(--font-great-vibes)',
  gowunDodum: 'var(--font-gowun-dodum)',
  gowunBatang: 'var(--font-gowun-batang)',
  yeonSung: 'var(--font-yeon-sung)',
} as const;
