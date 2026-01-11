import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SegmentedControl } from '../SegmentedControl';
import { Field } from '../Field';
import styles from './AccountsSection.module.scss';
import { cn } from '@/lib/utils';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function AccountsSection({ isOpen, onToggle }: SectionProps) {
    const {
        accounts, setAccounts,
        accountsTitle, setAccountsTitle,
        accountsDescription, setAccountsDescription,
        accountsGroomTitle, setAccountsGroomTitle,
        accountsBrideTitle, setAccountsBrideTitle,
        accountsColorMode, setAccountsColorMode
    } = useInvitationStore();

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleAddAccount = () => {
        const newAccount = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'groom' as const,
            relation: '본인' as const,
            bank: '',
            accountNumber: '',
            holder: ''
        };
        setAccounts([...accounts, newAccount]);
        setExpandedId(newAccount.id);
    };

    const handleUpdateAccount = (id: string, data: Record<string, unknown>) => {
        setAccounts(accounts.map(acc => acc.id === id ? { ...acc, ...data } : acc));
    };

    const handleRemoveAccount = (id: string) => {
        setAccounts(accounts.filter(acc => acc.id !== id));
    };

    return (
        <AccordionItem
            title="축의금 및 계좌번호"
            icon={CreditCard}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={accounts.length > 0}
        >
            <div className={styles.container}>
                {/* Titles */}
                <Field label="페이지 문구">
                    <div className={styles.optionWrapper}>
                        <TextField
                            label="메인 제목"
                            placeholder="예: 마음 전하실 곳"
                            value={accountsTitle}
                            onChange={(e) => setAccountsTitle(e.target.value)}
                        />
                        <TextField
                            label="대표 설명"
                            placeholder="축하의 마음을 담아..."
                            value={accountsDescription}
                            onChange={(e) => setAccountsDescription(e.target.value)}
                            multiline
                            rows={3}
                        />
                    </div>
                </Field>

                {/* Account List */}
                <Field label="계좌 리스트">
                    <div className={styles.accountList}>
                        {accounts.map((acc) => (
                            <div key={acc.id} className={styles.accountItem}>
                                <div
                                    className={styles.accountHeader}
                                    onClick={() => setExpandedId(expandedId === acc.id ? null : acc.id)}
                                >
                                    <div className={styles.accountTitle}>
                                        <span className={cn(styles.badge, acc.type === 'groom' ? styles.groom : styles.bride)}>
                                            {acc.type === 'groom' ? '신랑측' : '신부측'}
                                        </span>
                                        <span className={styles.name}>
                                            {acc.holder || '새 계좌'} ({acc.relation})
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={cn(styles.chevron, expandedId === acc.id && styles.expanded)}
                                    />
                                </div>

                                {expandedId === acc.id && (
                                    <div className={styles.accountBody}>
                                        <div className={styles.fieldRow}>
                                            <div className={styles.flex2}>
                                                <SegmentedControl
                                                    value={acc.type}
                                                    options={[
                                                        { label: '신랑측', value: 'groom' },
                                                        { label: '신부측', value: 'bride' },
                                                    ]}
                                                    onChange={(val) => handleUpdateAccount(acc.id, { type: val as 'groom' | 'bride' })}
                                                />
                                            </div>
                                            <div className={styles.flex3}>
                                                <TextField
                                                    placeholder="관계 (예: 본인, 아버지)"
                                                    value={acc.relation}
                                                    onChange={(e) => handleUpdateAccount(acc.id, { relation: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.fieldRow}>
                                            <div className={styles.flex1}>
                                                <TextField
                                                    label="은행"
                                                    placeholder="예: 신한"
                                                    value={acc.bank}
                                                    onChange={(e) => handleUpdateAccount(acc.id, { bank: e.target.value })}
                                                />
                                            </div>
                                            <div className={styles.flex1}>
                                                <TextField
                                                    label="예금주"
                                                    placeholder="성함"
                                                    value={acc.holder}
                                                    onChange={(e) => handleUpdateAccount(acc.id, { holder: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <TextField
                                            label="계좌번호"
                                            placeholder="숫자만 입력"
                                            value={acc.accountNumber}
                                            onChange={(e) => handleUpdateAccount(acc.id, { accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                                        />

                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => handleRemoveAccount(acc.id)}
                                        >
                                            <Trash2 size={14} />
                                            <span>계좌 삭제</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            className={styles.addBtn}
                            onClick={handleAddAccount}
                        >
                            <Plus size={18} />
                            <span>계좌 추가하기</span>
                        </button>
                    </div>
                </Field>

                {/* Appearance Settings */}
                <Field label="표시 설정">
                    <div className={styles.optionWrapper}>
                        <TextField
                            label="신랑측 그룹 제목"
                            placeholder="신랑 측 마음 전하실 곳"
                            value={accountsGroomTitle}
                            onChange={(e) => setAccountsGroomTitle(e.target.value)}
                        />
                        <TextField
                            label="신부측 그룹 제목"
                            placeholder="신부 측 마음 전하실 곳"
                            value={accountsBrideTitle}
                            onChange={(e) => setAccountsBrideTitle(e.target.value)}
                        />
                        <Field label="색상 모드" className="mt-2">
                            <SegmentedControl
                                value={accountsColorMode}
                                options={[
                                    { label: '강조', value: 'accent' },
                                    { label: '은은하게', value: 'subtle' },
                                    { label: '화이트', value: 'white' },
                                ]}
                                onChange={(val) => setAccountsColorMode(val as 'accent' | 'subtle' | 'white')}
                            />
                        </Field>
                    </div>
                </Field>
            </div>
        </AccordionItem>
    );
}
