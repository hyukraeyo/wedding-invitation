import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
            type="button"
            variant="secondary"
            size="sm"
            onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            onMouseDown={(e: React.MouseEvent) => {
                // Prevent parent focus and accordion toggle
                e.preventDefault();
                e.stopPropagation();
            }}
            onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
            className={cn("h-7 px-2.5 text-[11px] font-medium gap-1.5", className)}
        >
            <Icon size={14} />
            <span>{label}</span>
        </Button>
    );
};
