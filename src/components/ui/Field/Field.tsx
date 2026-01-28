'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/Label';
import styles from './Field.module.scss';

// --- Context ---

interface FieldContextValue {
    id: string;
    errorId: string;
    descriptionId: string;
    isError: boolean;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

export const useField = () => {
    const context = React.useContext(FieldContext);
    return context;
};

// --- Components ---

/**
 * FieldSet: 관련 필드들을 논리적으로 그룹화하는 컨테이너
 */
export const FieldSet = React.forwardRef<
    HTMLFieldSetElement,
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
    <fieldset
        ref={ref}
        className={cn(styles.fieldSet, className)}
        {...props}
    />
));
FieldSet.displayName = 'FieldSet';

/**
 * FieldLegend: FieldSet의 제목
 */
export const FieldLegend = React.forwardRef<
    HTMLLegendElement,
    React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
    <legend
        ref={ref}
        className={cn(styles.fieldLegend, className)}
        {...props}
    />
));
FieldLegend.displayName = 'FieldLegend';

/**
 * FieldGroup: 필드들을 시각적으로 그룹화하는 컨테이너
 */
export const FieldGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(styles.fieldGroup, className)}
        {...props}
    />
));
FieldGroup.displayName = 'FieldGroup';

/**
 * Field: 개별 필드(Label + Control + Description/Error)의 루트 컨테이너
 */
interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal';
    isError?: boolean;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
    ({ className, orientation = 'vertical', id: customId, isError = false, ...props }, ref) => {
        const generatedId = React.useId();
        const id = customId || generatedId;
        const errorId = `${id}-error`;
        const descriptionId = `${id}-description`;

        return (
            <FieldContext.Provider value={{ id, errorId, descriptionId, isError }}>
                <div
                    ref={ref}
                    className={cn(
                        styles.field,
                        styles[`orientation-${orientation}`],
                        className
                    )}
                    {...props}
                />
            </FieldContext.Provider>
        );
    }
);
Field.displayName = 'Field';

/**
 * FieldLabel: 필드의 레이블
 */
interface FieldLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
    required?: boolean;
}

export const FieldLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    FieldLabelProps
>(({ className, required, children, ...props }, ref) => {
    const context = useField();

    return (
        <Label
            ref={ref}
            htmlFor={context?.id}
            className={cn(styles.fieldLabel, className)}
            {...props}
        >
            {children}
            {required && <span className={styles.requiredStar}> *</span>}
        </Label>
    );
});
FieldLabel.displayName = 'FieldLabel';

/**
 * FieldContent: 레이블과 본문을 그룹화하거나 레이아웃을 조정할 때 사용
 */
export const FieldContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(styles.fieldContent, className)}
        {...props}
    />
));
FieldContent.displayName = 'FieldContent';

/**
 * FieldHeader: 레이블과 액션(버튼 등)을 가로로 배치하는 컨테이너
 */
export const FieldHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(styles.fieldHeader, className)}
        {...props}
    />
));
FieldHeader.displayName = 'FieldHeader';

/**
 * FieldTitle: 필드 내부의 소제목
 */
export const FieldTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn(styles.fieldTitle, className)}
        {...props}
    />
));
FieldTitle.displayName = 'FieldTitle';

/**
 * FieldDescription: 필드에 대한 추가 설명
 */
export const FieldDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const context = useField();
    return (
        <p
            ref={ref}
            id={context?.descriptionId}
            className={cn(styles.fieldDescription, className)}
            {...props}
        />
    );
});
FieldDescription.displayName = 'FieldDescription';

/**
 * FieldError: 필드 유효성 검사 에러 메시지
 */
export const FieldError = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const context = useField();
    return (
        <p
            ref={ref}
            id={context?.errorId}
            className={cn(styles.fieldError, className)}
            role="alert"
            {...props}
        />
    );
});
FieldError.displayName = 'FieldError';

/**
 * FieldSeparator: 필드 사이의 구분선
 */
export const FieldSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(styles.fieldSeparator, className)}
        {...props}
    />
));
FieldSeparator.displayName = 'FieldSeparator';
