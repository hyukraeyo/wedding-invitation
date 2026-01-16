import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
    AccordionItem as AccordionItemRoot,
    AccordionContent,
} from "@/components/ui/accordion";
import { getScrollParent, smoothScrollTo } from '@/utils/smoothScroll';
import styles from './AccordionItem.module.scss';

interface AccordionItemProps {
    value: string; // Required for Radix Accordion
    title: string;
    icon?: React.ElementType | undefined;
    isOpen: boolean;
    children: React.ReactNode;
    isCompleted?: boolean | undefined;
    badge?: string | undefined;
    action?: React.ReactNode;
}

export const AccordionItem = ({
    value,
    title,
    icon: Icon, // Icon is not used in the new design but kept for interface compatibility
    isOpen,
    children,
    isCompleted = false,
    badge,
    action
}: AccordionItemProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic: App-like smooth scrolling
    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        // Wait almost full duration (300ms) of accordion animation 
        // to calculate correct final position, then scroll smoothly.
        const timer = setTimeout(() => {
            const element = containerRef.current;
            if (!element) return;

            const scrollParent = getScrollParent(element);
            if (scrollParent) {
                smoothScrollTo(scrollParent, element.offsetTop - 24, 400);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <AccordionItemRoot
            value={value}
            ref={containerRef}
            className={cn(styles.item, isOpen && styles.open)}
        >
            <AccordionPrimitive.Header className="flex">
                <div className={cn(styles.trigger, isOpen && styles.open)}>
                    {/* 1. Full-size clickable overlay trigger (Main toggle) */}
                    <AccordionPrimitive.Trigger
                        className="absolute inset-0 w-full h-full opacity-0 z-0 cursor-pointer"
                        tabIndex={0}
                    />

                    {/* 2. Visual Content (Pass-through pointer events) */}
                    <div className={cn(styles.headerContent, "pointer-events-none")}>
                        <div className={styles.titleWrapper}>
                            <span className={styles.title}>
                                {title}
                            </span>
                            {badge ? (
                                <span className={styles.badge}>
                                    {badge}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* 3. Actions (Interactive/On-top) */}
                    <div className={styles.rightActions}>
                        {action ? (
                            <div
                                className={cn(styles.actionWrapper, "pointer-events-auto relative z-10")}
                            >
                                {action}
                            </div>
                        ) : null}
                        <div className={cn(styles.chevron, isOpen && styles.open, "pointer-events-none")}>
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>
            </AccordionPrimitive.Header>

            <AccordionContent>
                <div className={styles.contentWrapper}>
                    <div className={styles.divider} />
                    {children}
                </div>
            </AccordionContent>
        </AccordionItemRoot>
    );
};
