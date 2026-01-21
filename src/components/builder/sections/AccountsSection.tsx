import React from 'react';
import { CreditCard } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
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

export default function AccountsSection({ value, isOpen }: SectionProps) {
    const accounts = useInvitationStore(useShallow((state) => state.accounts));

    return (
        <AccordionItem
            value={value}
            title="축의금 및 계좌번호"
            icon={CreditCard}
            isOpen={isOpen}
            isCompleted={accounts.length > 0}
        >
            {isOpen ? <AccountsSectionContent /> : null}
        </AccordionItem>
    );
}
