"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"
import styles from "./RadioGroup.module.scss"

// ------------------------------------------------------------------
// Context & Types
// ------------------------------------------------------------------

type RadioGroupVariant = 'default' | 'segmented';
type RadioGroupSize = 'small' | 'medium' | 'large';

interface RadioGroupContextValue {
    variant: RadioGroupVariant;
    size: RadioGroupSize;
    value?: string | undefined;
    registerItem?: ((value: string, element: HTMLButtonElement) => void) | undefined;
    unregisterItem?: ((value: string) => void) | undefined;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
    variant: 'default',
    size: 'medium'
});

export interface RadioOption {
    label: string;
    value: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
    variant?: RadioGroupVariant;
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
>(({ className, variant = "default", size = "medium", options, fullWidth, children, value, defaultValue, onValueChange, ...props }, ref) => {

    // --- Segmented Control Logic ---
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 });
    const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Internal state to track value for indicator if controlled/uncontrolled
    // We only need this for the indicator update logic.
    // If controlled, 'value' is passed. If uncontrolled, we might not know the value unless we track it or trust defaultValue.
    // Ideally, for the indicator to work perfectly, it should be controlled or we sync with internal state.
    // Given the complexity, let's assume 'value' is available or we use an internal one.
    // But Radix handles the state. We can use onValueChange to update our local knowledge for indicator.

    // Simple hack: We need to know the CURRENT value to position the indicator.
    // If 'value' prop is undefined (uncontrolled), we should probably rely on internal Radix state, 
    // but Radix doesn't expose it easily outside.
    // So we wrap the onValueChange to update a local trigger.

    // To support both, let's assume we use 'value' (controlled) or 'defaultValue'.
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
        if (variant !== 'segmented' || !internalValue) return;

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
    }, [internalValue, variant]);

    // Update indicator on resize, value change, or option change
    React.useEffect(() => {
        // Use requestAnimationFrame for smoother updates and to avoid layout thrashing during render cycles
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

    const rootClassName = cn(
        variant === 'default' ? styles.group : styles.segmentedRoot,
        variant === 'segmented' && [
            styles[size],
            fullWidth && styles.fullWidth
        ],
        className
    );

    // Combine refs
    const composedRef = React.useCallback((node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [ref]);

    const contextValue = React.useMemo<RadioGroupContextValue>(() => ({
        variant,
        size,
        value: internalValue,
        registerItem: variant === 'segmented' ? registerItem : undefined,
        unregisterItem: variant === 'segmented' ? unregisterItem : undefined,
    }), [variant, size, internalValue, registerItem, unregisterItem]);

    return (
        <RadioGroupContext.Provider value={contextValue}>
            <RadioGroupPrimitive.Root
                className={rootClassName}
                ref={composedRef}
                value={value as string}
                defaultValue={defaultValue as string}
                onValueChange={handleValueChange}
                {...props}
            >
                {variant === 'segmented' && (
                    <div className={styles.segmentedIndicator} style={indicatorStyle} />
                )}

                {options ? (
                    options.map((option) => (
                        <React.Fragment key={option.value}>
                            {variant === 'segmented' ? (
                                <RadioGroupItem
                                    value={option.value}
                                    disabled={option.disabled}
                                >
                                    <span className={styles.itemContent}>
                                        {option.icon}
                                        <span>{option.label}</span>
                                    </span>
                                </RadioGroupItem>
                            ) : (
                                <div className={styles.optionWrapper}>
                                    <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        disabled={option.disabled}
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className={styles.label}
                                        data-disabled={option.disabled}
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            )}
                        </React.Fragment>
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
    const { variant, size, registerItem, unregisterItem } = React.useContext(RadioGroupContext);
    const itemRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs for Segmented Logic
    const composedRef = React.useCallback((node: HTMLButtonElement | null) => {
        itemRef.current = node;

        // Handle Segmented Registration
        if (variant === 'segmented' && node && registerItem) {
            registerItem(props.value, node);
        }

        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }, [ref, variant, registerItem, props.value]);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (variant === 'segmented' && unregisterItem) {
                unregisterItem(props.value);
            }
        };
    }, [variant, unregisterItem, props.value]);

    // 1. Segmented Variant
    if (variant === 'segmented') {
        return (
            <RadioGroupPrimitive.Item
                ref={composedRef}
                className={cn(
                    styles.segmentedItem,
                    styles[size],
                    className
                )}
                {...props}
            >
                {children}
            </RadioGroupPrimitive.Item>
        )
    }

    // 2. Default Variant
    // If children provides specific content, render it.
    // BUT the original implementation has the circle INSIDE the Item.
    // So 'children' of RadioGroupItem is typically empty or just label if we change design.
    // The original design: Item is the circle. Label is outside usually.
    // Let's stick to original implementation for Default.
    // But wait, if we use `options` prop in Default mode, we need to render Label + Radio.
    // The `RadioGroup` loop above renders `RadioGroupItem` + Label text inside?
    // In the original file: 
    // <RadioGroupItem ...>
    //   <Indicator><div class="circle" /></Indicator>
    // </RadioGroupItem>
    // So RadioGroupItem IS the button (circle).

    // If we use options prop, we should probably output:
    // <div class="flex items-center space-x-2">
    //    <RadioGroupItem value="option-one" id="option-one" />
    //    <Label htmlFor="option-one">Option One</Label>
    // </div>
    //
    // However, the `RadioGroupItem` component below expects `children` to be passed through potentially?
    // Usually RadioGroupItem is self-closing in primitive usage.

    return (
        <RadioGroupPrimitive.Item
            ref={composedRef} // Use composed ref just in case, though not needed for default
            className={cn(styles.item, className)}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className={styles.indicator}>
                <div className={styles.circle} />
            </RadioGroupPrimitive.Indicator>
            {/* If children exist, we render them? Original didn't have children rendering inside Item except Indicator */}
            {/* But Radix Item can have children. */}
            {children && <span className="sr-only">{children}</span>}
        </RadioGroupPrimitive.Item>
    )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
