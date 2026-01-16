'use client';

import React, { memo } from 'react';
import { useToast } from '@/hooks/use-toast';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
import PreviewAccordion from '../PreviewAccordion';
import styles from './AccountsView.module.scss';

interface Account {
    id: string;
    type: 'groom' | 'bride';
    relation: '본인' | '아버지' | '어머니';
    bank: string;
    accountNumber: string;
    holder: string;
}

interface AccountsViewProps {
    id?: string | undefined;
    accounts: Account[];
    title: string;
    subtitle: string;
    description: string;
    groomTitle: string;
    brideTitle: string;
    colorMode: 'accent' | 'subtle' | 'white';
    accentColor: string;
}

/**
 * Presentational Component for the Accounts section.
 * Refactored to use common PreviewAccordion with customization support.
 */
const AccountsView = memo(({
    id,
    accounts,
    title,
    subtitle,
    description,
    groomTitle,
    brideTitle,
    colorMode,
    accentColor
}: AccountsViewProps) => {
    const { toast } = useToast();

    const groomAccounts = (accounts || []).filter(a => a.type === 'groom');
    const brideAccounts = (accounts || []).filter(a => a.type === 'bride');

    const handleCopy = (text: string) => {
        const onlyNumbers = text.replace(/[^0-9]/g, '');
        navigator.clipboard.writeText(onlyNumbers);
        toast({
            description: '계좌번호가 복사되었습니다.',
        });
    };

    const renderAccountList = (list: Account[]) => (
        <div className={styles.accountList}>
            {list.map(acc => (
                <div key={acc.id} className={styles.accountCard}>
                    <div className={styles.accountHeader}>
                        <span className={styles.relationLabel}>{acc.relation}</span>
                        <button className={styles.copyButton} onClick={() => handleCopy(acc.accountNumber)}>복사하기</button>
                    </div>
                    <div className={styles.accountInfo}>
                        <div className={styles.bankAndHolder}>
                            {acc.bank}
                            <span style={{ width: '1px', height: '10px', background: '#dee2e6' }} />
                            {acc.holder}
                        </div>
                        <div className={styles.accountDetails}>{acc.accountNumber}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <SectionContainer id={id}>
            {title || description ? (
                <>
                    <SectionHeader
                        title={title}
                        subtitle={subtitle}
                        accentColor={accentColor}
                    />

                    {description ? (
                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    ) : null}
                </>
            ) : null}

            {groomAccounts.length > 0 ? (
                <PreviewAccordion
                    title={groomTitle || "신랑 측 마음 전하실 곳"}
                    mode={colorMode}
                    accentColor={accentColor}
                >
                    {renderAccountList(groomAccounts)}
                </PreviewAccordion>
            ) : null}

            {brideAccounts.length > 0 ? (
                <PreviewAccordion
                    title={brideTitle || "신부 측 마음 전하실 곳"}
                    mode={colorMode}
                    accentColor={accentColor}
                >
                    {renderAccountList(brideAccounts)}
                </PreviewAccordion>
            ) : null}
        </SectionContainer>
    );
});

AccountsView.displayName = 'AccountsView';

export default AccountsView;
