import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderActionProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    className?: string;
}

export const HeaderAction = ({ icon: Icon, label, onClick, className }: HeaderActionProps) => {
    return (
        <div
            role="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            onMouseDown={(e) => {
                // Prevent parent focus
                e.preventDefault();
                e.stopPropagation();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
                "flex items-center gap-1 px-2.5 py-1 ml-2 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer select-none",
                className
            )}
        >
            <Icon size={11} />
            <span>{label}</span>
        </div>
    );
};
