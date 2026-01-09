'use client';

import React, { useState, memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import styles from './AccountsView.module.css';

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
    accentColor: string;
}

/**
 * Presentational Component for the Accounts section.
 * Features an accordion for Groom and Bride account details.
 */
const AccountsView = memo(({
    id,
    accounts,
    accentColor
}: AccountsViewProps) => {
    const [openType, setOpenType] = useState<'groom' | 'bride' | null>(null);

    const groomAccounts = accounts.filter(a => a.type === 'groom');
    const brideAccounts = accounts.filter(a => a.type === 'bride');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('계좌번호가 복사되었습니다.');
    };

    const renderAccountGroup = (title: string, type: 'groom' | 'bride', list: Account[]) => {
        if (list.length === 0) return null;
        const isOpen = openType === type;

        return (
            <div className={styles.groupContainer}>
                <button
                    className={styles.groupHeader}
                    onClick={() => setOpenType(isOpen ? null : type)}
                >
                    <span className={styles.groupTitle}>{title} 측 마음 전하실 곳</span>
                    {isOpen ? <ChevronUp size={20} opacity={0.3} /> : <ChevronDown size={20} opacity={0.3} />}
                </button>
                <div
                    className={styles.groupContent}
                    style={{ maxHeight: isOpen ? '1000px' : '0', opacity: isOpen ? 1 : 0 }}
                >
                    {list.map(acc => (
                        <div key={acc.id} className={styles.accountCard}>
                            <div className={styles.accountHeader}>
                                <span className={styles.relationLabel}>{acc.relation}</span>
                                <button className={styles.copyButton} onClick={() => handleCopy(acc.accountNumber)}>복사하기</button>
                            </div>
                            <div className={styles.accountInfo}>
                                <div className={styles.bankName}>{acc.bank}</div>
                                <div className={styles.accountDetails}>{acc.accountNumber} <span className="font-normal opacity-60 ml-1">{acc.holder}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <SectionContainer id={id}>
            <div className={styles.header}>
                <span className={styles.subtitle} style={{ color: accentColor }}>GIFT</span>
                <h2 className={styles.title}>축하의 마음 전하실 곳</h2>
                <div className={styles.decorationLine} style={{ backgroundColor: accentColor }} />
            </div>

            <p className={styles.description}>
                축하의 마음을 담아 축의금을 전달하고자 하시는 분들을 위해<br />
                계좌번호를 안내해 드립니다.
            </p>

            {renderAccountGroup('신랑', 'groom', groomAccounts)}
            {renderAccountGroup('신부', 'bride', brideAccounts)}
        </SectionContainer>
    );
});

AccountsView.displayName = 'AccountsView';

export default AccountsView;
