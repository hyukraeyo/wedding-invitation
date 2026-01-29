import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@/components/ui/TextField';
import { formatPhoneNumber } from '@/lib/utils';

export type PhoneFieldProps = TextFieldProps;

/**
 * PhoneField: 전화번호 입력에 최적화된 TextField입니다.
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>((props, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = formatPhoneNumber(value);

        if (props.onChange) {
            const event = {
                ...e,
                target: {
                    ...e.target,
                    value: formattedValue
                }
            } as React.ChangeEvent<HTMLInputElement>;
            props.onChange(event);
        }
    };

    return (
        <TextField
            ref={ref}
            type="tel"
            inputMode="numeric"
            placeholder="010-0000-0000"
            {...props}
            onChange={handleChange}
        />
    );
});

PhoneField.displayName = 'PhoneField';
