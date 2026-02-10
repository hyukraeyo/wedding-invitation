'use client';

import * as React from 'react';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import type { InvalidFieldSummary } from '@/lib/builderFormValidation';
import { findFirstInvalidElement } from '@/lib/builderFormValidation';
import styles from './EditorForm.module.scss';

interface ValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  invalidSummaries: InvalidFieldSummary[];
  onSummaryClick: (summary: InvalidFieldSummary) => void;
  skipDialogAutoFocusRef: React.MutableRefObject<boolean>;
}

const ValidationDialog = React.memo(function ValidationDialog({
  open,
  onOpenChange,
  formId,
  invalidSummaries,
  onSummaryClick,
  skipDialogAutoFocusRef,
}: ValidationDialogProps) {
  const handleCloseAutoFocus = React.useCallback(
    (event: Event) => {
      event.preventDefault();

      if (skipDialogAutoFocusRef.current) {
        skipDialogAutoFocusRef.current = false;
        return;
      }

      const form = document.getElementById(formId) as HTMLFormElement | null;
      if (form) {
        findFirstInvalidElement(form)?.focus();
      }
    },
    [formId, skipDialogAutoFocusRef]
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content onCloseAutoFocus={handleCloseAutoFocus}>
        <AlertDialog.Header>
          <AlertDialog.Title>입력 확인</AlertDialog.Title>
          <AlertDialog.Description>필수 항목을 확인해주세요.</AlertDialog.Description>
          {invalidSummaries.length > 0 && (
            <div className={styles.invalidSummaryList}>
              {invalidSummaries.map((summary) => (
                <Button
                  key={`${summary.sectionKey}-${summary.fieldLabel}`}
                  variant="unstyled"
                  className={styles.invalidSummaryItem}
                  onClick={() => onSummaryClick(summary)}
                >
                  {summary.sectionLabel} - {summary.fieldLabel}
                </Button>
              ))}
            </div>
          )}
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Action asChild>
            <Button type="button" onClick={() => onOpenChange(false)}>
              확인
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
});

ValidationDialog.displayName = 'ValidationDialog';

export { ValidationDialog };
