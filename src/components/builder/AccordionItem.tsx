import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import {
    AccordionItem as AccordionItemRoot,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

interface AccordionItemProps {
    value: string; // Required for Radix Accordion
    title: string;
    icon?: React.ElementType | undefined;
    isOpen: boolean;
    onToggle?: () => void; // Optional now as Accordion root can handle it
    children: React.ReactNode;
    isCompleted?: boolean | undefined;
    badge?: string | undefined;
}

export const AccordionItem = ({
    value,
    title,
    icon: Icon,
    isOpen,
    children,
    isCompleted = false,
    badge
}: AccordionItemProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic kept from original
    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        const timer = setTimeout(() => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect && rect.top < 100 && rect.top > 0) return;
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <AccordionItemRoot
            value={value}
            ref={containerRef}
            className={cn(
                "border border-border/60 rounded-xl bg-card transition-all duration-300 hover:border-border/80",
                isOpen && "border-primary/40 shadow-sm"
            )}
        >
            <AccordionTrigger className={cn(
                "flex items-center justify-between p-4 cursor-pointer w-full text-left select-none rounded-xl transition-all hover:no-underline [&>svg]:hidden",
                isOpen && "rounded-b-none"
            )}>
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50 text-muted-foreground transition-colors",
                            isOpen && "bg-primary text-primary-foreground"
                        )}>
                            <Icon size={18} />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className={cn("font-semibold text-base", isOpen ? "text-foreground" : "text-muted-foreground")}>
                            {title}
                        </span>
                        {badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isCompleted && (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-sm">
                            <Check size={10} strokeWidth={4} />
                        </div>
                    )}
                    <div className={cn("transition-transform duration-300", isOpen && "rotate-180")}>
                        <ChevronDown size={18} className="text-muted-foreground" />
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <div className="p-4 pt-0">
                    <div className="h-px w-full bg-border mb-4" />
                    {children}
                </div>
            </AccordionContent>
        </AccordionItemRoot>
    );
};
