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
import { validateBeforeBuilderSave } from '@/lib/builderBusinessValidation';
import { toInvitationData } from '@/lib/builderSave';
import { EDITOR_SECTION_LABEL } from '@/lib/builderValidation';
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

  const explicitFocusTargetRef = React.useRef<HTMLElement | null>(null);

  const { editingSection, setEditingSection, setValidationErrors } = useInvitationStore(
    useShallow((state) => ({
      editingSection: state.editingSection,
      setEditingSection: state.setEditingSection,
      setValidationErrors: state.setValidationErrors,
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

      // 1. HTML5 유효성 검사 (필수 입력값 등)
      const isHtmlValid = form.checkValidity();
      const htmlSummaries = isHtmlValid ? [] : collectInvalidFieldSummaries(form);
      const htmlInvalidSectionKeys = Array.from(new Set(htmlSummaries.map((s) => s.sectionKey)));

      // 2. 비즈니스 로직 유효성 검사 (이미지 누락, 계좌 정보 등)
      const currentStoreState = useInvitationStore.getState();
      const cleanData = toInvitationData(currentStoreState);
      const bizValidation = validateBeforeBuilderSave(cleanData);

      // 3. 모든 오류 섹션 키 결합
      const allInvalidSectionKeys = Array.from(
        new Set([...htmlInvalidSectionKeys, ...bizValidation.invalidSectionKeys])
      );

      // 3-1. 개별 필드 ID 수집 (입력창/이미지업로더 테두리 표시용)
      const bizFieldIds = bizValidation.issues.map((issue) => issue.fieldId);
      // HTML5 검사로 잡힌 요소들의 ID 수집
      const htmlFieldIds = Array.from(form.querySelectorAll(':invalid'))
        .map((el) => el.getAttribute('id'))
        .filter((id): id is string => Boolean(id));

      // 4. 스토어에 섹션 키 + 필드 ID 모두 저장
      const allInvalidKeys = Array.from(
        new Set([...allInvalidSectionKeys, ...bizFieldIds, ...htmlFieldIds])
      );
      setValidationErrors(allInvalidKeys);

      if (allInvalidSectionKeys.length > 0) {
        // 다이얼로그에 표시할 요약 정보 생성
        const bizSummaries: InvalidFieldSummary[] = bizValidation.issues.map((issue) => ({
          sectionKey: issue.sectionKey,
          sectionLabel: EDITOR_SECTION_LABEL[issue.sectionKey],
          fieldLabel: issue.fieldLabel,
          fieldId: issue.fieldId,
        }));

        // 중복 제거 (HTML5와 비즈니스 로직에서 동일한 필드가 걸릴 수 있음)
        const combinedSummaries = [...htmlSummaries];
        bizSummaries.forEach((biz) => {
          if (
            !combinedSummaries.find(
              (s) => s.sectionKey === biz.sectionKey && s.fieldLabel === biz.fieldLabel
            )
          ) {
            combinedSummaries.push(biz);
          }
        });

        setInvalidSummaries(combinedSummaries);
        focusInvalidField(form);
        setIsValidationOpen(true);
        return;
      }

      setInvalidSummaries([]);
      onSubmit?.();
    },
    [focusInvalidField, onSubmit, setValidationErrors]
  );

  const handleInvalidSummaryClick = useCallback(
    (summary: InvalidFieldSummary) => {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      if (!form) {
        return;
      }

      let target: HTMLElement | null = null;
      if (summary.fieldId) {
        target = document.getElementById(summary.fieldId);
      }

      if (!target) {
        target =
          findInvalidElementInSection(form, summary.sectionKey) ?? findFirstInvalidElement(form);
      }

      if (!target) {
        return;
      }

      explicitFocusTargetRef.current = target;

      if (!openSections.includes(summary.sectionKey)) {
        handleToggle(summary.sectionKey, true);
      }

      setIsValidationOpen(false);

      setTimeout(() => {
        if (explicitFocusTargetRef.current) {
          explicitFocusTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          explicitFocusTargetRef.current.focus();
          explicitFocusTargetRef.current = null;
        }
      }, 350);
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

            // 🍌 명시적인 포커스 타겟이 있으면 기본 동작(첫 번째 에러 포커스) 방지
            if (explicitFocusTargetRef.current) {
              return;
            }

            const form = document.getElementById(formId) as HTMLFormElement;
            if (form) {
              findFirstInvalidElement(form)?.focus();
            }
          }}
        >
          <AlertDialog.Header>
            <AlertDialog.Title>입력 확인</AlertDialog.Title>
            <AlertDialog.Description>필수 항목을 확인해주세요.</AlertDialog.Description>
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
