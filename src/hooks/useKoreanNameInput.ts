import * as React from 'react';
import { sanitizeKoreanName } from '@/lib/utils';

import { TextFieldEnterKeyHint } from '@/components/ui/TextField';

interface UseKoreanNameInputOptions {
  value: string;
  onValueChange: (nextValue: string) => void;
  allowSpace?: boolean;
  allowMiddleDot?: boolean;
  allowLatin?: boolean;
  maxLength?: number | undefined;
  enterKeyHint?: TextFieldEnterKeyHint;
}

export function useKoreanNameInput({
  value,
  onValueChange,
  allowSpace = false,
  allowMiddleDot = true,
  allowLatin = false,
  maxLength,
  enterKeyHint = 'next',
}: UseKoreanNameInputOptions) {
  const isComposingRef = React.useRef(false);

  const sanitize = React.useCallback(
    (nextValue: string) =>
      sanitizeKoreanName(nextValue, {
        allowSpace,
        allowMiddleDot,
        allowLatin,
        maxLength,
      }),
    [allowLatin, allowMiddleDot, allowSpace, maxLength]
  );

  const handleCompositionStart = React.useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = React.useCallback(
    (event: React.CompositionEvent<HTMLInputElement>) => {
      isComposingRef.current = false;
      const sanitized = sanitize(event.currentTarget.value);
      if (sanitized !== event.currentTarget.value) {
        onValueChange(sanitized);
      }
    },
    [onValueChange, sanitize]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      const isComposing =
        isComposingRef.current ||
        (event.nativeEvent instanceof InputEvent && event.nativeEvent.isComposing);

      if (isComposing) {
        onValueChange(nextValue);
        return;
      }

      onValueChange(sanitize(nextValue));
    },
    [onValueChange, sanitize]
  );

  return {
    value,
    onChange: handleChange,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    inputMode: 'text' as const,
    autoComplete: 'name' as const,
    spellCheck: false,
    enterKeyHint,
  };
}
