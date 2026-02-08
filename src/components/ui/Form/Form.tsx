'use client';

import * as React from 'react';
import * as FormPrimitive from '@radix-ui/react-form';
import { clsx } from 'clsx';
import s from './Form.module.scss';

const Form = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Root>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Root ref={ref} className={clsx(s.FormRoot, className)} {...props} />
));
Form.displayName = FormPrimitive.Root.displayName;

interface FormFieldProps extends React.ComponentPropsWithoutRef<typeof FormPrimitive.Field> {
  floatingLabel?: boolean | undefined;
}

const FormField = React.forwardRef<React.ElementRef<typeof FormPrimitive.Field>, FormFieldProps>(
  ({ className, floatingLabel = false, ...props }, ref) => (
    <FormPrimitive.Field
      ref={ref}
      className={clsx(s.FormField, floatingLabel && s.FloatingLabel, className)}
      {...props}
    />
  )
);
FormField.displayName = FormPrimitive.Field.displayName;

const FormLabel = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Label ref={ref} className={clsx(s.FormLabel, className)} {...props} />
));
FormLabel.displayName = FormPrimitive.Label.displayName;

const FormControl = FormPrimitive.Control;

/**
 * FormMessage - 폼 유효성 검사 메시지 컴포넌트
 *
 * @note forceMatch prop은 Radix UI Form에서 DOM으로 leak되는 버그가 있어,
 * 조건부 렌더링 방식으로 처리합니다.
 * - forceMatch=true: Radix Message를 사용하지 않고 직접 span으로 렌더링
 * - forceMatch=false 또는 undefined: Radix Message 사용 (match 기반 표시)
 */
interface FormMessageProps extends Omit<
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Message>,
  'forceMatch'
> {
  forceMatch?: boolean;
}

const FormMessage = React.forwardRef<HTMLSpanElement, FormMessageProps>(
  ({ className, forceMatch, match, name, children, ...props }, ref) => {
    // forceMatch가 boolean 타입으로 제공된 경우, 그 값에 따라 렌더링 여부 결정
    if (typeof forceMatch === 'boolean') {
      return forceMatch ? (
        <span ref={ref} className={clsx(s.FormMessage, className)} {...props}>
          {children}
        </span>
      ) : null;
    }

    // 그렇지 않으면 Radix Form.Message 사용 (match 기반 조건부 표시)
    // exactOptionalPropertyTypes 호환: match가 undefined일 때 prop 전달 방지
    return (
      <FormPrimitive.Message
        ref={ref}
        className={clsx(s.FormMessage, className)}
        {...(match !== undefined && { match })}
        {...(name !== undefined && { name })}
        {...props}
      >
        {children}
      </FormPrimitive.Message>
    );
  }
);
FormMessage.displayName = 'FormMessage';

const FormHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx(s.FormHeader, className)} {...props} />
  )
);
FormHeader.displayName = 'FormHeader';

const FormSubmit = FormPrimitive.Submit;

export { Form, FormField, FormLabel, FormControl, FormMessage, FormHeader, FormSubmit };
