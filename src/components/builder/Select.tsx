import React from 'react';
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerScrollArea,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { ChevronDown, Check } from 'lucide-react';
import styles from './Select.module.scss';

interface Option<T> {
    label: string;
    value: T;
}

interface SelectProps<T> {
    value: T;
    options: readonly Option<T>[];
    onChange: (value: T) => void;
    placeholder?: string | undefined;
    className?: string | undefined;
    labelClassName?: string | undefined;
    label?: string | undefined; // Add label support if needed or inferred
    modalTitle?: string; // Title for the mobile bottom sheet
}

export const Select = <T extends string | number>({
    value,
    options,
    onChange,
    placeholder,
    className = "",
    labelClassName = "",
    label,
    modalTitle
}: SelectProps<T>) => {
    const windowWidth = useWindowSize();
    const isMobile = windowWidth < 768;
    const [isOpen, setIsOpen] = React.useState(false);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const selectedItemRef = React.useRef<HTMLButtonElement>(null);
    const firstItemRef = React.useRef<HTMLButtonElement>(null);

    const stringValue = String(value);
    // Optimistic UI state
    const [optimisticValue, setOptimisticValue] = React.useState(stringValue);

    React.useEffect(() => {
        setOptimisticValue(stringValue);
    }, [stringValue]);

    const selectedOption = options.find(o => String(o.value) === optimisticValue);

    const handleValueChange = (val: string) => {
        const opt = options.find(o => String(o.value) === val);
        if (opt) {
            // Update UI immediately (Optimistic update)
            setOptimisticValue(String(opt.value));

            // Trigger actual change
            onChange(opt.value);

            // Close drawer with a slight delay to allow visual feedback, 
            // or close immediately depending on desired UX. 
            // Currently keeping immediate close but the state update above ensures
            // the button text updates before the drawer fully closes visually.
            setIsOpen(false);
        }
    };

    // Auto-scroll to selected item when drawer opens
    // Using 'instant' behavior so the item appears centered from the start
    React.useEffect(() => {
        if (!isOpen || !isMobile) {
            return;
        }

        // Small timeout to ensure DOM is ready, but instant scroll for better UX
        const timer = setTimeout(() => {
            if (selectedItemRef.current && scrollAreaRef.current) {
                const container = scrollAreaRef.current;
                const item = selectedItemRef.current;

                // Calculate scroll position to center the item
                const containerHeight = container.clientHeight;
                const itemOffsetTop = item.offsetTop;
                const itemHeight = item.clientHeight;
                const scrollPosition = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);

                container.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'instant' // Instant scroll - item appears centered from the start
                });
            }
        }, 50); // Minimal delay - just enough for DOM to be ready

        return () => clearTimeout(timer);
    }, [isOpen, isMobile]);

    if (!isMobile) {
        return (
            <div className={cn("flex flex-col gap-1.5", className)}>
                {label ? <Label className={labelClassName}>{label}</Label> : null}
                <ShadcnSelect value={stringValue} onValueChange={handleValueChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option, idx) => (
                            <SelectItem key={`${String(option.value)}-${idx}`} value={String(option.value)}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </ShadcnSelect>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label ? <Label className={labelClassName}>{label}</Label> : null}
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    <button
                        type="button"
                        className={styles.triggerButton}
                    >
                        <span className={cn(!selectedOption && styles.placeholder)}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronDown />
                    </button>
                </DrawerTrigger>
                <DrawerContent
                    className="max-h-[50vh]"
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        (selectedItemRef.current ?? firstItemRef.current)?.focus();
                    }}
                >
                    <DrawerHeader className="px-6 pb-2 border-b">
                        <DrawerTitle className="text-left text-base font-bold text-foreground/90">
                            {modalTitle || label || placeholder || "항목 선택"}
                        </DrawerTitle>
                        <DrawerDescription className="sr-only">
                            항목 목록
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerScrollArea ref={scrollAreaRef} className="px-0">
                        {options.map((option, idx) => {
                            const isSelected = stringValue === String(option.value);
                            return (
                                <button
                                    key={`${String(option.value)}-${idx}`}
                                    ref={isSelected ? selectedItemRef : idx === 0 ? firstItemRef : null}
                                    type="button"
                                    onClick={() => handleValueChange(String(option.value))}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-5 text-left transition-all active:bg-accent/80 touch-manipulation",
                                        isSelected && "bg-primary/5 text-primary"
                                    )}
                                >
                                    <span className={cn(
                                        "text-[17px] tracking-tight",
                                        isSelected ? "font-bold" : "font-medium text-foreground/80"
                                    )}>
                                        {option.label}
                                    </span>
                                    {isSelected ? (
                                        <Check className="h-5 w-5 text-primary" strokeWidth={3} />
                                    ) : null}
                                </button>
                            );
                        })}
                    </DrawerScrollArea>
                </DrawerContent>
            </Drawer>
        </div >
    );
};
