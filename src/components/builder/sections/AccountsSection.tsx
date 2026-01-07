import React from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderInput } from '../BuilderInput';

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
            isCompleted={accounts.every(a => a.bank && a.accountNumber)}
        >
            <div className="space-y-8">
                {/* Groom Side */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-sm font-bold text-gray-800">신랑측 계좌</span>
                        </div>
                        <button
                            onClick={() => addAccount('groom')}
                            className="text-[11px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                        >
                            <Plus size={12} /> 추가
                        </button>
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

                <div className="h-[1px] bg-gray-100 mx-1"></div>

                {/* Bride Side */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                            <span className="text-sm font-bold text-gray-800">신부측 계좌</span>
                        </div>
                        <button
                            onClick={() => addAccount('bride')}
                            className="text-[11px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                        >
                            <Plus size={12} /> 추가
                        </button>
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
            <button
                onClick={onRemove}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={14} />
            </button>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                    {(['본인', '아버지', '어머니'] as const).map((rel) => {
                        const name = getName(rel);
                        return (
                            <button
                                key={rel}
                                onClick={() => onUpdate({ relation: rel, holder: name || acc.holder })}
                                className={`px-3 py-1 text-[11px] rounded-full border transition-all ${acc.relation === rel
                                    ? 'bg-forest-green border-forest-green text-white font-bold'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                            >
                                {rel === '본인' ? (acc.type === 'groom' ? '신랑' : '신부') : rel}
                                {name && <span className="ml-1 opacity-70">({name})</span>}
                            </button>
                        );
                    })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <BuilderLabel className="text-[10px] text-gray-400">은행명</BuilderLabel>
                        <BuilderInput
                            placeholder="은행 입력"
                            value={acc.bank}
                            onChange={(e) => onUpdate({ bank: e.target.value })}
                            className="bg-white"
                        />
                    </div>
                    <div>
                        <BuilderLabel className="text-[10px] text-gray-400">예금주</BuilderLabel>
                        <BuilderInput
                            placeholder="이름 입력"
                            value={acc.holder}
                            onChange={(e) => onUpdate({ holder: e.target.value })}
                            className="bg-white"
                        />
                    </div>
                </div>
                <div>
                    <BuilderLabel className="text-[10px] text-gray-400">계좌번호</BuilderLabel>
                    <BuilderInput
                        placeholder="하이픈(-) 포함하여 입력"
                        value={acc.accountNumber}
                        onChange={(e) => onUpdate({ accountNumber: e.target.value })}
                        className="bg-white"
                    />
                </div>
            </div>
        </div>
    );
}
