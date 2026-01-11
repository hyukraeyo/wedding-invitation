import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Ensure accessibility for Description if missing

interface BuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const BuilderModal = ({ isOpen, onClose, title, children, className = "" }: BuilderModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={cn("sm:max-w-[425px]", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {/* Add Description for accessibility compliance if needed, or use VisuallyHidden */}
                    <VisuallyHidden>
                        <DialogDescription>
                            {title}
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="py-2">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

