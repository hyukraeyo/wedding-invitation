import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '../TextField';

export interface PhoneFieldProps extends TextFieldProps { }

/**
 * PhoneField: 전화번호 입력에 최적화된 TextField입니다.
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>((props, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        // simple formatter logic can be added here if needed
        if (props.onChange) {
            const event = {
                ...e,
                target: {
                    ...e.target,
                    value: value
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
