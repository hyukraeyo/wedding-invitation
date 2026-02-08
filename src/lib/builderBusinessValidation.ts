import type { InvitationData } from '@/store/useInvitationStore';
import {
  getBuilderValidationIssues,
  type BuilderValidationIssue,
  type EditorSectionKey,
} from '@/lib/builderValidation';

interface BuilderValidationResult {
  isValid: boolean;
  message?: string;
  invalidSectionKeys: EditorSectionKey[];
  issues: BuilderValidationIssue[];
}

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
