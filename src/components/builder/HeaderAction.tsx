import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderActionProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    className?: string;
}

export const HeaderAction = ({ icon: Icon, label, onClick, className }: HeaderActionProps) => {
    return (
        <Button
            asChild
            variant="ghost"
            size="sm"
            onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            onMouseDown={(e: React.MouseEvent) => {
                // Prevent parent focus
                e.preventDefault();
                e.stopPropagation();
            }}
            onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
            className={cn(
                "h-7 px-2.5 ml-2 gap-1 text-[11px] [&_svg]:size-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 active:bg-slate-300 rounded-md",
                className
            )}
        >
            <span role="button" tabIndex={0}>
                <Icon size={11} />
                <span>{label}</span>
            </span>
        </Button>
    );
};
