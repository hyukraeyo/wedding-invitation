import React from 'react';
import styles from './SampleList.module.scss';
import type { SamplePhraseItem } from '@/types/builder';
import { cn } from '@/lib/utils';

interface SampleListProps {
    items: SamplePhraseItem[];
    onSelect: (item: SamplePhraseItem) => void;
    className?: string;
}

export const SampleList = ({ items, onSelect, className }: SampleListProps) => {
    return (
        <div className={cn(styles.container, className)}>
            {items.map((item, idx) => (
                <button
                    key={idx}
                    type="button"
                    className={styles.card}
                    onClick={() => onSelect(item)}
                >
                    <div className={styles.header}>
                        <span className={styles.badge}>
                            {item.badge || `예시 ${idx + 1}`}
                        </span>
                        <span className={styles.title}>
                            {item.title}
                        </span>
                    </div>
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                </button>
            ))}
        </div>
    );
};

SampleList.displayName = 'SampleList';
