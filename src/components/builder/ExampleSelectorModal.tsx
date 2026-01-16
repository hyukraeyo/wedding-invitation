import React from 'react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { cn } from '@/lib/utils';
import styles from './ExampleSelectorModal.module.scss';

export interface ExampleItem {
    id?: string | number;
    title: string;
    content: string; // HTML content or plain text
    badge?: string;
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
        <ResponsiveModal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title={title}
            className={className}
        >
            <div className={cn(styles.listContainer, "mt-4")}>
                {items.map((item, idx) => (
                    <button
                        key={item.id || idx}
                        className={cn(styles.itemButton, "transition-transform duration-200 active:scale-[0.98]")}
                        onClick={() => onSelect(item)}
                    >
                        <div className={styles.itemHeader}>
                            <span className={styles.badge}>
                                {item.badge || `예시 ${idx + 1}`}
                            </span>
                            <span className={styles.itemTitle}>
                                {item.title}
                            </span>
                        </div>

                        <div
                            className={styles.itemContent}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    </button>
                ))}
            </div>
        </ResponsiveModal>
    );
};
