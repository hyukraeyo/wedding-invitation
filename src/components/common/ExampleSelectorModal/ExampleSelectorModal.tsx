import React from 'react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { Button } from '@/components/ui/Button';
import styles from './styles.module.scss';

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
            <div className={styles.listContainer}>
                {items.map((item, idx) => (
                    <Button
                        key={item.id || idx}
                        variant="line"
                        className={styles.itemButton}
                        onClick={() => onSelect(item)}
                        autoFocus={idx === 0}
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
                    </Button>
                ))}
            </div>
        </ResponsiveModal>
    );
};
