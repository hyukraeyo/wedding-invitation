import type { InvitationData } from '@/store/useInvitationStore';
import {
  getBuilderValidationIssues,
  type EditorSectionKey,
  type BuilderValidationIssue,
} from './builderValidation';

export interface BuilderValidationResult {
  isValid: boolean;
  message?: string;
  invalidSectionKeys: EditorSectionKey[];
  issues: BuilderValidationIssue[];
}

/**
 * 빌더 저장 시 비즈니스 로직 유효성 검사
 * Account 정보 미비, 이미지 누락 등을 체크합니다.
 */
export const validateBeforeBuilderSave = (data: InvitationData): BuilderValidationResult => {
  const issues = getBuilderValidationIssues(data);
  const invalidSectionKeys = Array.from(new Set(issues.map((issue) => issue.sectionKey)));

  if (issues.length > 0) {
    return {
      isValid: false,
      message: issues[0]?.message || '필수 입력 항목을 확인해주세요.',
      invalidSectionKeys,
      issues,
    };
  }

  return { isValid: true, invalidSectionKeys: [], issues: [] };
};
