"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import styles from "./Tabs.module.scss"

const Tabs = TabsPrimitive.Root

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
    /** Whether to use equal width for all items (Segmented Control style) */
    fluid?: boolean;
}

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    TabsListProps
>(({ className, fluid = false, children, ...props }, ref) => {
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 });
    const listRef = React.useRef<HTMLDivElement>(null);

    // Count children for grid layout if fluid
    const childArray = React.Children.toArray(children);
    const itemCount = childArray.length;

    const updateIndicator = React.useCallback(() => {
        const list = listRef.current;
        if (!list) return;

        const activeTab = list.querySelector('[data-state="active"]') as HTMLElement;
        if (activeTab) {
            const listRect = list.getBoundingClientRect();
            const tabRect = activeTab.getBoundingClientRect();

            setIndicatorStyle({
                width: tabRect.width,
                transform: `translateX(${tabRect.left - listRect.left - 4}px)`, // 4px is list padding
                opacity: 1,
            });
        }
    }, []);

    React.useEffect(() => {
        if (!listRef.current) return;

        // Initial update
        updateIndicator();

        // Observe for attribute changes (tab switching)
        const observer = new MutationObserver(updateIndicator);
        observer.observe(listRef.current, {
            attributes: true,
            subtree: true,
            attributeFilter: ['data-state']
        });

        // Observe for size changes
        const resizeObserver = new ResizeObserver(updateIndicator);
        resizeObserver.observe(listRef.current);

        return () => {
            observer.disconnect();
            resizeObserver.disconnect();
        };
    }, [updateIndicator, children]);

    // Merge refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
        listRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    }, [ref]);

    return (
        <TabsPrimitive.List
            ref={mergedRef}
            className={cn(
                styles.list,
                fluid && styles.listFluid,
                className
            )}
            style={fluid ? { '--item-count': itemCount } as React.CSSProperties : undefined}
            {...props}
        >
            <span
                className={styles.indicator}
                style={indicatorStyle}
            />
            {children}
        </TabsPrimitive.List>
    )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(styles.trigger, className)}
        {...props}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(styles.content, className)}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
