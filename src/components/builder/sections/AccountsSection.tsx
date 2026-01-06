import React from 'react';
import { CreditCard } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function AccountsSection({ isOpen, onToggle }: SectionProps) {
    const { accounts, setAccounts } = useInvitationStore();

    return (
        <AccordionItem
            title="마음 전하실 곳"
            icon={CreditCard}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={accounts.every(a => a.bank && a.accountNumber)}
        >
            <div className="space-y-6">
                {accounts.map((acc, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                        <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                            {acc.type === 'groom' ? <span className="text-blue-500">신랑측</span> : <span className="text-pink-500">신부측</span>} 계좌
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                placeholder="은행명"
                                value={acc.bank}
                                onChange={(e) => {
                                    const newAcc = [...accounts];
                                    newAcc[i].bank = e.target.value;
                                    setAccounts(newAcc);
                                }}
                                className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none"
                            />
                            <input
                                placeholder="예금주"
                                value={acc.holder}
                                onChange={(e) => {
                                    const newAcc = [...accounts];
                                    newAcc[i].holder = e.target.value;
                                    setAccounts(newAcc);
                                }}
                                className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none"
                            />
                        </div>
                        <input
                            placeholder="계좌번호 (- 포함)"
                            value={acc.accountNumber}
                            onChange={(e) => {
                                const newAcc = [...accounts];
                                newAcc[i].accountNumber = e.target.value;
                                setAccounts(newAcc);
                            }}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none"
                        />
                    </div>
                ))}
            </div>
        </AccordionItem>
    );
}
