import { useCallback } from 'react';
import { formatPhoneNumber } from '@/lib/utils';

/**
 * 한글 이름 입력 정제 함수
 * 한글(완성형+자모), 영문, 공백, 가운뎃점 허용
 */
export const sanitizeNameInput = (value: string): string => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s·]/g, '');
};

/**
 * 한글 이름 입력을 위한 커스텀 훅
 * @param setter - 상태 업데이트 함수
 * @returns onChange 핸들러
 */
export function useNameInput(setter: (value: string) => void) {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeNameInput(e.target.value);
      setter(sanitized);
    },
    [setter]
  );
}

/**
 * 전화번호 입력을 위한 커스텀 훅
 * @param setter - 상태 업데이트 함수
 * @returns onChange 핸들러
 */
export function usePhoneInput(setter: (value: string) => void) {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      setter(formatted);
    },
    [setter]
  );
}
