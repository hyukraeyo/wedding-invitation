"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getScrollParent, smoothScrollTo } from '@/utils/smoothScroll';
import styles from "./Accordion.module.scss"

/**
 * Accordion Component
 * Based on Radix UI Accordion for accessibility and motion.
 * 
 * @param type - "single" (only one item open) or "multiple" (many items open)
 * @param collapsible - (If type="single") If true, allows closing the already open item
 * @param defaultValue - The value of the item(s) to be open by default
 */
const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & { autoScroll?: boolean }
>(({ className, autoScroll, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);

    // Support both passed ref and internal ref
    React.useImperativeHandle(ref, () => internalRef.current!);

    React.useEffect(() => {
        if (!autoScroll || !internalRef.current) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                    const state = (mutation.target as HTMLElement).getAttribute('data-state');
                    if (state === 'open') {
                        const element = mutation.target as HTMLElement;
                        const scrollParent = getScrollParent(element);
                        if (scrollParent) {
                            setTimeout(() => {
                                smoothScrollTo(scrollParent, element.offsetTop - 24, 400);
                            }, 300); // Wait for open animation to start/proceed
                        }
                    }
                }
            });
        });

        observer.observe(internalRef.current, { attributes: true });
        return () => observer.disconnect();
    }, [autoScroll]);

    return (
        <AccordionPrimitive.Item
            ref={internalRef}
            className={cn(styles.item, className)}
            {...props}
        />
    )
})
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
    icon?: React.ElementType;
    badge?: React.ReactNode;
    action?: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    AccordionTriggerProps
>(({ className, children, icon: Icon, badge, action, ...props }, ref) => (
    <AccordionPrimitive.Header className={styles.header}>
        <div className={cn(styles.triggerWrapper, className)}>
            {/* The actual Radix trigger as an overlay for the whole area */}
            <AccordionPrimitive.Trigger
                ref={ref}
                className={styles.overlayTrigger}
                {...props}
            />

            {/* Visual content of the header */}
            <div className={styles.triggerContent}>
                <div className={styles.leftContent}>
                    {Icon && <Icon className={styles.headerIcon} />}
                    <span className={styles.title}>{children}</span>
                    {badge && <div className={styles.badge}>{badge}</div>}
                </div>

                <div className={styles.rightContent}>
                    {action && <div className={styles.actionWrapper}>{action}</div>}
                    <ChevronDown className={styles.chevron} />
                </div>
            </div>
        </div>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(styles.content, className)}
        {...props}
    >
        <div className={styles.contentInner}>{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
