/**
 * 한국 주요 은행 목록
 * BankPicker 등에서 사용
 */
export const BANK_LIST = [
  '카카오뱅크',
  '토스뱅크',
  '신한',
  '국민',
  '우리',
  '하나',
  '기업',
  '농협',
  'SC제일',
  '씨티',
  '경남',
  '광주',
  '대구',
  '부산',
  '수협',
  '전북',
  '제주',
  '새마을금고',
  '신협',
  '우체국',
  '산업',
  'K뱅크',
] as const;

export type BankName = (typeof BANK_LIST)[number];

export const BANK_OPTIONS = BANK_LIST.map((bank) => ({
  label: bank,
  value: bank,
}));
