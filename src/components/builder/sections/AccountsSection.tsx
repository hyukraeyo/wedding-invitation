import React from 'react';
import dynamic from 'next/dynamic';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
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


    return (
        <AccordionItem value={value} autoScroll>
            <AccordionTrigger>
                축의금 및 계좌번호
            </AccordionTrigger>
            <AccordionContent>
                {isOpen ? <AccountsSectionContent /> : null}
            </AccordionContent>
        </AccordionItem>
    );
}
