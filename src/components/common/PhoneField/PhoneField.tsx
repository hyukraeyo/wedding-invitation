import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@/components/ui/TextField';
import { formatPhoneNumber, isValidPhone } from '@/lib/utils';

export type PhoneFieldProps = TextFieldProps;

/**
 * PhoneField: 전화번호 입력에 최적화된 TextField입니다.
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>((props, ref) => {
  const { onChange, onBlur, value, error, ...rest } = props;
  const [isBlurred, setIsBlurred] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    const formattedValue = formatPhoneNumber(nextValue);

    if (onChange) {
      const event = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsBlurred(true);
    onBlur?.(e);
  };

  const isInvalid =
    isBlurred && typeof value === 'string' && value.length > 0 && !isValidPhone(value);
  const errorMessage = error || (isInvalid ? '올바른 전화번호를 입력해주세요.' : undefined);

  return (
    <TextField
      ref={ref}
      type="tel"
      inputMode="numeric"
      placeholder="010-0000-0000"
      value={value}
      error={errorMessage}
      {...rest}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});

PhoneField.displayName = 'PhoneField';
