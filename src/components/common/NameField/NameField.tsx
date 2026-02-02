import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@/components/ui/TextField';
import { useKoreanNameInput } from '@/hooks/useKoreanNameInput';
export { isValidKoreanNameValue } from '@/lib/utils';

export interface NameFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    value: string;
    onValueChange: (value: string) => void;
    allowSpace?: boolean;
    allowMiddleDot?: boolean;
    allowLatin?: boolean;
    maxLength?: number;
    invalid?: boolean;
}

/**
 * NameField: 한국어 이름 입력에 최적화된 TextField입니다.
 * 자음/모음 분리 입력 방지 및 이름 규칙 스캐닝을 지원합니다.
 */
export const NameField = forwardRef<HTMLInputElement, NameFieldProps>((props, ref) => {
    const {
        value,
        onValueChange,
        allowSpace = false,
        allowMiddleDot = true,
        allowLatin = false,
        maxLength,
        ...rest
    } = props;

    const nameInputProps = useKoreanNameInput({
        value,
        onValueChange,
        allowSpace,
        allowMiddleDot,
        allowLatin,
        maxLength,
    });

    return (
        <TextField
            ref={ref}
            {...rest}
            {...nameInputProps}
        />
    );
});

NameField.displayName = 'NameField';
