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
import { useShallow } from 'zustand/react/shallow';

import { Form } from '@/components/ui/Form';
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
  INVALID_FIELD_SELECTOR,
  type InvalidFieldSummary,
} from '@/lib/builderFormValidation';
import { toInvitationData } from '@/lib/builderSave';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';

import { NavRail, type SectionEntry } from './NavRail';
import { EditorLoading } from './EditorLoading';
import { ValidationDialog } from './ValidationDialog';
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

const SECTIONS: (SectionEntry & { Component: BuilderSectionComponent })[] = EDITOR_SECTION_KEYS.map(
  (key) => ({
    key,
    label: EDITOR_SECTION_NAV_LABEL[key],
    icon: SECTION_ICONS[key],
    Component: SECTION_COMPONENTS[key],
  })
);

const DEFAULT_ACTIVE_SECTION: EditorSectionKey = 'mainScreen';
const REQUIRED_FIELD_ID_SUFFIX = '-required';
const UPLOADER_FIELD_ID_SUFFIX = '-uploader';
const SUMMARY_FOCUS_MAX_RETRIES = 8;
const SUMMARY_FOCUS_RETRY_DELAY_MS = 60;

const normalizeValidationKey = (id: string): string =>
  id.endsWith(REQUIRED_FIELD_ID_SUFFIX) ? id.slice(0, -REQUIRED_FIELD_ID_SUFFIX.length) : id;

interface EditorFormProps {
  formId: string;
  onSubmit?: () => void;
}

const EditorForm = React.memo(function EditorForm({ formId, onSubmit }: EditorFormProps) {
  const [isReady, setIsReady] = React.useState(false);
  const [isValidationOpen, setIsValidationOpen] = React.useState(false);
  const [invalidSummaries, setInvalidSummaries] = React.useState<InvalidFieldSummary[]>([]);

  const contentAreaRef = React.useRef<HTMLFormElement | null>(null);
  const skipDialogAutoFocusRef = React.useRef(false);

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

  const focusInvalidField = React.useCallback((form: HTMLFormElement) => {
    findFirstInvalidElement(form)?.focus();
  }, []);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;

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
      const htmlFieldIds = Array.from(form.querySelectorAll(INVALID_FIELD_SELECTOR))
        .map((element) => element.getAttribute('id'))
        .filter((id): id is string => Boolean(id))
        .map(normalizeValidationKey);

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
      skipDialogAutoFocusRef.current = true;
      if (activeSection !== summary.sectionKey) {
        handleSectionChange(summary.sectionKey);
      }

      setIsValidationOpen(false);

      const getTargetById = () => {
        const baseId = summary.fieldId;
        if (!baseId) {
          return null;
        }

        const candidateIds = [
          baseId,
          `${baseId}${REQUIRED_FIELD_ID_SUFFIX}`,
          `${baseId}${UPLOADER_FIELD_ID_SUFFIX}`,
        ];

        for (const candidateId of candidateIds) {
          const target = document.getElementById(candidateId);
          if (target) {
            return target as HTMLElement;
          }
        }

        return null;
      };

      const tryFocus = (attempt: number) => {
        const form = document.getElementById(formId) as HTMLFormElement | null;
        if (!form) {
          return;
        }

        const target = getTargetById() ?? findFirstInvalidElement(form);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.focus();
          return;
        }

        if (attempt >= SUMMARY_FOCUS_MAX_RETRIES) {
          return;
        }

        window.setTimeout(() => tryFocus(attempt + 1), SUMMARY_FOCUS_RETRY_DELAY_MS);
      };

      window.setTimeout(() => tryFocus(0), 0);
    },
    [activeSection, formId, handleSectionChange]
  );

  if (!isReady) {
    return <EditorLoading />;
  }

  return (
    <>
      <div className={styles.wrapper}>
        <NavRail
          sections={SECTIONS}
          activeSection={activeSection}
          activeSectionIndex={activeSectionIndex}
          validationErrors={validationErrors}
          onSectionChange={handleSectionChange}
        />

        <Form
          ref={contentAreaRef}
          id={formId}
          onSubmit={handleSubmit}
          noValidate
          className={styles.contentArea}
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

      <ValidationDialog
        open={isValidationOpen}
        onOpenChange={setIsValidationOpen}
        formId={formId}
        invalidSummaries={invalidSummaries}
        onSummaryClick={handleInvalidSummaryClick}
        skipDialogAutoFocusRef={skipDialogAutoFocusRef}
      />
    </>
  );
});

EditorForm.displayName = 'EditorForm';

export default EditorForm;
