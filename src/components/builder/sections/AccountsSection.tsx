import React from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';

import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderButton } from '../BuilderButton';
import { BuilderField } from '../BuilderField';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function AccountsSection({ isOpen, onToggle }: SectionProps) {
    const {
        accounts, setAccounts,
        groom, bride
    } = useInvitationStore();

    const addAccount = (type: 'groom' | 'bride') => {
        const id = `${type}-${Date.now()}`;
        const defaultName = type === 'groom' ? `${groom.lastName}${groom.firstName}` : `${bride.lastName}${bride.firstName}`;
        setAccounts([...accounts, { id, type, relation: '본인', bank: '', accountNumber: '', holder: defaultName }]);
    };

    const removeAccount = (id: string) => {
        setAccounts(accounts.filter(a => a.id !== id));
    };

    const updateAccount = (id: string, data: Partial<Account>) => {
        setAccounts(accounts.map(a => a.id === id ? { ...a, ...data } : a));
    };

    const groomAccs = accounts.filter(a => a.type === 'groom');
    const brideAccs = accounts.filter(a => a.type === 'bride');

    return (
        <AccordionItem
            title="마음 전하실 곳"
            icon={CreditCard}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={accounts.length > 0 && accounts.every(a => a.bank && a.accountNumber)}
        >
            <div className="space-y-6">
                {/* Groom Side */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
                            <span className="text-[13px] font-bold text-gray-800">신랑측 계좌</span>
                        </div>
                        <BuilderButton
                            variant="ghost"
                            size="sm"
                            onClick={() => addAccount('groom')}
                            className="h-7 px-2 text-[11px] text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <Plus size={12} className="mr-1" /> 추가
                        </BuilderButton>
                    </div>
                    <div className="space-y-4">
                        {groomAccs.map((acc) => (
                            <AccountEntry
                                key={acc.id}
                                acc={acc}
                                groom={groom}
                                bride={bride}
                                onUpdate={(data) => updateAccount(acc.id, data)}
                                onRemove={() => removeAccount(acc.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="h-[1px] bg-gray-50 mx-1"></div>

                {/* Bride Side */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.5)]"></span>
                            <span className="text-[13px] font-bold text-gray-800">신부측 계좌</span>
                        </div>
                        <BuilderButton
                            variant="ghost"
                            size="sm"
                            onClick={() => addAccount('bride')}
                            className="h-7 px-2 text-[11px] text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <Plus size={12} className="mr-1" /> 추가
                        </BuilderButton>
                    </div>
                    <div className="space-y-4">
                        {brideAccs.map((acc) => (
                            <AccountEntry
                                key={acc.id}
                                acc={acc}
                                groom={groom}
                                bride={bride}
                                onUpdate={(data) => updateAccount(acc.id, data)}
                                onRemove={() => removeAccount(acc.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AccordionItem>
    );
}

interface Account {
    id: string;
    type: 'groom' | 'bride';
    relation: '본인' | '아버지' | '어머니';
    bank: string;
    accountNumber: string;
    holder: string;
}

interface Person {
    firstName: string;
    lastName: string;
    parents: {
        father: { name: string };
        mother: { name: string };
    };
}

function AccountEntry({
    acc, groom, bride, onUpdate, onRemove
}: {
    acc: Account;
    groom: Person;
    bride: Person;
    onUpdate: (data: Partial<Account>) => void;
    onRemove: () => void
}) {
    const getName = (rel: '본인' | '아버지' | '어머니') => {
        if (acc.type === 'groom') {
            if (rel === '본인') return `${groom.lastName}${groom.firstName}`;
            if (rel === '아버지') return groom.parents.father.name;
            if (rel === '어머니') return groom.parents.mother.name;
        } else {
            if (rel === '본인') return `${bride.lastName}${bride.firstName}`;
            if (rel === '아버지') return bride.parents.father.name;
            if (rel === '어머니') return bride.parents.mother.name;
        }
        return '';
    };

    return (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                        <BuilderButtonGroup
                            size="sm"
                            value={acc.relation}
                            options={(['본인', '아버지', '어머니'] as const).map((rel) => ({
                                label: rel === '본인' ? (acc.type === 'groom' ? '신랑' : '신부') : rel,
                                value: rel
                            }))}
                            onChange={(val) => {
                                const rel = val as '본인' | '아버지' | '어머니';
                                onUpdate({ relation: rel, holder: getName(rel) || acc.holder });
                            }}
                        />
                    </div>
                    <button
                        onClick={onRemove}
                        className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all shrink-0"
                        title="삭제"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <BuilderField label="은행명">
                        <BuilderInput
                            placeholder="은행 입력"
                            value={acc.bank}
                            onChange={(e) => onUpdate({ bank: e.target.value })}
                            className="bg-white"
                        />
                    </BuilderField>
                    <BuilderField label="예금주">
                        <BuilderInput
                            placeholder="이름 입력"
                            value={acc.holder}
                            onChange={(e) => onUpdate({ holder: e.target.value })}
                            className="bg-white"
                        />
                    </BuilderField>
                </div>
                <BuilderField label="계좌번호">
                    <BuilderInput
                        placeholder="하이픈(-) 포함하여 입력"
                        value={acc.accountNumber}
                        onChange={(e) => onUpdate({ accountNumber: e.target.value })}
                        className="bg-white"
                    />
                </BuilderField>
            </div>
        </div>
    );
}
