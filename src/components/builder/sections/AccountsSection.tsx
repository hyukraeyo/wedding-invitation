import React from 'react';
import { CreditCard, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function AccountsSection({ isOpen, onToggle }: SectionProps) {
    const {
        accounts, setAccounts,
        groom, bride
    } = useInvitationStore();

    const syncNames = () => {
        const newAcc = accounts.map(acc => {
            let holder = acc.holder;
            if (acc.type === 'groom') {
                if (acc.relation === '본인') holder = `${groom.lastName}${groom.firstName}`;
                else if (acc.relation === '아버지') holder = groom.parents.father.name;
                else if (acc.relation === '어머니') holder = groom.parents.mother.name;
            } else {
                if (acc.relation === '본인') holder = `${bride.lastName}${bride.firstName}`;
                else if (acc.relation === '아버지') holder = bride.parents.father.name;
                else if (acc.relation === '어머니') holder = bride.parents.mother.name;
            }
            return { ...acc, holder };
        });
        setAccounts(newAcc);
    };

    const addAccount = (type: 'groom' | 'bride') => {
        const id = `${type}-${Date.now()}`;
        setAccounts([...accounts, { id, type, relation: '본인', bank: '', accountNumber: '', holder: '' }]);
    };

    const removeAccount = (id: string) => {
        setAccounts(accounts.filter(a => a.id !== id));
    };

    const updateAccount = (id: string, data: Partial<typeof accounts[0]>) => {
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
                <div className="flex justify-end px-1">
                    <button
                        onClick={syncNames}
                        className="text-[11px] font-bold text-forest-green hover:bg-forest-green/5 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-forest-green/20"
                    >
                        <RefreshCw size={12} />
                        성함 동기화
                    </button>
                </div>

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
                            <AccountEntry key={acc.id} acc={acc} onUpdate={(data) => updateAccount(acc.id, data)} onRemove={() => removeAccount(acc.id)} />
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
                            <AccountEntry key={acc.id} acc={acc} onUpdate={(data) => updateAccount(acc.id, data)} onRemove={() => removeAccount(acc.id)} />
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

function AccountEntry({ acc, onUpdate, onRemove }: { acc: Account; onUpdate: (data: Partial<Account>) => void; onRemove: () => void }) {
    return (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
            <button
                onClick={onRemove}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={14} />
            </button>
            <div className="space-y-4">
                <div className="flex gap-2 mb-2">
                    {(['본인', '아버지', '어머니'] as const).map((rel) => (
                        <button
                            key={rel}
                            onClick={() => onUpdate({ relation: rel })}
                            className={`px-3 py-1 text-[11px] rounded-full border transition-all ${acc.relation === rel
                                ? 'bg-forest-green border-forest-green text-white font-bold'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                        >
                            {rel === '본인' ? (acc.type === 'groom' ? '신랑' : '신부') : rel}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <BuilderLabel className="!mb-0 text-[10px] text-gray-400">은행명</BuilderLabel>
                        <input
                            placeholder="은행 입력"
                            value={acc.bank}
                            onChange={(e) => onUpdate({ bank: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-forest-green outline-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <BuilderLabel className="!mb-0 text-[10px] text-gray-400">예금주</BuilderLabel>
                        <input
                            placeholder="이름 입력"
                            value={acc.holder}
                            onChange={(e) => onUpdate({ holder: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-forest-green outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <BuilderLabel className="!mb-0 text-[10px] text-gray-400">계좌번호</BuilderLabel>
                    <input
                        placeholder="하이픈(-) 포함하여 입력"
                        value={acc.accountNumber}
                        onChange={(e) => onUpdate({ accountNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-forest-green outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
