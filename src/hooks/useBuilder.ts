import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';

/**
 * 섹션 전체의 유효성 검사 상태를 관리하는 훅
 * @param sectionValue 섹션의 고유 식별자 (예: 'greeting', 'basic')
 */
export function useBuilderSection(sectionValue: string, isComplete?: boolean) {
  const { validationErrors, removeValidationError } = useInvitationStore(
    useShallow((state) => ({
      validationErrors: state.validationErrors,
      removeValidationError: state.removeValidationError,
    }))
  );

  const isInvalid = validationErrors.includes(sectionValue);

  const clearError = useCallback(() => {
    if (isInvalid) {
      removeValidationError(sectionValue);
    }
  }, [isInvalid, removeValidationError, sectionValue]);

  // isComplete가 true이고 섹션이 유효하지 않은 경우 자동으로 에러 제거
  useEffect(() => {
    if (isInvalid && isComplete) {
      clearError();
    }
  }, [isInvalid, isComplete, clearError]);

  return { isInvalid, clearError };
}

interface UseBuilderFieldProps<T> {
  value: T;
  onChange: (value: T) => void;
  fieldName: string; // validation key to remove on change
  transform?: (value: string) => T;
}

/**
 * 개별 필드의 값 변경 및 에러 상태를 관리하는 훅
 * @param props.value 현재 값
 * @param props.onChange 값을 업데이트하는 함수
 * @param props.fieldName 유효성 검사 키 (변경 시 이 키의 에러를 제거함)
 * @param props.transform 입력값 전처리 함수 (선택 사항)
 */
export function useBuilderField<T = string>({
  value,
  onChange,
  fieldName,
  transform,
}: UseBuilderFieldProps<T>) {
  const { validationErrors, removeValidationError } = useInvitationStore(
    useShallow((state) => ({
      validationErrors: state.validationErrors,
      removeValidationError: state.removeValidationError,
    }))
  );

  const isInvalid = validationErrors.includes(fieldName);

  // Input, Textarea 등 이벤트 기반 핸들러
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const transformedValue = transform ? transform(newValue) : (newValue as unknown as T);
      onChange(transformedValue);

      if (isInvalid) {
        removeValidationError(fieldName);
      }
    },
    [onChange, fieldName, transform, isInvalid, removeValidationError]
  );

  // DatePicker, Select 등 직접 값을 전달받는 컴포넌트용 핸들러
  const handleValueChange = useCallback(
    (newValue: T) => {
      onChange(newValue);
      if (isInvalid) {
        removeValidationError(fieldName);
      }
    },
    [onChange, fieldName, isInvalid, removeValidationError]
  );

  return {
    value,
    onChange: handleChange,
    onValueChange: handleValueChange,
    isInvalid,
  };
}
