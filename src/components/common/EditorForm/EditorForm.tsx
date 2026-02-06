'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/Button';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { Form } from '@/components/ui/Form';
import { Skeleton } from '@/components/ui/Skeleton';
import { useInvitationStore } from '@/store/useInvitationStore';
import { clsx } from 'clsx';
import styles from './EditorForm.module.scss';

// Dynamic imports for optimized initial bundle
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
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const { editingSection, setEditingSection } = useInvitationStore(
    useShallow((state) => ({
      editingSection: state.editingSection,
      setEditingSection: state.setEditingSection,
    }))
  );

  // When sections change, identify if a new section was opened to update the preview
  const handleValueChange = useCallback(
    (value: string[]) => {
      // Find if a new section was added
      const added = value.find((v) => !openSections.includes(v));

      if (added) {
        setEditingSection(added);
      } else if (value.length === 0) {
        // If all sections are closed, clear the editing section
        setEditingSection(null);
      } else if (editingSection && !value.includes(editingSection)) {
        // If the current editing section was closed, set it to the last remaining open one or null
        setEditingSection(value[value.length - 1] ?? null);
      }

      setOpenSections(value);
    },
    [openSections, editingSection, setEditingSection]
  );

  // Delay rendering to ensure all icons are loaded for smooth appearance
  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleToggle = useCallback(
    (key: string, isOpen: boolean) => {
      const nextOpenSections = isOpen
        ? [...openSections, key]
        : openSections.filter((s) => s !== key);

      handleValueChange(nextOpenSections);
    },
    [openSections, handleValueChange]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      setWasSubmitted(true);

      const isValid = form.checkValidity();

      if (!isValid) {
        // 1. Find the first invalid element
        const firstInvalid = form.querySelector<HTMLElement>(':invalid, [aria-invalid="true"]');

        if (firstInvalid) {
          // 2. Identify which accordion section it belongs to
          // We navigate up to find the element with [data-value] or [data-section]
          // Our SectionAccordion passes 'value' to AccordionItem
          const sectionItem = firstInvalid.closest('[data-radix-collection-item]');
          const sectionValue = sectionItem?.getAttribute('data-value');

          if (sectionValue && !openSections.includes(sectionValue)) {
            // Open the section
            handleToggle(sectionValue, true);

            // 3. Scroll and focus after expansion
            setTimeout(() => {
              firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
              firstInvalid.focus();
            }, 350); // Matches accordion animation duration
          } else {
            firstInvalid.focus();
          }
        }

        setIsValidationOpen(true);
        return;
      }

      // Additional store-based validation for edge cases if necessary
      // (Currently handled via native HTML5 validation triggered by Radix)

      onSubmit?.();
    },
    [onSubmit, openSections, handleToggle]
  );

  if (!isReady) {
    return (
      <div className={styles.loadingContainer}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.skeletonItem}>
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
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            const form = document.getElementById(formId) as HTMLFormElement;
            if (form) {
              const firstInvalid = form.querySelector<HTMLElement>(
                ':invalid, [aria-invalid="true"]'
              );
              firstInvalid?.focus();
            }
          }}
        >
          <AlertDialog.Header>
            <AlertDialog.Title>입력 확인</AlertDialog.Title>
            <AlertDialog.Description>필수 항목을 확인해주세요.</AlertDialog.Description>
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
