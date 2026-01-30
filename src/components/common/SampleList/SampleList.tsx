import React from 'react';
import styles from './SampleList.module.scss';
import type { SamplePhraseItem } from '@/types/builder';
import { cn } from '@/lib/utils';
import { List, ListRow } from '@/components/ui/List';
import { Badge } from '@/components/ui/Badge';
import { Spacing } from '@/components/ui/Spacing';

interface SampleListProps {
    items: SamplePhraseItem[];
    onSelect: (item: SamplePhraseItem) => void;
    className?: string;
}

export const SampleList = ({ items, onSelect, className }: SampleListProps) => {
    return (
        <List className={cn(styles.container, className)}>
            {items.map((item, idx) => (
                <ListRow
                    key={idx}
                    onClick={() => onSelect(item)}
                    contents={
                        <div className={styles.itemContent}>
                            <div className={styles.itemHeader}>
                                <Badge size="1" variant="soft" color="primary">{item.badge || `예시 ${idx + 1}`}</Badge>
                                <span className={styles.itemTitle}>{item.title}</span>
                            </div>
                            <Spacing size={8} />
                            <div
                                className={styles.itemBody}
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        </div>
                    }
                />
            ))}
        </List>
    );
};

SampleList.displayName = 'SampleList';
