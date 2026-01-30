'use client';

import * as React from 'react';
import * as FormPrimitive from '@radix-ui/react-form';
import { clsx } from 'clsx';
import s from './Form.module.scss';

const Form = React.forwardRef<
    React.ElementRef<typeof FormPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof FormPrimitive.Root>
>(({ className, ...props }, ref) => (
    <FormPrimitive.Root
        ref={ref}
        className={clsx(s.FormRoot, className)}
        {...props}
    />
));
Form.displayName = FormPrimitive.Root.displayName;

const FormField = React.forwardRef<
    React.ElementRef<typeof FormPrimitive.Field>,
    React.ComponentPropsWithoutRef<typeof FormPrimitive.Field>
>(({ className, ...props }, ref) => (
    <FormPrimitive.Field
        ref={ref}
        className={clsx(s.FormField, className)}
        {...props}
    />
));
FormField.displayName = FormPrimitive.Field.displayName;

const FormLabel = React.forwardRef<
    React.ElementRef<typeof FormPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(({ className, ...props }, ref) => (
    <FormPrimitive.Label
        ref={ref}
        className={clsx(s.FormLabel, className)}
        {...props}
    />
));
FormLabel.displayName = FormPrimitive.Label.displayName;

const FormControl = FormPrimitive.Control;

const FormMessage = React.forwardRef<
    React.ElementRef<typeof FormPrimitive.Message>,
    React.ComponentPropsWithoutRef<typeof FormPrimitive.Message>
>(({ className, ...props }, ref) => (
    <FormPrimitive.Message
        ref={ref}
        className={clsx(s.FormMessage, className)}
        {...props}
    />
));
FormMessage.displayName = FormPrimitive.Message.displayName;

const FormSubmit = FormPrimitive.Submit;

export {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
    FormSubmit,
};
