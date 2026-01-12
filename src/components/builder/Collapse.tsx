import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CollapseProps {
    label: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
    rightElement?: React.ReactNode;
}

export const Collapse = ({ label, children, isOpen, onToggle, className, rightElement }: CollapseProps) => {
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={onToggle}
            className={cn("w-full border rounded-lg bg-card text-card-foreground shadow-sm", className)}
        >
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 flex-1">
                    <span className="font-semibold text-sm">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    {rightElement}
                    <CollapsibleTrigger asChild>
                        <Button variant="toss-text" size="icon-sm">
                            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </div>
            <CollapsibleContent className="px-4 pb-4">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};

