export const EDITOR_SECTION_KEYS = [
  'basic',
  'theme',
  'mainScreen',
  'message',
  'gallery',
  'date',
  'location',
  'account',
  'closing',
  'kakao',
] as const;

export type EditorSectionKey = (typeof EDITOR_SECTION_KEYS)[number];

export const EDITOR_SECTION_META = {
  basic: { sectionValue: 'basic-info', label: '기본 정보', navLabel: '기본정보' },
  theme: { sectionValue: 'theme', label: '테마', navLabel: '스타일' },
  mainScreen: { sectionValue: 'main', label: '메인 화면', navLabel: '메인' },
  message: { sectionValue: 'greeting', label: '인사말', navLabel: '인사말' },
  gallery: { sectionValue: 'gallery', label: '웨딩 갤러리', navLabel: '갤러리' },
  date: { sectionValue: 'date-time', label: '예식 일시', navLabel: '일시' },
  location: { sectionValue: 'location', label: '예식 장소', navLabel: '오시는길' },
  account: { sectionValue: 'accounts', label: '계좌 정보', navLabel: '계좌' },
  closing: { sectionValue: 'closing', label: '마무리', navLabel: '마무리' },
  kakao: { sectionValue: 'kakao-share', label: '카카오 공유', navLabel: '공유' },
} as const satisfies Record<
  EditorSectionKey,
  { sectionValue: string; label: string; navLabel: string }
>;

export type BuilderSectionValue = (typeof EDITOR_SECTION_META)[EditorSectionKey]['sectionValue'];

export const EDITOR_SECTION_LABEL: Record<EditorSectionKey, string> = EDITOR_SECTION_KEYS.reduce(
  (acc, key) => {
    acc[key] = EDITOR_SECTION_META[key].label;
    return acc;
  },
  {} as Record<EditorSectionKey, string>
);

export const EDITOR_SECTION_NAV_LABEL: Record<EditorSectionKey, string> =
  EDITOR_SECTION_KEYS.reduce(
    (acc, key) => {
      acc[key] = EDITOR_SECTION_META[key].navLabel;
      return acc;
    },
    {} as Record<EditorSectionKey, string>
  );

export const EDITOR_KEY_TO_SECTION_VALUE: Record<EditorSectionKey, BuilderSectionValue> =
  EDITOR_SECTION_KEYS.reduce(
    (acc, key) => {
      acc[key] = EDITOR_SECTION_META[key].sectionValue;
      return acc;
    },
    {} as Record<EditorSectionKey, BuilderSectionValue>
  );

export const SECTION_VALUE_TO_EDITOR_KEY: Record<BuilderSectionValue, EditorSectionKey> =
  EDITOR_SECTION_KEYS.reduce(
    (acc, key) => {
      acc[EDITOR_SECTION_META[key].sectionValue] = key;
      return acc;
    },
    {} as Record<BuilderSectionValue, EditorSectionKey>
  );
