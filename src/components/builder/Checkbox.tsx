'use client';

import React, { useId } from 'react';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * TDS Checkbox Component
 * Reference: https://tossmini-docs.toss.im/tds-mobile/components/checkbox/
 * 
 * Supports two variants:
 * - Checkbox.Circle: 체크 아이콘이 원으로 감싸진 형태
 * - Checkbox.Line: 체크 아이콘이 단독으로 표현
 */

export interface CheckboxBaseProps {
    /** Controlled: 체크 상태 */
    checked?: boolean | undefined;
    /** Uncontrolled: 초기 체크 상태 */
    defaultChecked?: boolean | undefined;
    /** 체크 상태 변경 콜백 */
    onCheckedChange?: ((checked: boolean) => void) | undefined;
    /** 비활성화 */
    disabled?: boolean | undefined;
    /** 라벨 */
    children?: React.ReactNode | undefined;
    /** 추가 className */
    className?: string | undefined;
    /** id */
    id?: string | undefined;
    /** Checkbox variant (circle maps to rounded-full, line is default square) */
    variant?: 'circle' | 'line' | undefined;
    /** 라벨 (기존 호환성) */
    label?: string | undefined;
    /** native onChange (기존 호환성) */
    onChange?: ((checked: boolean) => void) | undefined;
}

const CheckboxBase = ({
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    children,
    className,
    id,
    variant = "line",
    label,
    onChange
}: CheckboxBaseProps) => {
    // Handle legacy onChange that might expect event or boolean
    const handleCheckedChange = (chk: boolean) => {
        onCheckedChange?.(chk);
        if (onChange) {
            // emulate trivial event or just call with chk if legacy used boolean
            onChange(chk);
        }
    };

    const reactId = useId();
    const uniqueId = id || reactId;

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <ShadcnCheckbox
                id={uniqueId}
                {...(checked !== undefined ? { checked } : {})}
                {...(defaultChecked !== undefined ? { defaultChecked } : {})}
                onCheckedChange={handleCheckedChange}
                disabled={disabled ?? undefined}
                className={cn(variant === 'circle' && "rounded-full")}
            />
            {children || label ? (
                <Label
                    htmlFor={uniqueId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label || children}
                </Label>
            ) : null}
        </div>
    );
};

// Checkbox.Circle - 원형 체크박스
const CheckboxCircle = (props: CheckboxBaseProps) => (
    <CheckboxBase {...props} variant="circle" />
);
CheckboxCircle.displayName = 'Checkbox.Circle';

// Checkbox.Line - 라인 체크박스
const CheckboxLine = (props: CheckboxBaseProps) => (
    <CheckboxBase {...props} variant="line" />
);
CheckboxLine.displayName = 'Checkbox.Line';

/**
 * 기본 Checkbox (기존 호환성 유지 - Circle 스타일 사용)
 * 새로운 코드에서는 Checkbox.Circle 또는 Checkbox.Line 사용 권장
 */
export const Checkbox = (props: CheckboxBaseProps) => {
    return <CheckboxCircle {...props} />; // Default to Circle as per original legacy wrapper
};

// Compound Component Pattern
Checkbox.Circle = CheckboxCircle;
Checkbox.Line = CheckboxLine;

export { CheckboxCircle, CheckboxLine };
