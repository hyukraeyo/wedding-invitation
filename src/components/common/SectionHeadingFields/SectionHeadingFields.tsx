import * as React from 'react';
import { clsx } from 'clsx';

import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { TextField } from '@/components/ui/TextField';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { isBlank } from '@/lib/utils';
import styles from './SectionHeadingFields.module.scss';

const DEFAULT_VALIDATION_MESSAGE = '필수 항목이에요.';

export interface SectionHeadingFieldConfig {
  value: string;
  /** Direct string value change handler (preferred) */
  onValueChange?: (value: string) => void;
  /** Raw input change event handler (use onValueChange instead for simpler API) */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  fieldName?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  message?: React.ReactNode;
  showMessage?: boolean;
  type?: React.HTMLInputTypeAttribute;
}

export interface SectionHeadingContentFieldConfig {
  control: React.ReactNode;
  fieldName?: string;
  label?: string;
  id?: string;
  message?: React.ReactNode;
  showMessage?: boolean;
  /** @deprecated Use required + hiddenValue instead */
  hiddenControl?: React.ReactNode;
  /** Whether the content field is required for form validation */
  required?: boolean;
  /** Plain text value for hidden validation input */
  hiddenValue?: string;
  /** Accessible label for the hidden input */
  ariaLabel?: string;
}

export interface SectionHeadingFieldsProps {
  subtitle?: SectionHeadingFieldConfig;
  title?: SectionHeadingFieldConfig;
  contentField?: SectionHeadingContentFieldConfig;
  fieldOrder?: 'subtitle-first' | 'title-first';
  className?: string;
  prefix?: string;
}

const SectionHeadingFields = React.memo<SectionHeadingFieldsProps>(function SectionHeadingFields({
  subtitle,
  title,
  contentField,
  fieldOrder = 'title-first',
  className,
  prefix,
}) {
  const fields = fieldOrder === 'title-first' ? [title, subtitle] : [subtitle, title];

  return (
    <div className={clsx(styles.container, className)}>
      {fields.map((field) => {
        if (!field) {
          return null;
        }

        const {
          fieldName = prefix ? `${prefix}-${field === subtitle ? 'subtitle' : 'title'}` : '',
          id = prefix ? `${prefix}-${field === subtitle ? 'subtitle' : 'title'}` : '',
          label = field === subtitle ? '소제목' : '제목',
          required = true,
          type = 'text',
        } = field;

        const isFieldInvalid = field.invalid ?? (required && isBlank(field.value));
        const showMessage = field.showMessage ?? isFieldInvalid;
        const message = field.message ?? (showMessage ? DEFAULT_VALIDATION_MESSAGE : undefined);

        if (!fieldName || !id) {
          console.warn('SectionHeadingFields: fieldName or id is missing and no prefix provided');
          return null;
        }

        return (
          <FormField key={fieldName} name={fieldName}>
            {message ? (
              <FormHeader>
                <FormLabel htmlFor={id}>{label}</FormLabel>
                <FormMessage forceMatch={Boolean(showMessage)}>{message}</FormMessage>
              </FormHeader>
            ) : (
              <FormLabel htmlFor={id}>{label}</FormLabel>
            )}
            <FormControl asChild>
              <TextField
                id={id}
                type={type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={
                  field.onChange ??
                  (field.onValueChange
                    ? (e: React.ChangeEvent<HTMLInputElement>) =>
                        field.onValueChange!(e.target.value)
                    : undefined)
                }
                required={required}
                invalid={isFieldInvalid}
              />
            </FormControl>
          </FormField>
        );
      })}
      {contentField ? <ContentFieldRenderer contentField={contentField} prefix={prefix} /> : null}
    </div>
  );
});

SectionHeadingFields.displayName = 'SectionHeadingFields';

/** Internal sub-component for contentField rendering */
function ContentFieldRenderer({
  contentField,
  prefix,
}: {
  contentField: SectionHeadingContentFieldConfig;
  prefix?: string | undefined;
}) {
  const fieldName = contentField.fieldName || (prefix ? `${prefix}-message` : '');
  const id = contentField.id || (prefix ? `${prefix}-message` : undefined);
  const label = contentField.label || '내용';
  const required = contentField.required ?? true;

  // Render hidden validation input internally when hiddenValue is provided
  const isFieldInvalid = required && isBlank(contentField.hiddenValue ?? '');
  const showMessage = contentField.showMessage ?? isFieldInvalid;
  const message = contentField.message ?? (showMessage ? DEFAULT_VALIDATION_MESSAGE : undefined);

  const hiddenInput =
    contentField.hiddenValue !== undefined ? (
      <FormControl asChild>
        <VisuallyHidden asChild>
          <input
            id={id}
            aria-label={contentField.ariaLabel || `${prefix} ${label}`}
            required={required}
            readOnly
            value={contentField.hiddenValue}
          />
        </VisuallyHidden>
      </FormControl>
    ) : (
      contentField.hiddenControl
    );

  return (
    <FormField name={fieldName}>
      {message ? (
        <FormHeader>
          <FormLabel htmlFor={id}>{label}</FormLabel>
          <FormMessage forceMatch={Boolean(showMessage)}>{message}</FormMessage>
        </FormHeader>
      ) : (
        <FormLabel htmlFor={id}>{label}</FormLabel>
      )}
      {contentField.control}
      {hiddenInput}
    </FormField>
  );
}

export { SectionHeadingFields };
