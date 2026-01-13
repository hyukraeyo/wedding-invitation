"use client";

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
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

// SSR-safe check for client-side mounting
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const ExampleSelectorModal = <T extends ExampleItem>({
    isOpen,
    onClose,
    title,
    items,
    onSelect,
    className
}: ExampleSelectorModalProps<T>) => {
    // useSyncExternalStore for SSR-safe mounting check (no lint warnings)
    const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isMounted || !isOpen) return null;

    return createPortal(
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="example-modal-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={cn(styles.modal, className)}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label="닫기"
                >
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <h2 id="example-modal-title" className={styles.title}>
                        {title}
                    </h2>
                    <p className={styles.subtitle}>
                        마음에 드는 문구를 선택하시면<br />
                        자동으로 입력됩니다.
                    </p>
                </div>

                <div className={styles.listContainer}>
                    {items.map((item, idx) => (
                        <button
                            key={item.id || idx}
                            className={styles.itemButton}
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
            </div>
        </div>,
        document.body
    );
};
