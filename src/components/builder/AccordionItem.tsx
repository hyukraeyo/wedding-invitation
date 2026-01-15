import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import {
    AccordionItem as AccordionItemRoot,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { getScrollParent, smoothScrollTo } from '@/utils/smoothScroll';

interface AccordionItemProps {
    value: string; // Required for Radix Accordion
    title: string;
    icon?: React.ElementType | undefined;
    isOpen: boolean;
    children: React.ReactNode;
    isCompleted?: boolean | undefined;
    badge?: string | undefined;
    action?: React.ReactNode;
}

export const AccordionItem = ({
    value,
    title,
    icon: Icon,
    isOpen,
    children,
    isCompleted = false,
    badge,
    action
}: AccordionItemProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic: App-like smooth scrolling
    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        // Wait almost full duration (300ms) of accordion animation 
        // to calculate correct final position, then scroll smoothly.
        // 250ms feels slightly snappier as it catches the end of the animation.
        const timer = setTimeout(() => {
            const element = containerRef.current;
            if (!element) return;

            const scrollParent = getScrollParent(element);
            if (scrollParent) {
                // Calculate target position: element's offset relative to scroll parent
                // We add a small offset/padding (e.g. 20px) for visual breathing room
                smoothScrollTo(scrollParent, element.offsetTop - 24, 400); // 400ms for snappier premium feel
            }
        }, 250);

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
                "flex items-center justify-between px-3 py-3 md:p-4 cursor-pointer w-full text-left select-none rounded-xl transition-all hover:no-underline [&>svg]:hidden",
                isOpen && "rounded-b-none"
            )}>
                <div className="flex items-center gap-3">
                    {Icon && (
                        <Icon
                            size={18}
                            className={cn(
                                "text-muted-foreground transition-colors duration-300",
                                (isOpen || isCompleted) && "text-primary"
                            )}
                        />
                    )}
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-base text-foreground">
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
                    {action && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="mr-2 relative z-10"
                        >
                            {action}
                        </div>
                    )}
                    <div className={cn("transition-transform duration-300", isOpen && "rotate-180")}>
                        <ChevronDown size={18} className="text-muted-foreground" />
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <div className="pb-4 pt-0 px-2 md:px-4">
                    <div className="h-px w-full bg-border mb-4" />
                    {children}
                </div>
            </AccordionContent>
        </AccordionItemRoot>
    );
};
