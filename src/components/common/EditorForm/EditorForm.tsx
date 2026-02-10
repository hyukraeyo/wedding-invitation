'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CreditCard,
  Images,
  Layout,
  MapPin,
  MessageCircle,
  Palette,
  Share2,
  User,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useShallow } from 'zustand/react/shallow';

import { AlertDialog } from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { Form } from '@/components/ui/Form';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import AccountsSection from '@/components/builder/sections/AccountsSection';
import BasicInfoSection from '@/components/builder/sections/BasicInfoSection';
import ClosingSection from '@/components/builder/sections/ClosingSection';
import DateTimeSection from '@/components/builder/sections/DateTimeSection';
import GallerySection from '@/components/builder/sections/GallerySection';
import GreetingSection from '@/components/builder/sections/GreetingSection';
import KakaoShareSection from '@/components/builder/sections/KakaoShareSection';
import LocationSection from '@/components/builder/sections/LocationSection';
import MainScreenSection from '@/components/builder/sections/MainScreenSection';
import ThemeSection from '@/components/builder/sections/ThemeSection';
import {
  EDITOR_SECTION_KEYS,
  EDITOR_SECTION_LABEL,
  EDITOR_SECTION_NAV_LABEL,
  type EditorSectionKey,
} from '@/constants/editorSections';
import { validateBeforeBuilderSave } from '@/lib/builderBusinessValidation';
import {
  collectInvalidFieldSummaries,
  findFirstInvalidElement,
  findInvalidElementInSection,
  getInvalidElementSectionKey,
  type InvalidFieldSummary,
} from '@/lib/builderFormValidation';
import { toInvitationData } from '@/lib/builderSave';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';

import styles from './EditorForm.module.scss';

type BuilderSectionComponent = React.ComponentType<SectionProps>;

const SECTION_COMPONENTS: Record<EditorSectionKey, BuilderSectionComponent> = {
  basic: BasicInfoSection,
  theme: ThemeSection,
  mainScreen: MainScreenSection,
  message: GreetingSection,
  gallery: GallerySection,
  date: DateTimeSection,
  location: LocationSection,
  account: AccountsSection,
  closing: ClosingSection,
  kakao: KakaoShareSection,
};

const SECTION_ICONS: Record<EditorSectionKey, LucideIcon> = {
  basic: User,
  theme: Palette,
  mainScreen: Layout,
  message: MessageCircle,
  gallery: Images,
  date: Calendar,
  location: MapPin,
  account: CreditCard,
  closing: Heart,
  kakao: Share2,
};

const SECTIONS = EDITOR_SECTION_KEYS.map((key) => ({
  key,
  label: EDITOR_SECTION_NAV_LABEL[key],
  icon: SECTION_ICONS[key],
  Component: SECTION_COMPONENTS[key],
}));

const DEFAULT_ACTIVE_SECTION: EditorSectionKey = 'mainScreen';
const NAV_INDICATOR_OFFSET = 12;
const NAV_ITEM_STRIDE = 72;

interface EditorFormProps {
  formId: string;
  onSubmit?: () => void;
}

const EditorForm = React.memo(function EditorForm({ formId, onSubmit }: EditorFormProps) {
  const [isReady, setIsReady] = React.useState(false);
  const [isValidationOpen, setIsValidationOpen] = React.useState(false);
  const [invalidSummaries, setInvalidSummaries] = React.useState<InvalidFieldSummary[]>([]);
  const [wasSubmitted, setWasSubmitted] = React.useState(false);

  const contentAreaRef = React.useRef<HTMLFormElement | null>(null);
  const explicitFocusTargetRef = React.useRef<HTMLElement | null>(null);

  const { editingSection, setEditingSection, validationErrors, setValidationErrors } =
    useInvitationStore(
      useShallow((state) => ({
        editingSection: state.editingSection,
        setEditingSection: state.setEditingSection,
        validationErrors: state.validationErrors,
        setValidationErrors: state.setValidationErrors,
      }))
    );

  const activeSection = editingSection ?? DEFAULT_ACTIVE_SECTION;
  const activeSectionIndex = SECTIONS.findIndex((section) => section.key === activeSection);

  React.useEffect(() => {
    const timer = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleSectionChange = React.useCallback(
    (key: EditorSectionKey) => {
      if (editingSection !== key) {
        setEditingSection(key);
      }

      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
      }
    },
    [editingSection, setEditingSection]
  );

  const focusInvalidField = React.useCallback(
    (form: HTMLFormElement) => {
      const firstInvalid = findFirstInvalidElement(form);
      if (!firstInvalid) {
        return;
      }

      const sectionKey = getInvalidElementSectionKey(firstInvalid);
      if (sectionKey && sectionKey !== activeSection) {
        handleSectionChange(sectionKey);
        setTimeout(() => {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }, 150);
        return;
      }

      firstInvalid.focus();
    },
    [activeSection, handleSectionChange]
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      setWasSubmitted(true);

      const isHtmlValid = form.checkValidity();
      const htmlSummaries = isHtmlValid ? [] : collectInvalidFieldSummaries(form);
      const htmlInvalidSectionKeys = Array.from(
        new Set(htmlSummaries.map((summary) => summary.sectionKey))
      );

      const currentStoreState = useInvitationStore.getState();
      const cleanData = toInvitationData(currentStoreState);
      const bizValidation = validateBeforeBuilderSave(cleanData);

      const allInvalidSectionKeys = Array.from(
        new Set([...htmlInvalidSectionKeys, ...bizValidation.invalidSectionKeys])
      );

      const bizFieldIds = bizValidation.issues.map((issue) => issue.fieldId);
      const htmlFieldIds = Array.from(form.querySelectorAll(':invalid'))
        .map((element) => element.getAttribute('id'))
        .filter((id): id is string => Boolean(id));

      const allInvalidKeys = Array.from(
        new Set([...allInvalidSectionKeys, ...bizFieldIds, ...htmlFieldIds])
      );
      setValidationErrors(allInvalidKeys);

      if (allInvalidSectionKeys.length > 0) {
        const bizSummaries: InvalidFieldSummary[] = bizValidation.issues.map((issue) => ({
          sectionKey: issue.sectionKey,
          sectionLabel: EDITOR_SECTION_LABEL[issue.sectionKey],
          fieldLabel: issue.fieldLabel,
          fieldId: issue.fieldId,
        }));

        const combinedSummaries = [...htmlSummaries];
        bizSummaries.forEach((summary) => {
          const duplicatedSummary = combinedSummaries.find(
            (item) =>
              item.sectionKey === summary.sectionKey && item.fieldLabel === summary.fieldLabel
          );

          if (!duplicatedSummary) {
            combinedSummaries.push(summary);
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

  const handleInvalidSummaryClick = React.useCallback(
    (summary: InvalidFieldSummary) => {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      if (!form) {
        return;
      }

      let target: HTMLElement | null = summary.fieldId
        ? document.getElementById(summary.fieldId)
        : null;
      if (!target) {
        target =
          findInvalidElementInSection(form, summary.sectionKey) ?? findFirstInvalidElement(form);
      }
      if (!target) {
        return;
      }

      explicitFocusTargetRef.current = target;
      if (activeSection !== summary.sectionKey) {
        handleSectionChange(summary.sectionKey);
      }

      setIsValidationOpen(false);

      setTimeout(() => {
        if (!explicitFocusTargetRef.current) {
          return;
        }

        explicitFocusTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        explicitFocusTargetRef.current.focus();
        explicitFocusTargetRef.current = null;
      }, 150);
    },
    [activeSection, formId, handleSectionChange]
  );

  if (!isReady) {
    return (
      <div className={styles.loadingContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeletonItem}>
            <div className={styles.skeletonLeft}>
              <Skeleton className={styles.skeletonIcon ?? ''} />
              <div className={styles.skeletonText}>
                <Skeleton className={styles.skeletonTitle ?? ''} />
                <Skeleton className={styles.skeletonSubtitle ?? ''} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <nav className={styles.navRail}>
          <div
            className={styles.activeIndicator}
            style={{
              transform: `translateY(${NAV_INDICATOR_OFFSET + Math.max(activeSectionIndex, 0) * NAV_ITEM_STRIDE}px)`,
            }}
          />
          {SECTIONS.map(({ key, label, icon: Icon }) => {
            const isInvalid = validationErrors.includes(key);
            const isActive = activeSection === key;

            return (
              <IconButton
                key={key}
                unstyled
                className={clsx(
                  styles.navItem,
                  styles.navItemLayer,
                  isActive && styles.active,
                  isInvalid && styles.invalid
                )}
                onClick={() => handleSectionChange(key)}
                aria-label={`${label} 섹션으로 이동`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={styles.navIcon} strokeWidth={isActive ? 2.5 : 2} />
                <span className={styles.navLabel}>{label}</span>
              </IconButton>
            );
          })}
        </nav>

        <Form
          ref={contentAreaRef}
          id={formId}
          onSubmit={handleSubmit}
          noValidate
          className={clsx(styles.contentArea, wasSubmitted && 'was-submitted')}
        >
          <AnimatePresence mode="wait" initial={false}>
            {SECTIONS.map(({ key, Component }) => {
              if (activeSection !== key) {
                return null;
              }

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%' }}
                >
                  <Component value={key} isOpen />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Form>
      </div>

      <AlertDialog open={isValidationOpen} onOpenChange={setIsValidationOpen}>
        <AlertDialog.Content
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (explicitFocusTargetRef.current) {
              return;
            }

            const form = document.getElementById(formId) as HTMLFormElement | null;
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
                  <Button
                    key={`${summary.sectionKey}-${summary.fieldLabel}`}
                    variant="unstyled"
                    className={styles.invalidSummaryItem}
                    onClick={() => handleInvalidSummaryClick(summary)}
                  >
                    {summary.sectionLabel} - {summary.fieldLabel}
                  </Button>
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
