import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { RichTextEditor } from '@/components/common/RichTextEditor';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import { AccountCard } from './AccountCard';
import styles from './AccountsSection.module.scss';

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
    groom,
    bride,
  } = useInvitationStore(
    useShallow((state) => ({
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
      groom: state.groom,
      bride: state.bride,
    }))
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddAccount = () => {
    const newAccount = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'groom' as const,
      relation: '본인' as const,
      bank: '',
      accountNumber: '',
      holder: '',
    };
    setAccounts((prev) => [...prev, newAccount]);
    setExpandedId(newAccount.id);
  };

  const handleUpdateAccount = (id: string, data: Record<string, unknown>) => {
    setAccounts((prev) => prev.map((acc) => (acc.id === id ? { ...acc, ...data } : acc)));
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const getHolderName = useCallback(
    (rel: string, type: 'groom' | 'bride') => {
      const person = type === 'groom' ? groom : bride;
      if (rel === '본인') return `${person.lastName}${person.firstName}`;
      if (rel === '아버지') return person.parents.father.name;
      if (rel === '어머니') return person.parents.mother.name;
      return '';
    },
    [groom, bride]
  );

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
    <>
      <FormField name="accounts-subtitle">
        <FormLabel htmlFor="accounts-subtitle">소제목</FormLabel>
        <FormControl asChild>
          <TextField
            id="accounts-subtitle"
            placeholder="예: GIFT"
            value={accountsSubtitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAccountsSubtitle(e.target.value)
            }
          />
        </FormControl>
      </FormField>
      <FormField name="accounts-title">
        <FormLabel htmlFor="accounts-title">제목</FormLabel>
        <FormControl asChild>
          <TextField
            id="accounts-title"
            placeholder="예: 마음 전하실 곳"
            value={accountsTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountsTitle(e.target.value)}
          />
        </FormControl>
      </FormField>

      <FormField name="accounts-content">
        <FormLabel>내용</FormLabel>
        <RichTextEditor
          content={accountsDescription}
          onChange={(val: string) => setAccountsDescription(val)}
          placeholder="축하의 마음을 담아..."
        />
      </FormField>

      {/* Account List */}
      <FormField name="accounts-list">
        <FormLabel>계좌 리스트</FormLabel>
        {accounts.length > 0 && (
          <div className={styles.accountList}>
            {accounts.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                isExpanded={expandedId === acc.id}
                onToggle={() => setExpandedId(expandedId === acc.id ? null : acc.id)}
                onUpdate={(id, data) => handleUpdateAccount(id, data)}
                onRemove={(id) => handleRemoveAccount(id)}
                onRelationChange={(id, rel, type) => handleRelationChange(id, rel, type)}
                getHolderName={(rel, type) => getHolderName(rel, type)}
              />
            ))}
          </div>
        )}

        <Button variant="dashed" size="md" radius="md" onClick={handleAddAccount}>
          <Plus size={18} />
          <span>계좌 추가하기</span>
        </Button>
      </FormField>

      {/* Appearance Settings */}
      <FormField name="accounts-groom-title">
        <FormLabel htmlFor="accounts-groom-title">신랑측 그룹 제목</FormLabel>
        <FormControl asChild>
          <TextField
            id="accounts-groom-title"
            placeholder="신랑 측 마음 전하실 곳"
            value={accountsGroomTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAccountsGroomTitle(e.target.value)
            }
          />
        </FormControl>
      </FormField>
      <FormField name="accounts-bride-title">
        <FormLabel htmlFor="accounts-bride-title">신부측 그룹 제목</FormLabel>
        <FormControl asChild>
          <TextField
            id="accounts-bride-title"
            placeholder="신부 측 마음 전하실 곳"
            value={accountsBrideTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAccountsBrideTitle(e.target.value)
            }
          />
        </FormControl>
      </FormField>
    </>
  );
}
