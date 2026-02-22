export type ThemeFont =
  | 'pretendard'
  | 'gmarket'
  | 'gowun-batang'
  | 'gowun-dodum'
  | 'nanum-myeongjo'
  | 'yeon-sung'
  | 'do-hyeon'
  | 'song-myung'
  | 'serif'
  | 'sans';

const FONT_VAR_MAP: Record<ThemeFont, string> = {
  pretendard: '--font-pretendard',
  gmarket: '--font-gmarket-sans',
  'gowun-batang': '--font-gowun-batang',
  'gowun-dodum': '--font-gowun-dodum',
  'nanum-myeongjo': '--font-nanum-myeongjo',
  'yeon-sung': '--font-yeon-sung',
  'do-hyeon': '--font-do-hyeon',
  'song-myung': '--font-song-myung',
  serif: '--font-serif',
  sans: '--font-sans',
};

const ALL_FONT_VARS = [
  '--font-serif',
  '--font-sans',
  '--font-gowun-batang',
  '--font-gowun-dodum',
  '--font-nanum-myeongjo',
  '--font-yeon-sung',
  '--font-do-hyeon',
  '--font-song-myung',
  '--font-pretendard',
  '--font-gmarket-sans',
  '--font-script',
] as const;

export function getFontVar(font: ThemeFont): string {
  return FONT_VAR_MAP[font];
}

export function getFontStyle(
  font: ThemeFont,
  fontScale: number,
  backgroundColor: string
): Record<string, string | number> {
  const selectedFontVar = getFontVar(font);
  const selectedFontValue = `var(${selectedFontVar})`;

  const styleOverrides: Record<string, string | number> = {
    backgroundColor,
    '--font-scale': fontScale,
    fontFamily: selectedFontValue,
    transform: 'translate3d(0, 0, 0)',
  };

  ALL_FONT_VARS.forEach((fontVar) => {
    if (fontVar !== selectedFontVar) {
      styleOverrides[fontVar] = selectedFontValue;
    }
  });

  return styleOverrides;
}
