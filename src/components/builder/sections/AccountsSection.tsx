import React from 'react';
import dynamic from 'next/dynamic';
import { BoardRow } from '@/components/ui/BoardRow';
import type { SectionProps } from '@/types/builder';
import styles from './AccountsSection.module.scss';

const AccountsSectionContent = dynamic(() => import('./AccountsSectionContent'), {
    loading: () => (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
        </div>
    ),
    ssr: false
});

export default function AccountsSection(props: SectionProps) {
    return (
        <BoardRow
            title="축의금 및 계좌번호"
            isOpened={props.isOpen}
            onOpen={() => props.onToggle?.(true)}
            onClose={() => props.onToggle?.(false)}
            icon={<BoardRow.ArrowIcon />}
        >
            {props.isOpen ? <AccountsSectionContent /> : null}
        </BoardRow>
    );
}
