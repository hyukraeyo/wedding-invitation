import {
  EDITOR_SECTION_LABEL,
  SECTION_VALUE_TO_EDITOR_KEY,
  type EditorSectionKey,
} from '@/lib/builderValidation';

export const INVALID_FIELD_SELECTOR = ':invalid, [aria-invalid="true"]';

export type { EditorSectionKey };

export interface InvalidFieldSummary {
  sectionKey: EditorSectionKey;
  sectionLabel: string;
  fieldLabel: string;
  fieldId?: string | undefined;
}

export const findFirstInvalidElement = (form: HTMLFormElement): HTMLElement | null =>
  form.querySelector<HTMLElement>(INVALID_FIELD_SELECTOR);

export const mapSectionValueToEditorKey = (
  sectionValue: string | null
): EditorSectionKey | null => {
  if (!sectionValue) {
    return null;
  }

  return (
    SECTION_VALUE_TO_EDITOR_KEY[sectionValue as keyof typeof SECTION_VALUE_TO_EDITOR_KEY] ?? null
  );
};

export const getInvalidElementSectionKey = (
  invalidElement: HTMLElement
): EditorSectionKey | null => {
  const sectionItem =
    invalidElement.closest('[data-radix-collection-item]') ??
    invalidElement.closest('[data-state][data-value]'); // Radix Accordion Item fallback
  const sectionValue = sectionItem?.getAttribute('data-value') ?? null;
  return mapSectionValueToEditorKey(sectionValue);
};

const getSectionLabel = (sectionKey: EditorSectionKey): string => EDITOR_SECTION_LABEL[sectionKey];

const getInvalidFieldLabel = (form: HTMLFormElement, invalidElement: HTMLElement): string => {
  const ariaLabel = invalidElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  const id = invalidElement.getAttribute('id');
  if (id) {
    const label = form.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
    if (label?.textContent?.trim()) {
      return label.textContent.trim();
    }
  }

  const name = invalidElement.getAttribute('name');
  if (name) {
    return name;
  }

  return '필수 항목';
};

export const collectInvalidFieldSummaries = (form: HTMLFormElement): InvalidFieldSummary[] => {
  const invalidElements = Array.from(form.querySelectorAll<HTMLElement>(INVALID_FIELD_SELECTOR));
  const dedupe = new Set<string>();
  const summaries: InvalidFieldSummary[] = [];

  for (const invalidElement of invalidElements) {
    const sectionKey = getInvalidElementSectionKey(invalidElement);
    if (!sectionKey) {
      continue;
    }

    const sectionLabel = getSectionLabel(sectionKey);
    const fieldLabel = getInvalidFieldLabel(form, invalidElement);
    const dedupeKey = `${sectionKey}:${fieldLabel}`;
    if (dedupe.has(dedupeKey)) {
      continue;
    }

    dedupe.add(dedupeKey);
    const fieldId = invalidElement.getAttribute('id') || undefined;
    summaries.push({ sectionKey, sectionLabel, fieldLabel, fieldId });
  }

  return summaries;
};
