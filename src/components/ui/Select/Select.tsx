"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./Select.module.scss"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ResponsiveModal } from "@/components/common/ResponsiveModal"
import { Menu } from "../Menu"
import { useScrollFade as useScrollFadeHook } from "@/hooks/use-scroll-fade"

// field import removed

const SelectRoot = SelectPrimitive.Root

interface SelectOption<T> {
    label: string;
    value: T;
    disabled?: boolean;
}

interface SelectProps<T> {
    value?: T | undefined;
    defaultValue?: T | undefined;
    onValueChange?: ((value: T) => void) | undefined;
    options?: readonly SelectOption<T>[] | undefined;
    placeholder?: string | undefined;
    className?: string | undefined;
    triggerClassName?: string | undefined;
    contentClassName?: string | undefined;
    modalTitle?: string | undefined;
    disabled?: boolean | undefined;
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode; // For traditional Shadcn usage
    /** Force mobile drawer view */
    mobileOnly?: boolean | undefined;
    /** Disable responsive behavior and always use desktop popover */
    desktopOnly?: boolean | undefined;
    id?: string | undefined;

}

const Select = <T extends string | number>({
    value,
    defaultValue,
    onValueChange,
    options,
    placeholder = "선택해주세요",
    className,
    triggerClassName,
    contentClassName,
    modalTitle,
    disabled,
    size = 'md',
    children,
    mobileOnly = false,
    desktopOnly = false,
    id: customId,

    ...props
}: SelectProps<T>) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const showDrawer = mobileOnly || (!desktopOnly && !isDesktop);
    const [isOpen, setIsOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<T | undefined>(defaultValue);

    // useFormField usage removed

    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (val: T) => {
        setInternalValue(val);
        onValueChange?.(val);
    };

    const sizeClass = styles[size];

    // If options are provided, use the high-level responsive implementation
    if (options) {
        const selectedOption = options.find(opt => opt.value === currentValue);

        if (showDrawer) {
            return (
                <div className={cn(className)}>
                    <ResponsiveModal
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        title={modalTitle || placeholder}
                        useScrollFade={true}
                        padding="none"
                        trigger={
                            <button
                                id={customId}
                                type="button"
                                disabled={disabled}
                                className={cn(styles.trigger, sizeClass, triggerClassName)}
                                onClick={() => setIsOpen(true)}
                            >
                                <span className={cn(!selectedOption && styles.placeholder)}>
                                    {selectedOption ? selectedOption.label : placeholder}
                                </span>
                                <ChevronDown className={styles.icon} />
                            </button>
                        }
                    >
                        <Menu
                            className={styles.menuContainer}
                            role="listbox"
                            ref={(node) => {
                                if (node && isOpen) {
                                    // 드로어 애니메이션 고려하여 약간의 지연 후 스크롤 및 포커스
                                    requestAnimationFrame(() => {
                                        const selectedItem = node.querySelector('[aria-selected="true"]') as HTMLElement;
                                        if (selectedItem) {
                                            selectedItem.scrollIntoView({ block: 'nearest', behavior: 'instant' });
                                            // 접근성을 위해 선택된 요소에 포커스 (스크롤 위치는 유지)
                                            selectedItem.focus({ preventScroll: true });
                                        }
                                    });
                                }
                            }}
                        >
                            {options.map((option) => (
                                <Menu.CheckItem
                                    key={String(option.value)}
                                    checked={option.value === currentValue}
                                    disabled={option.disabled}
                                    onClick={() => {
                                        handleValueChange(option.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.label}
                                </Menu.CheckItem>
                            ))}
                        </Menu>
                    </ResponsiveModal>
                </div>
            );
        }

        return (
            <SelectRoot
                {...(value !== undefined ? { value: String(value) } : {})}
                {...(defaultValue !== undefined ? { defaultValue: String(defaultValue) } : {})}
                onValueChange={(val) => handleValueChange(val as T)}
                {...(disabled !== undefined ? { disabled } : {})}
                {...props}
            >
                <SelectTrigger
                    id={customId}
                    className={cn(triggerClassName)}
                    size={size}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className={cn(contentClassName)}>
                    {options.map((option) => (
                        <SelectItem
                            key={String(option.value)}
                            value={String(option.value)}
                            {...(option.disabled !== undefined ? { disabled: option.disabled } : {})}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        );
    }

    // Fallback to traditional Shadcn usage if no options provided
    return (
        <SelectRoot
            {...(value !== undefined ? { value: String(value) } : {})}
            {...(defaultValue !== undefined ? { defaultValue: String(defaultValue) } : {})}
            onValueChange={(val) => handleValueChange(val as T)}
            {...(disabled !== undefined ? { disabled } : {})}
            {...props}
        >
            {children}
        </SelectRoot>
    );
};

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, children, size = 'md', ...props }, ref) => {
    const sizeClass = styles[size];
    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(styles.trigger, sizeClass, className)}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className={styles.icon} />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn(styles.scrollButton, className)}
        {...props}
    >
        <ChevronUp size={16} />
    </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn(styles.scrollButton, className)}
        {...props}
    >
        <ChevronDown size={16} />
    </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
    SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
    const { setViewportRef, showTopFade, showBottomFade } = useScrollFadeHook<HTMLDivElement>();

    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    styles.content,
                    position === "popper" && styles["content--popper"],
                    className
                )}
                position={position}
                sideOffset={4}
                data-top-fade={showTopFade}
                data-bottom-fade={showBottomFade}
                {...props}
            >
                <SelectPrimitive.Viewport
                    ref={setViewportRef}
                    className={cn(
                        styles.viewport,
                        position === "popper" && styles["viewport--popper"]
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn(styles.label, className)}
        {...props}
    />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(styles.item, className)}
        {...props}
    >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <span className={styles.itemIndicator}>
            <SelectPrimitive.ItemIndicator>
                <Check size={16} />
            </SelectPrimitive.ItemIndicator>
        </span>
    </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn(styles.separator, className)}
        {...props}
    />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
}
