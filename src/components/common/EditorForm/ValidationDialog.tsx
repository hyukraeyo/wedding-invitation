'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/Dialog';
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
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const handleOpenAutoFocus = React.useCallback((event: Event) => {
    event.preventDefault();
    contentRef.current?.focus({ preventScroll: true });
  }, []);

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
    <Dialog open={open} onOpenChange={onOpenChange} mobileBottomSheet>
      <Dialog.Content
        ref={contentRef}
        tabIndex={-1}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        <Dialog.Header>
          <Dialog.Title>입력 확인</Dialog.Title>
          <Dialog.Description>필수 항목을 확인해주세요.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          {invalidSummaries.length > 0 && (
            <div className={styles.invalidSummaryList}>
              {invalidSummaries.map((summary) => (
                <Button
                  key={`${summary.sectionKey}-${summary.fieldLabel}`}
                  size="md"
                  variant="outline"
                  className={styles.invalidSummaryButton}
                  onClick={() => onSummaryClick(summary)}
                >
                  {summary.sectionLabel} - {summary.fieldLabel}
                </Button>
              ))}
            </div>
          )}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
});

ValidationDialog.displayName = 'ValidationDialog';

export { ValidationDialog };
