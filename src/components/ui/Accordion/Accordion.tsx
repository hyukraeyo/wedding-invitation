'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import s from './Accordion.module.scss';

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root ref={ref} className={clsx(s.Root, className)} {...props} />
));
Accordion.displayName = AccordionPrimitive.Root.displayName;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={clsx(s.Item, className)} {...props} />
));
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className={s.Header}>
    <AccordionPrimitive.Trigger ref={ref} className={clsx(s.Trigger, className)} {...props}>
      <div className={s.TriggerContent}>{children}</div>
      <ChevronDown className={s.Chevron} aria-hidden />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className={clsx(s.Content, className)} {...props}>
    <div className={s.ContentText}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

/**
 * SectionAccordion - A wrapper for builder sections that replaces BoardRow
 */
export interface SectionAccordionProps {
  title: React.ReactNode;
  value: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  children?: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
  isInvalid?: boolean;
}

const SectionAccordion = ({
  title,
  value,
  isOpen,
  onToggle,
  children,
  className,
  rightElement,
  isInvalid,
}: SectionAccordionProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? value : ''}
      onValueChange={(v) => onToggle?.(v === value)}
      className={className}
    >
      <AccordionItem value={value} className={clsx(s.SectionItem, isInvalid && s.Invalid)}>
        <div className={s.SectionHeaderContainer}>
          <AccordionPrimitive.Header className={clsx(s.Header, s.SectionTriggerHeader)}>
            <AccordionPrimitive.Trigger className={clsx(s.Trigger, s.SectionTrigger)}>
              <div className={s.TriggerContent}>{title}</div>
              <ChevronDown className={s.Chevron} aria-hidden />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          {rightElement && <div className={s.SectionRightElement}>{rightElement}</div>}
        </div>
        <AccordionContent className={s.SectionContent} forceMount>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, SectionAccordion };
