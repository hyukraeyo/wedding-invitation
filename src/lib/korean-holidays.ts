import Holidays from 'date-holidays';

const hd = new Holidays('KR');

// 수동으로 추가할 임시 공휴일 목록 (YYYY-MM-DD)
// 라이브러리가 커버하지 못하는 임시 공휴일이나 선거일 등을 이곳에 추가합니다.
const TEMPORARY_HOLIDAYS: Record<string, string> = {
  // 예시:
  // '2024-10-01': '국군의 날(임시공휴일)',
  // '2026-06-03': '지방선거',
};

/**
 * 날짜를 YYYY-MM-DD 문자열로 변환
 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 특정 날짜가 공휴일인지 확인하고 이름 반환
 * @param date 확인할 날짜
 * @returns 공휴일 이름 또는 null
 */
export function getHolidayName(date: Date): string | null {
  // 1. 임시 공휴일 확인 (우선순위 높음)
  const key = formatDateKey(date);
  if (TEMPORARY_HOLIDAYS[key]) {
    return TEMPORARY_HOLIDAYS[key];
  }

  // 2. 라이브러리 공휴일 확인
  // 라이브러리는 로컬 시간 기준이므로 날짜 객체를 그대로 사용
  const holiday = hd.isHoliday(date);

  if (!holiday) return null;

  if (Array.isArray(holiday)) {
    return holiday[0]?.name ?? null;
  }

  return (holiday as { name: string }).name;
}

/**
 * 특정 날짜가 공휴일인지 확인
 * @param date 확인할 날짜
 * @returns 공휴일 여부
 */
export function isHoliday(date: Date): boolean {
  // 1. 임시 공휴일 확인
  const key = formatDateKey(date);
  if (TEMPORARY_HOLIDAYS[key]) {
    return true;
  }

  // 2. 라이브러리 공휴일 확인
  // 일요일은 기본휴일이므로 공휴일 체크에서 제외될 수 있으나,
  // date-holidays는 국경일/명절 등을 체크해줌
  return !!hd.isHoliday(date);
}

/**
 * 특정 연도의 모든 공휴일 날짜 배열 반환
 * @param year 연도
 * @returns Date 배열
 */
export function getHolidaysForYear(year: number): Date[] {
  const holidays: Date[] = [];

  // 1. 임시 공휴일 추가
  Object.keys(TEMPORARY_HOLIDAYS).forEach((key) => {
    const [y, m, d] = key.split('-').map(Number);
    if (y === year) {
      holidays.push(new Date(y, m! - 1, d));
    }
  });

  // 2. 라이브러리 공휴일 추가
  const libHolidays = hd.getHolidays(year);
  if (libHolidays) {
    libHolidays.forEach((h) => {
      holidays.push(new Date(h.date));
    });
  }

  return holidays;
}
