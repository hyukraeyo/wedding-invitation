"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"
import styles from "./RadioGroup.module.scss"
// useField removed

// ------------------------------------------------------------------
// Context & Types
// ------------------------------------------------------------------

type RadioGroupSize = 'sm' | 'md' | 'lg';

interface RadioGroupContextValue {
    size: RadioGroupSize;
    value?: string | undefined;
    registerItem?: ((value: string, element: HTMLButtonElement) => void) | undefined;
    unregisterItem?: ((value: string) => void) | undefined;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
    size: 'md'
});

export interface RadioOption {
    label: string;
    value: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
    size?: RadioGroupSize;
    options?: RadioOption[];
    fullWidth?: boolean;
}

// ------------------------------------------------------------------
// Root Component
// ------------------------------------------------------------------



const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    RadioGroupProps
>(({
    className, size = "md", options, fullWidth, children, value, defaultValue, onValueChange, id: customId, ...props
}, ref) => {

    // --- Segmented Control Logic ---
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 });
    const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Track current value for indicator positioning
    const [internalValue, setInternalValue] = React.useState<string | undefined>(value ?? (defaultValue as string | undefined) ?? undefined);

    // Sync internal value with prop
    React.useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value as string);
        }
    }, [value]);

    const handleValueChange = (val: string) => {
        setInternalValue(val);
        onValueChange?.(val);
    };

    const registerItem = React.useCallback((val: string, element: HTMLButtonElement) => {
        itemRefs.current.set(val, element);
    }, []);

    const unregisterItem = React.useCallback((val: string) => {
        itemRefs.current.delete(val);
    }, []);

    const updateIndicator = React.useCallback(() => {
        if (!internalValue) {
            setIndicatorStyle({ opacity: 0 });
            return;
        }

        const container = containerRef.current;
        const activeItem = itemRefs.current.get(internalValue);

        if (container && activeItem) {
            const containerRect = container.getBoundingClientRect();
            const activeRect = activeItem.getBoundingClientRect();

            setIndicatorStyle({
                width: activeRect.width,
                height: activeRect.height,
                transform: `translateX(${activeRect.left - containerRect.left}px)`,
                opacity: 1,
            });
        } else {
            setIndicatorStyle({ opacity: 0 });
        }
    }, [internalValue]);

    // Update indicator on resize, value change, or option change
    React.useEffect(() => {
        requestAnimationFrame(() => updateIndicator());

        const handleResize = () => requestAnimationFrame(() => updateIndicator());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateIndicator]);

    // Watch for children/options changes
    React.useEffect(() => {
        const timer = setTimeout(updateIndicator, 50);
        return () => clearTimeout(timer);
    }, [children, options, updateIndicator]);

    // --- Render Helpers ---

    const sizeClass = styles[size];
    const rootClassName = cn(
        styles.root,
        sizeClass,
        fullWidth && styles.fullWidth,
        className
    );

    // Combine refs
    const composedRef = React.useCallback((node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [ref]);

    const contextValue = React.useMemo<RadioGroupContextValue>(() => ({
        size,
        value: internalValue,
        registerItem,
        unregisterItem,
    }), [size, internalValue, registerItem, unregisterItem]);

    return (
        <RadioGroupContext.Provider value={contextValue}>
            <RadioGroupPrimitive.Root
                id={customId}
                className={rootClassName}
                ref={composedRef}
                value={value as string}
                defaultValue={defaultValue as string}
                onValueChange={handleValueChange}
                {...props}
            >
                <div className={styles.indicator} style={indicatorStyle} />

                {options ? (
                    options.map((option) => (
                        <RadioGroupItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            <span className={styles.itemContent}>
                                {option.icon}
                                <span>{option.label}</span>
                            </span>
                        </RadioGroupItem>
                    ))
                ) : (
                    children
                )}
            </RadioGroupPrimitive.Root>
        </RadioGroupContext.Provider>
    )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

// ------------------------------------------------------------------
// Item Component
// ------------------------------------------------------------------

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    const { size, registerItem, unregisterItem } = React.useContext(RadioGroupContext);
    const itemRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs for Segmented Logic
    const composedRef = React.useCallback((node: HTMLButtonElement | null) => {
        itemRef.current = node;

        // Handle Segmented Registration
        if (node && registerItem) {
            registerItem(props.value, node);
        }

        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }, [ref, registerItem, props.value]);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (unregisterItem) {
                unregisterItem(props.value);
            }
        };
    }, [unregisterItem, props.value]);

    const sizeClass = styles[size];

    return (
        <RadioGroupPrimitive.Item
            ref={composedRef}
            className={cn(
                styles.item,
                sizeClass,
                className
            )}
            {...props}
        >
            {children}
        </RadioGroupPrimitive.Item>
    )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
