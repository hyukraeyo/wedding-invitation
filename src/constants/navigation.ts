/**
 * 🍌 사이드바 및 페이지 제목 관리 상수
 * 한 곳에서 수정하여 전체 UI의 일관성을 유지합니다.
 */
export const MENU_TITLES = {
  DASHBOARD: '모바일 청첩장',
  REQUESTS: '신청 관리',
  ACCOUNT: '내 계정관리',
  NOTIFICATIONS: '알림',
  EVENTS: '이벤트',
  CUSTOMER_SERVICE: '고객센터',
  LOGOUT: '로그아웃',
} as const;

export type MenuTitleKey = keyof typeof MENU_TITLES;
