"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./styles.module.scss"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(styles.trigger, className)}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className={styles.icon} />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))
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
    const [showTopFade, setShowTopFade] = React.useState(false);
    const [showBottomFade, setShowBottomFade] = React.useState(false);
    const viewportRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = React.useCallback(() => {
        if (!viewportRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
        setShowTopFade(scrollTop > 2);
        setShowBottomFade(scrollTop + clientHeight < scrollHeight - 2);
    }, []);

    React.useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        // Check initial state (with a small delay to ensure rendering is complete)
        const timer = setTimeout(handleScroll, 0);

        viewport.addEventListener("scroll", handleScroll);

        // ResizeObserver to handle content changes
        const resizeObserver = new ResizeObserver(handleScroll);
        resizeObserver.observe(viewport);

        return () => {
            clearTimeout(timer);
            viewport.removeEventListener("scroll", handleScroll);
            resizeObserver.disconnect();
        };
    }, [handleScroll]);

    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    styles.content,
                    showTopFade && styles.showTopFade,
                    showBottomFade && styles.showBottomFade,
                    position === "popper" && styles["content--popper"],
                    className
                )}
                position={position}
                sideOffset={4}
                {...props}
            >
                <SelectPrimitive.Viewport
                    ref={viewportRef}
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
