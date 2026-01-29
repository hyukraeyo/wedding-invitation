import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import styles from './HeaderAction.module.scss';

interface HeaderActionProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    className?: string;
}

export const HeaderAction = React.memo(({ icon: Icon, label, onClick, className }: HeaderActionProps) => {
    return (
        <Button
            type="button"
            variant="weak"
            size="small"
            onPointerDown={(e: React.PointerEvent) => {
                // Stop propagation to prevent Radix Accordion from toggling
                e.stopPropagation();
            }}
            onMouseDown={(e: React.MouseEvent) => {
                // Stop propagation to prevent Radix Accordion from toggling
                e.stopPropagation();
            }}
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                onClick();
            }}
            className={cn(styles.headerAction, className)}
        >
            <Icon size={14} />
            <span>{label}</span>
        </Button>
    );
});

HeaderAction.displayName = 'HeaderAction';
