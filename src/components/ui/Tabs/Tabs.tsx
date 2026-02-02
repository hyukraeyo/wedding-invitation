'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import s from './Tabs.module.scss';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={clsx(s.list, className)}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={clsx(s.trigger, className)}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const [isActive, setIsActive] = React.useState(true);

    const setRefs = React.useCallback((node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    }, [ref]);

    React.useEffect(() => {
        const node = localRef.current;
        if (!node) return;

        const updateState = () => {
            const state = node.getAttribute('data-state');
            setIsActive(state !== 'inactive');
        };

        updateState();
        const observer = new MutationObserver(updateState);
        observer.observe(node, { attributes: true, attributeFilter: ['data-state'] });
        return () => observer.disconnect();
    }, []);

    return (
        <TabsPrimitive.Content
            ref={setRefs}
            className={clsx(s.content, className)}
            {...props}
        >
            <React.Activity mode={isActive ? 'visible' : 'hidden'}>
                {children}
            </React.Activity>
        </TabsPrimitive.Content>
    );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
