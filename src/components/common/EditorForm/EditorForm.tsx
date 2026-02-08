'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import { clsx } from 'clsx';

import { Button } from '@/components/ui/Button';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { Form } from '@/components/ui/Form';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  collectInvalidFieldSummaries,
  findInvalidElementInSection,
  findFirstInvalidElement,
  getInvalidElementSectionKey,
  type InvalidFieldSummary,
} from '@/lib/builderFormValidation';
import { useInvitationStore } from '@/store/useInvitationStore';

import styles from './EditorForm.module.scss';

const MainScreenSection = dynamic(() => import('@/components/builder/sections/MainScreenSection'));
const ThemeSection = dynamic(() => import('@/components/builder/sections/ThemeSection'));
const BasicInfoSection = dynamic(() => import('@/components/builder/sections/BasicInfoSection'));
const DateTimeSection = dynamic(() => import('@/components/builder/sections/DateTimeSection'));
const LocationSection = dynamic(() => import('@/components/builder/sections/LocationSection'));
const GreetingSection = dynamic(() => import('@/components/builder/sections/GreetingSection'));
const GallerySection = dynamic(() => import('@/components/builder/sections/GallerySection'));
const AccountsSection = dynamic(() => import('@/components/builder/sections/AccountsSection'));
const KakaoShareSection = dynamic(() => import('@/components/builder/sections/KakaoShareSection'));
const ClosingSection = dynamic(() => import('@/components/builder/sections/ClosingSection'));

const SECTIONS = [
  { key: 'basic', Component: BasicInfoSection },
  { key: 'theme', Component: ThemeSection },
  { key: 'mainScreen', Component: MainScreenSection },
  { key: 'message', Component: GreetingSection },
  { key: 'gallery', Component: GallerySection },
  { key: 'date', Component: DateTimeSection },
  { key: 'location', Component: LocationSection },
  { key: 'account', Component: AccountsSection },
  { key: 'closing', Component: ClosingSection },
  { key: 'kakao', Component: KakaoShareSection },
] as const;

interface EditorFormProps {
  formId: string;
  onSubmit?: () => void;
}

const EditorForm = memo(function EditorForm({ formId, onSubmit }: EditorFormProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [invalidSummaries, setInvalidSummaries] = useState<InvalidFieldSummary[]>([]);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const { editingSection, setEditingSection } = useInvitationStore(
    useShallow((state) => ({
      editingSection: state.editingSection,
      setEditingSection: state.setEditingSection,
    }))
  );

  const handleValueChange = useCallback(
    (value: string[]) => {
      const added = value.find((section) => !openSections.includes(section));

      if (added) {
        setEditingSection(added);
      } else if (value.length === 0) {
        setEditingSection(null);
      } else if (editingSection && !value.includes(editingSection)) {
        setEditingSection(value[value.length - 1] ?? null);
      }

      setOpenSections(value);
    },
    [editingSection, openSections, setEditingSection]
  );

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleToggle = useCallback(
    (key: string, isOpen: boolean) => {
      const nextOpenSections = isOpen
        ? [...openSections, key]
        : openSections.filter((section) => section !== key);

      handleValueChange(nextOpenSections);
    },
    [handleValueChange, openSections]
  );

  const focusInvalidField = useCallback(
    (form: HTMLFormElement) => {
      const firstInvalid = findFirstInvalidElement(form);
      if (!firstInvalid) {
        return;
      }

      const sectionKey = getInvalidElementSectionKey(firstInvalid);
      if (sectionKey && !openSections.includes(sectionKey)) {
        handleToggle(sectionKey, true);

        setTimeout(() => {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }, 350);
        return;
      }

      firstInvalid.focus();
    },
    [handleToggle, openSections]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      setWasSubmitted(true);

      const isValid = form.checkValidity();
      if (!isValid) {
        setInvalidSummaries(collectInvalidFieldSummaries(form));
        focusInvalidField(form);
        setIsValidationOpen(true);
        return;
      }
      setInvalidSummaries([]);

      onSubmit?.();
    },
    [focusInvalidField, onSubmit]
  );

  const handleInvalidSummaryClick = useCallback(
    (summary: InvalidFieldSummary) => {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      if (!form) {
        return;
      }

      const focusTarget = () => {
        const target =
          findInvalidElementInSection(form, summary.sectionKey) ?? findFirstInvalidElement(form);
        if (!target) {
          return;
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.focus();
      };

      if (!openSections.includes(summary.sectionKey)) {
        handleToggle(summary.sectionKey, true);
        setTimeout(focusTarget, 350);
      } else {
        focusTarget();
      }

      setIsValidationOpen(false);
    },
    [formId, handleToggle, openSections]
  );

  if (!isReady) {
    return (
      <div className={styles.loadingContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={styles.skeletonItem}>
            <div className={styles.skeletonLeft}>
              <Skeleton className={styles.skeletonIcon ?? ''} />
              <div className={styles.skeletonText}>
                <Skeleton className={styles.skeletonTitle ?? ''} />
                <Skeleton className={styles.skeletonSubtitle ?? ''} />
              </div>
            </div>
            <Skeleton className={styles.skeletonChevron ?? ''} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Form
        id={formId}
        onSubmit={handleSubmit}
        noValidate
        className={clsx(styles.wrapper, wasSubmitted && 'was-submitted')}
      >
        <div className={styles.list}>
          {SECTIONS.map(({ key, Component }) => (
            <Component
              key={key}
              value={key}
              isOpen={openSections.includes(key)}
              onToggle={(isOpen) => handleToggle(key, isOpen)}
            />
          ))}
        </div>
      </Form>

      <AlertDialog open={isValidationOpen} onOpenChange={setIsValidationOpen}>
        <AlertDialog.Content
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const form = document.getElementById(formId) as HTMLFormElement;
            if (form) {
              findFirstInvalidElement(form)?.focus();
            }
          }}
        >
          <AlertDialog.Header>
            <AlertDialog.Title>입력 확인</AlertDialog.Title>
            <AlertDialog.Description>
              필수 항목을 확인해주세요.
            </AlertDialog.Description>
            {invalidSummaries.length > 0 ? (
              <div className={styles.invalidSummaryList}>
                {invalidSummaries.map((summary) => (
                  <button
                    key={`${summary.sectionKey}-${summary.fieldLabel}`}
                    type="button"
                    className={styles.invalidSummaryItem}
                    onClick={() => handleInvalidSummaryClick(summary)}
                  >
                    {summary.sectionLabel} - {summary.fieldLabel}
                  </button>
                ))}
              </div>
            ) : null}
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Action asChild>
              <Button type="button" onClick={() => setIsValidationOpen(false)}>
                확인
              </Button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
});

EditorForm.displayName = 'EditorForm';

export default EditorForm;
