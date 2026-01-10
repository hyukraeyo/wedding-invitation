'use client';

import React, { memo } from 'react';
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
    description,
    groomTitle,
    brideTitle,
    colorMode,
    accentColor
}: AccountsViewProps) => {

    const groomAccounts = accounts.filter(a => a.type === 'groom');
    const brideAccounts = accounts.filter(a => a.type === 'bride');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('계좌번호가 복사되었습니다.');
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
                        <div className={styles.bankName}>{acc.bank}</div>
                        <div className={styles.accountDetails}>{acc.accountNumber} <span className={styles.holderName}>{acc.holder}</span></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <SectionContainer id={id}>
            <SectionHeader
                title={title || "축하의 마음 전하실 곳"}
                subtitle="GIFT"
                accentColor={accentColor}
            />

            {description && (
                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}

            {groomAccounts.length > 0 && (
                <PreviewAccordion
                    title={groomTitle || "신랑 측 마음 전하실 곳"}
                    mode={colorMode}
                    accentColor={accentColor}
                >
                    {renderAccountList(groomAccounts)}
                </PreviewAccordion>
            )}

            {brideAccounts.length > 0 && (
                <PreviewAccordion
                    title={brideTitle || "신부 측 마음 전하실 곳"}
                    mode={colorMode}
                    accentColor={accentColor}
                >
                    {renderAccountList(brideAccounts)}
                </PreviewAccordion>
            )}
        </SectionContainer>
    );
});

AccountsView.displayName = 'AccountsView';

export default AccountsView;
