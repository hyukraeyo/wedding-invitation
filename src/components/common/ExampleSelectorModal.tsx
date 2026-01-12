import React from 'react';
import { Modal } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ExampleItem {
    id?: string | number;
    title: string;
    content: string; // HTML content or plain text
    badge?: string;
    // Additional generic fields can be passed through but we'll focus on display
    subtitle?: string; // Some might have subtitle
    [key: string]: unknown;
}

interface ExampleSelectorModalProps<T extends ExampleItem> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items: T[];
    onSelect: (item: T) => void;
    className?: string;
}

export const ExampleSelectorModal = <T extends ExampleItem>({
    isOpen,
    onClose,
    title,
    items,
    onSelect,
    className
}: ExampleSelectorModalProps<T>) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className={cn("sm:max-w-md", className)}
        >
            <div className="flex flex-col gap-3 py-2 max-h-[60vh] overflow-y-auto px-1">
                {items.map((item, idx) => (
                    <button
                        key={item.id || idx}
                        className={cn(
                            "flex flex-col gap-3 p-4 rounded-xl text-left transition-all duration-200",
                            "bg-white border text-card-foreground shadow-sm",
                            "hover:border-primary hover:shadow-md hover:scale-[1.01]",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20"
                        )}
                        onClick={() => onSelect(item)}
                    >
                        <div className="flex items-center justify-between w-full">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold ring-1 ring-inset ring-blue-700/10">
                                {item.badge || `예시 ${idx + 1}`}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 ml-auto">
                                {item.title}
                            </span>
                        </div>

                        <div
                            className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-keep"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    </button>
                ))}
            </div>
        </Modal>
    );
};
