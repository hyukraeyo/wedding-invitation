import React from 'react';
import styles from './SampleList.module.scss';
import type { SamplePhraseItem } from '@/types/builder';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SampleListProps {
  items: SamplePhraseItem[];
  onSelect: (item: SamplePhraseItem) => void;
  className?: string;
}

export const SampleList = ({ items, onSelect, className }: SampleListProps) => {
  return (
    <div className={cn(styles.container, className)}>
      {items.map((item, idx) => (
        <Button key={idx} unstyled className={styles.itemButton} onClick={() => onSelect(item)}>
          <div className={styles.itemContent}>
            <div className={styles.itemHeader}>
              <Badge size="sm" variant="soft" color="primary">
                {item.badge || `예시 ${idx + 1}`}
              </Badge>
            </div>
            <span className={styles.itemTitle}>{item.title}</span>
            {item.subtitle && <span className={styles.itemSubtitle}>{item.subtitle}</span>}
            <div
              className={styles.itemBody}
              dangerouslySetInnerHTML={{ __html: item.content || '' }}
            />
          </div>
        </Button>
      ))}
    </div>
  );
};

SampleList.displayName = 'SampleList';
