import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@/components/ui/TextField';

import { isValidKoreanNameValue } from '@/lib/utils';

export { isValidKoreanNameValue };

export interface NameFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  allowSpace?: boolean;
  allowMiddleDot?: boolean;
  allowLatin?: boolean;
  maxLength?: number;
  invalid?: boolean;
}

/**
 * NameField: 한국어 이름 입력에 최적화된 TextField입니다.
 * 자음/모음 분리 입력 방지 및 이름 규칙 스캐닝을 지원합니다.
 */
export const NameField = forwardRef<HTMLInputElement, NameFieldProps>((props, ref) => {
  const {
    value,
    onValueChange,
    allowSpace,
    allowMiddleDot,
    allowLatin,
    maxLength,
    error,
    onBlur,
    ...rest
  } = props;

  const [isBlurred, setIsBlurred] = React.useState(false);

  /*
   * 최신 입력 핸들링 권장 패턴 (Korean IME Support):
   * 1. onChange에서 입력 즉시 제어(Sanitization)를 할 때는 자음/모음(ㄱ-ㅎ, ㅏ-ㅣ)을 허용해야
   *    한글 조합이 끊기지 않고 자연스럽게 입력됩니다.
   * 2. 최종 유효성 검사는 입력이 끝난 onBlur 시점에 수행하여 완성된 글자인지 확인합니다.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    // 한글(자모 포함), 영문, 공백만 허용 (숫자/특수문자 제거)
    const sanitized = nextValue.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]/g, '');

    // 값이 변경된 경우에만 업데이트
    if (sanitized !== value) {
      onValueChange(sanitized);
    } else if (sanitized !== nextValue) {
      // 입력이 차단된 경우(숫자 등), 강제로 리렌더링하여 UI 동기화
      onValueChange(sanitized);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsBlurred(true);
    onBlur?.(e);
  };

  const isInvalid = isBlurred && value.length > 0 && !isValidKoreanNameValue(value);
  const errorMessage = error || (isInvalid ? '올바른 이름을 입력해주세요.' : undefined);

  return (
    <TextField
      ref={ref}
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      error={errorMessage}
      onBlur={handleBlur}
      autoComplete="name" // 이름 자동완성
      autoCorrect="off" // 모바일 자동수정 방지
      spellCheck={false} // 빨간 밑줄 방지
      {...rest}
    />
  );
});

NameField.displayName = 'NameField';
