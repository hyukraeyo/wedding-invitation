import React, { useCallback, useMemo } from 'react';
import { Trash2, ChevronDown, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { BankPicker } from '@/components/common/BankPicker';
import { RelationPicker } from '@/components/common/RelationPicker';
import styles from './AccountCard.module.scss';

export interface AccountData {
  id: string;
  type: 'groom' | 'bride';
  relation: string;
  bank: string;
  accountNumber: string;
  holder: string;
}

interface AccountCardProps {
  account: AccountData;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, data: Record<string, string>) => void;
  onRemove: (id: string) => void;
  onRelationChange: (id: string, relation: string, type: 'groom' | 'bride') => void;
  getHolderName: (relation: string, type: 'groom' | 'bride') => string;
}

export default function AccountCard({
  account,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
  onRelationChange,
  getHolderName,
}: AccountCardProps) {
  const isCustomRelation = useMemo(
    () => !['본인', '아버지', '어머니'].includes(account.relation),
    [account.relation]
  );

  const handleTypeChange = useCallback(
    (val: string) => {
      const newType = val as 'groom' | 'bride';
      const newHolder = getHolderName(account.relation, newType);
      const updates: Record<string, string> = { type: newType };
      if (newHolder) {
        updates.holder = newHolder;
      }
      onUpdate(account.id, updates);
    },
    [account.id, account.relation, getHolderName, onUpdate]
  );

  const handleRelationSelect = useCallback(
    (val: string) => {
      if (val === '' || val === 'custom') {
        onUpdate(account.id, { relation: '' });
      } else {
        onRelationChange(account.id, val, account.type);
      }
    },
    [account.id, account.type, onRelationChange, onUpdate]
  );

  const handleRelationInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(account.id, { relation: e.target.value });
    },
    [account.id, onUpdate]
  );

  const handleBankChange = useCallback(
    (val: string) => {
      onUpdate(account.id, { bank: val });
    },
    [account.id, onUpdate]
  );

  const handleHolderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(account.id, { holder: e.target.value });
    },
    [account.id, onUpdate]
  );

  const handleAccountNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9-]/g, '');
      onUpdate(account.id, { accountNumber: value });
    },
    [account.id, onUpdate]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(account.id);
    },
    [account.id, onRemove]
  );

  // Summary text for collapsed state
  const summaryText = useMemo(() => {
    const parts: string[] = [];
    if (account.bank) parts.push(account.bank);
    if (account.accountNumber) parts.push(account.accountNumber);
    return parts.join(' · ') || '계좌 정보를 입력하세요';
  }, [account.bank, account.accountNumber]);

  return (
    <div className={cn(styles.card, isExpanded && styles.expanded)}>
      {/* Card Header */}
      <div
        className={styles.header}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={isExpanded}
      >
        <div className={styles.headerLeft}>
          <span
            className={cn(styles.typeBadge, account.type === 'groom' ? styles.groom : styles.bride)}
          >
            {account.type === 'groom' ? '신랑' : '신부'}
          </span>
          <div className={styles.headerInfo}>
            <span className={styles.holderName}>{account.holder || '새 계좌'}</span>
            <span className={styles.relationLabel}>{account.relation || '관계 미설정'}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <IconButton
            iconSize={18}
            variant="ghost"
            className={styles.deleteBtn}
            onClick={handleRemove}
            name=""
            aria-label="삭제"
          >
            <Trash2 size={18} />
          </IconButton>
          <ChevronDown size={16} className={cn(styles.chevron, isExpanded && styles.chevronOpen)} />
        </div>
      </div>

      {/* Collapsed Summary */}
      {!isExpanded && (account.bank || account.accountNumber) && (
        <div className={styles.summary}>
          <span className={styles.summaryText}>{summaryText}</span>
        </div>
      )}

      {/* Expanded Body */}
      <div className={cn(styles.body, isExpanded && styles.bodyOpen)} aria-hidden={!isExpanded}>
        <div className={styles.bodyInner}>
          {/* Type Selector */}
          <div className={styles.fieldGroup}>
            <SegmentedControl value={account.type} onChange={handleTypeChange} alignment="fluid">
              <SegmentedControl.Item value="groom">신랑측</SegmentedControl.Item>
              <SegmentedControl.Item value="bride">신부측</SegmentedControl.Item>
            </SegmentedControl>
          </div>

          {/* Relation Picker */}
          <div className={styles.fieldGroup}>
            <RelationPicker value={account.relation} onChange={handleRelationSelect} />
          </div>

          {/* Custom Relation Input */}
          {isCustomRelation && (
            <div className={styles.fieldGroup}>
              <TextField
                placeholder="관계를 직접 입력하세요"
                value={account.relation}
                onChange={handleRelationInput}
              />
            </div>
          )}

          {/* Bank & Holder Row */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldHalf}>
              <BankPicker value={account.bank} onChange={handleBankChange} />
            </div>
            <div className={styles.fieldHalf}>
              <TextField
                placeholder="예금주"
                value={account.holder}
                onChange={handleHolderChange}
              />
            </div>
          </div>

          {/* Account Number */}
          <div className={styles.fieldGroup}>
            <TextField
              placeholder="계좌번호를 입력하세요"
              value={account.accountNumber}
              onChange={handleAccountNumberChange}
              inputMode="numeric"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

AccountCard.displayName = 'AccountCard';
