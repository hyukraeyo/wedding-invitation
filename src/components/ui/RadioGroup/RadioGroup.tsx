"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"
import styles from "./RadioGroup.module.scss"

// ------------------------------------------------------------------
// Context & Types
// ------------------------------------------------------------------

type RadioGroupVariant = 'default' | 'segmented';
type RadioGroupSize = 'sm' | 'md' | 'lg';

interface RadioGroupContextValue {
    variant: RadioGroupVariant;
    size: RadioGroupSize;
    value?: string | undefined;
    registerItem?: ((value: string, element: HTMLButtonElement) => void) | undefined;
    unregisterItem?: ((value: string) => void) | undefined;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
    variant: 'default',
    size: 'md'
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

import { useFormField } from "@/components/common/FormField"

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    RadioGroupProps
>(({ className, variant = "default", size = "md", options, fullWidth, children, value, defaultValue, onValueChange, id: customId, ...props }, ref) => {
    const field = useFormField();
    const id = customId || field?.id;
    const describedBy = field?.isError ? field.errorId : field?.descriptionId;

    // --- Segmented Control Logic ---

    // --- Segmented Control Logic ---
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 });
    const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Simple hack: We need to know the CURRENT value to position the indicator.
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
        variant === 'default' ? styles.group : styles.segmentedRoot,
        variant === 'segmented' && [
            sizeClass,
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
                id={id}
                aria-describedby={describedBy}
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

    const sizeClass = styles[size];

    // 1. Segmented Variant
    if (variant === 'segmented') {
        return (
            <RadioGroupPrimitive.Item
                ref={composedRef}
                className={cn(
                    styles.segmentedItem,
                    sizeClass,
                    className
                )}
                {...props}
            >
                {children}
            </RadioGroupPrimitive.Item>
        )
    }

    // 2. Default Variant
    return (
        <RadioGroupPrimitive.Item
            ref={composedRef}
            className={cn(styles.item, className)}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className={styles.indicator}>
                <div className={styles.circle} />
            </RadioGroupPrimitive.Indicator>
            {children && <span className="sr-only">{children}</span>}
        </RadioGroupPrimitive.Item>
    )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
