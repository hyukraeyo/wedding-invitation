import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import styles from './ExampleSelectorModal.module.scss';

export interface ExampleItem {
    id?: string | number;
    title: string;
    content: string;
    badge?: string;
    subtitle?: string;
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

export const ExampleSelectorModal = React.memo(function ExampleSelectorModal<T extends ExampleItem>({
    isOpen,
    onClose,
    title,
    items,
    onSelect,
    className
}: ExampleSelectorModalProps<T>) {
    const listRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState({
        isTop: true,
        isBottom: true, // Default to true to prevent initial fade flash on short content
    });

    const checkScroll = () => {
        const el = listRef.current;
        if (!el) return;

        requestAnimationFrame(() => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const isScrollable = scrollHeight > clientHeight;

            setScrollState({
                isTop: scrollTop <= 0,
                isBottom: !isScrollable || Math.ceil(scrollTop + clientHeight) >= scrollHeight
            });
        });
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        // Small timeout to ensure layout is done
        const timer = setTimeout(checkScroll, 0);
        return () => clearTimeout(timer);
    }, [isOpen, items]);

    return (
        <ResponsiveModal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title={title}
            className={className}
            contentClassName={cn(
                !scrollState.isTop && !scrollState.isBottom && styles.maskBoth,
                !scrollState.isTop && scrollState.isBottom && styles.maskTop,
                scrollState.isTop && !scrollState.isBottom && styles.maskBottom
            )}
            scrollRef={listRef}
            onScroll={checkScroll}
        >
            <div className={styles.scrollWrapper}>
                <div className={styles.listContainer}>
                    {items.map((item, idx) => (
                        <button
                            key={item.id || idx}
                            className={styles.itemButton}
                            onClick={() => onSelect(item)}
                            autoFocus={idx === 0}
                            type="button"
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
            </div>
        </ResponsiveModal>
    );
}) as unknown as {
    <T extends ExampleItem>(props: ExampleSelectorModalProps<T>): React.ReactElement;
    displayName?: string;
};

ExampleSelectorModal.displayName = 'ExampleSelectorModal';
