import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoMessageProps {
    children: React.ReactNode;
    className?: string;
}

export const InfoMessage = ({ children, className }: InfoMessageProps) => {
    return (
        <div className={cn("flex items-start gap-1.5 p-3 text-xs text-stone-500", className)}>
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div className="leading-normal">
                {children}
            </div>
        </div>
    );
};
