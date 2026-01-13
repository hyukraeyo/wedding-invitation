import React from 'react';
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerScrollArea,
    DrawerTrigger,
} from '@/components/ui/Drawer';
import { ChevronDown, Check } from 'lucide-react';

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

    const stringValue = String(value);
    const selectedOption = options.find(o => String(o.value) === stringValue);

    const handleValueChange = (val: string) => {
        const opt = options.find(o => String(o.value) === val);
        if (opt) {
            onChange(opt.value);
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
                {label && <Label className={labelClassName}>{label}</Label>}
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
            {label && <Label className={labelClassName}>{label}</Label>}
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    <button
                        type="button"
                        className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
                        style={{
                            fontSize: 'var(--builder-font-size)',
                            fontFamily: 'var(--builder-font-family)',
                            lineHeight: 'var(--builder-line-height)',
                        }}
                    >
                        <span className={cn(!selectedOption && "text-muted-foreground")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" />
                    </button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[50vh]">
                    <DrawerHeader className="px-6 pb-2 border-b">
                        <DrawerTitle className="text-left text-base font-bold text-foreground/90">
                            {modalTitle || label || placeholder || "항목 선택"}
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerScrollArea ref={scrollAreaRef}>
                        {options.map((option, idx) => {
                            const isSelected = stringValue === String(option.value);
                            return (
                                <button
                                    key={`${String(option.value)}-${idx}`}
                                    ref={isSelected ? selectedItemRef : null}
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
                                    {isSelected && (
                                        <Check className="h-5 w-5 text-primary" strokeWidth={3} />
                                    )}
                                </button>
                            );
                        })}
                    </DrawerScrollArea>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
