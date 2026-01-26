import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { IconButton } from '@/components/ui/IconButton';
import { Button as UIButton } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { Select } from '@/components/ui/Select';
import styles from './AccountsSection.module.scss';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor), { ssr: false });

export default function AccountsSectionContent() {
    const {
        accounts,
        setAccounts,
        accountsTitle,
        setAccountsTitle,
        accountsSubtitle,
        setAccountsSubtitle,
        accountsDescription,
        setAccountsDescription,
        accountsGroomTitle,
        setAccountsGroomTitle,
        accountsBrideTitle,
        setAccountsBrideTitle,
        accountsColorMode,
        setAccountsColorMode,
        groom,
        bride,
    } = useInvitationStore(useShallow((state) => ({
        accounts: state.accounts,
        setAccounts: state.setAccounts,
        accountsTitle: state.accountsTitle,
        setAccountsTitle: state.setAccountsTitle,
        accountsSubtitle: state.accountsSubtitle,
        setAccountsSubtitle: state.setAccountsSubtitle,
        accountsDescription: state.accountsDescription,
        setAccountsDescription: state.setAccountsDescription,
        accountsGroomTitle: state.accountsGroomTitle,
        setAccountsGroomTitle: state.setAccountsGroomTitle,
        accountsBrideTitle: state.accountsBrideTitle,
        setAccountsBrideTitle: state.setAccountsBrideTitle,
        accountsColorMode: state.accountsColorMode,
        setAccountsColorMode: state.setAccountsColorMode,
        groom: state.groom,
        bride: state.bride,
    })));

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
        setAccounts((prev) => [...prev, newAccount]);
        setExpandedId(newAccount.id);
    };

    const handleUpdateAccount = (id: string, data: Record<string, unknown>) => {
        setAccounts((prev) => prev.map(acc => acc.id === id ? { ...acc, ...data } : acc));
    };

    const handleRemoveAccount = (id: string) => {
        setAccounts((prev) => prev.filter(acc => acc.id !== id));
    };

    const getHolderName = useCallback((rel: string, type: 'groom' | 'bride') => {
        const person = type === 'groom' ? groom : bride;
        if (rel === '본인') return `${person.lastName}${person.firstName}`;
        if (rel === '아버지') return person.parents.father.name;
        if (rel === '어머니') return person.parents.mother.name;
        return '';
    }, [groom, bride]);

    // 기본 정보 변경 시 예금주 자동 동기화
    useEffect(() => {
        let hasChanges = false;
        const updatedAccounts = accounts.map((acc) => {
            if (['본인', '아버지', '어머니'].includes(acc.relation)) {
                const newHolder = getHolderName(acc.relation, acc.type);
                if (newHolder && acc.holder !== newHolder) {
                    hasChanges = true;
                    return { ...acc, holder: newHolder };
                }
            }
            return acc;
        });

        if (hasChanges) {
            setAccounts(updatedAccounts);
        }
    }, [accounts, setAccounts, getHolderName]);

    const handleRelationChange = (id: string, rel: string, type: 'groom' | 'bride') => {
        const newHolder = getHolderName(rel, type);
        const updates: Record<string, string> = { relation: rel };
        if (newHolder) {
            updates.holder = newHolder;
        }
        handleUpdateAccount(id, updates);
    };

    return (
        <SectionContainer>
            <Field
                label="소제목"
            >
                <Input
                    placeholder="예: GIFT"
                    value={accountsSubtitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountsSubtitle(e.target.value)}
                />
            </Field>
            <Field
                label="제목"
            >
                <Input
                    placeholder="예: 마음 전하실 곳"
                    value={accountsTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountsTitle(e.target.value)}
                />
            </Field>

            <Field label="내용">
                <RichTextEditor
                    content={accountsDescription}
                    onChange={(val: string) => setAccountsDescription(val)}
                    placeholder="축하의 마음을 담아..."
                />
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
                                <div className={styles.headerActions}>
                                    <IconButton
                                        icon={Trash2}
                                        size="sm"
                                        variant="ghost"
                                        className={styles.deleteButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveAccount(acc.id);
                                        }}
                                    />
                                    <ChevronDown
                                        size={18}
                                        className={cn(styles.chevron, expandedId === acc.id && styles.expanded)}
                                    />
                                </div>
                            </div>

                            {expandedId === acc.id ? (
                                <div className={styles.accountBody}>
                                    <div className={styles.fieldRow}>
                                        <div className={styles.flex3}>
                                            <Tabs
                                                value={acc.type}
                                                onValueChange={(val: string) => {
                                                    const newType = val === 'bride' ? 'bride' : 'groom';
                                                    const newHolder = getHolderName(acc.relation, newType);
                                                    const updates: Record<string, string> = { type: newType };
                                                    if (newHolder) {
                                                        updates.holder = newHolder;
                                                    }
                                                    handleUpdateAccount(acc.id, updates);
                                                }}
                                            >
                                                <TabsList fluid>
                                                    <TabsTrigger value="groom">신랑측</TabsTrigger>
                                                    <TabsTrigger value="bride">신부측</TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>
                                        <div className={styles.flex2}>
                                            <Select
                                                value={['본인', '아버지', '어머니'].includes(acc.relation) ? acc.relation : 'custom'}
                                                options={[
                                                    { label: '본인', value: '본인' },
                                                    { label: '아버지', value: '아버지' },
                                                    { label: '어머니', value: '어머니' },
                                                    { label: '직접 입력', value: 'custom' },
                                                ]}
                                                onValueChange={(val) => {
                                                    const newVal = String(val);
                                                    if (newVal === 'custom') {
                                                        handleUpdateAccount(acc.id, { relation: '' });
                                                    } else {
                                                        handleRelationChange(acc.id, newVal, acc.type);
                                                    }
                                                }}
                                                placeholder="관계 선택"
                                                modalTitle="관계 선택"
                                            />
                                        </div>
                                    </div>

                                     {!['본인', '아버지', '어머니'].includes(acc.relation) ? (
                                        <Input
                                            placeholder="관계를 직접 입력하세요 (예: 본인, 아버지)"
                                            value={acc.relation}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateAccount(acc.id, { relation: e.target.value })}
                                        />
                                    ) : null}

                                    <div className={styles.fieldRow}>
                                        <div className={styles.flex1}>
                                            <Input
                                                placeholder="예: 신한"
                                                value={acc.bank}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateAccount(acc.id, { bank: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.flex1}>
                                            <Input
                                                placeholder="성함"
                                                value={acc.holder}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateAccount(acc.id, { holder: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Input
                                        placeholder="계좌번호를 입력하세요"
                                        value={acc.accountNumber}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = e.target.value.replace(/[^0-9-]/g, '');
                                            handleUpdateAccount(acc.id, { accountNumber: value });
                                        }}
                                    />
                                </div>
                            ) : null}
                        </div>
                    ))}

                    <UIButton
                        variant="outline"
                        className={styles.addAccountBtn}
                        onClick={handleAddAccount}
                    >
                        <Plus size={18} />
                        <span>계좌 추가하기</span>
                    </UIButton>
                </div>
            </Field>

            {/* Appearance Settings */}
            <Field label="신랑측 그룹 제목">
                <Input
                    placeholder="신랑 측 마음 전하실 곳"
                    value={accountsGroomTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountsGroomTitle(e.target.value)}
                />
            </Field>
            <Field label="신부측 그룹 제목">
                <Input
                    placeholder="신부 측 마음 전하실 곳"
                    value={accountsBrideTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountsBrideTitle(e.target.value)}
                />
            </Field>
            <Field label="색상 모드">
                <Tabs
                    value={accountsColorMode}
                    onValueChange={(val: string) => {
                        const nextMode = val === 'subtle' ? 'subtle' : val === 'white' ? 'white' : 'accent';
                        setAccountsColorMode(nextMode);
                    }}
                >
                    <TabsList fluid>
                        <TabsTrigger value="accent">강조</TabsTrigger>
                        <TabsTrigger value="subtle">은은하게</TabsTrigger>
                        <TabsTrigger value="white">화이트</TabsTrigger>
                    </TabsList>
                </Tabs>
            </Field>
        </SectionContainer>
    );
}
