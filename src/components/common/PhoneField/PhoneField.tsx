import React from 'react';
import { formatPhoneNumber } from '@/lib/utils';
import { TextField } from '@/components/common/TextField';
import type { TextFieldProps } from '@/components/common/TextField';
import { Phone } from 'lucide-react';

type PhoneFieldProps = Omit<TextFieldProps, 'multiline' | 'rows'> &
    React.InputHTMLAttributes<HTMLInputElement> & {
        showIcon?: boolean;
        label?: React.ReactNode;
    };

export const PhoneField = React.forwardRef<HTMLInputElement, PhoneFieldProps>(
    ({ onChange, showIcon, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const formatted = formatPhoneNumber(e.target.value);
            if (onChange) {
                // 부모의 onChange에 포맷팅된 값을 전달
                const newEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: formatted,
                    },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(newEvent);
            }
        };

        return (
            <TextField
                {...props}
                ref={ref}
                onChange={handleChange}
                type="tel" // Force type to tel
                inputMode="numeric" // Force numeric keypad
                pattern="[0-9]*" // iOS numeric keypad trigger
                autoComplete="tel" // Enable browser autofill
                maxLength={13}
                right={showIcon ? <Phone size={16} /> : props.right}
            />
        );
    }
);

PhoneField.displayName = 'PhoneField';
