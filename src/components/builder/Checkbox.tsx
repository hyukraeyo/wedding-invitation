'use client';

import React, { useState, useCallback } from 'react';
import styles from './Checkbox.module.scss';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

/**
 * TDS Checkbox Component
 * Reference: https://tossmini-docs.toss.im/tds-mobile/components/checkbox/
 * 
 * Supports two variants:
 * - Checkbox.Circle: 체크 아이콘이 원으로 감싸진 형태
 * - Checkbox.Line: 체크 아이콘이 단독으로 표현
 */

interface CheckboxBaseProps {
    /** 체크박스 크기 (기본값: 24) */
    size?: number;
    /** Controlled: 체크 상태 */
    checked?: boolean;
    /** Uncontrolled: 초기 체크 상태 */
    defaultChecked?: boolean;
    /** 체크 상태 변경 콜백 */
    onCheckedChange?: (checked: boolean) => void;
    /** 비활성화 */
    disabled?: boolean;
    /** 라디오 버튼으로 활용 */
    inputType?: 'checkbox' | 'radio';
    /** 라디오 버튼 value */
    value?: string;
    /** native onChange (for radio) */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** 라벨 */
    children?: React.ReactNode;
    /** 추가 className */
    className?: string;
    /** id */
    id?: string;
    /** name (for radio group) */
    name?: string;
}

// Base Checkbox component logic
const CheckboxBase = ({
    variant,
    size = 24,
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    inputType = 'checkbox',
    value,
    onChange,
    children,
    className,
    id,
    name,
}: CheckboxBaseProps & { variant: 'circle' | 'line' }) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [isShaking, setIsShaking] = useState(false);

    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleClick = useCallback(() => {
        if (disabled) {
            // TDS: 비활성화된 Checkbox 클릭 시 좌우로 흔들리는 애니메이션
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 300);
            return;
        }

        const newChecked = !isChecked;
        if (!isControlled) {
            setInternalChecked(newChecked);
        }
        onCheckedChange?.(newChecked);
    }, [disabled, isChecked, isControlled, onCheckedChange]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (inputType === 'radio') {
            onChange?.(e);
        } else {
            const newChecked = e.target.checked;
            if (!isControlled) {
                setInternalChecked(newChecked);
            }
            onCheckedChange?.(newChecked);
        }
    }, [disabled, inputType, onChange, isControlled, onCheckedChange]);

    const iconSize = Math.round(size * 0.6);

    return (
        <label
            className={clsx(
                styles.container,
                className,
                disabled && styles.disabled
            )}
        >
            <div
                className={clsx(
                    styles.checkbox,
                    styles[variant],
                    isChecked && styles.checked,
                    disabled && styles.disabled,
                    isShaking && styles.shake
                )}
                style={{ width: size, height: size }}
                onClick={handleClick}
            >
                <input
                    type={inputType}
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    value={value}
                    id={id}
                    name={name}
                    style={{ display: 'none' }}
                />
                <Check
                    size={iconSize}
                    className={styles.icon}
                    strokeWidth={3}
                />
            </div>
            {children && <span className={styles.label}>{children}</span>}
        </label>
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

// 호환성을 위한 기존 Checkbox 인터페이스
interface LegacyCheckboxProps {
    id?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: React.ReactNode;
    label?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * 기본 Checkbox (기존 호환성 유지 - Circle 스타일 사용)
 * 새로운 코드에서는 Checkbox.Circle 또는 Checkbox.Line 사용 권장
 */
const Checkbox = ({
    checked,
    onChange,
    children,
    label,
    ...props
}: LegacyCheckboxProps) => (
    <CheckboxCircle
        checked={checked}
        onCheckedChange={onChange}
        {...props}
    >
        {label || children}
    </CheckboxCircle>
);

// Compound Component Pattern
Checkbox.Circle = CheckboxCircle;
Checkbox.Line = CheckboxLine;

export { Checkbox, CheckboxCircle, CheckboxLine };
export type { CheckboxBaseProps, LegacyCheckboxProps };
