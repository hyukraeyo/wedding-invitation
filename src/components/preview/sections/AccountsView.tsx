import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function AccountsView() {
    const { accounts } = useInvitationStore();
    const [openSide, setOpenSide] = useState<'groom' | 'bride' | null>(null);

    const groomAccounts = accounts.filter(a => a.type === 'groom');
    const brideAccounts = accounts.filter(a => a.type === 'bride');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('계좌번호가 복사되었습니다.');
    };

    if (accounts.length === 0) return null;

    return (
        <div className="py-16 px-6 bg-white/50">
            <h3 className="text-center font-serif text-xl mb-8 text-gray-800 tracking-widest">GROOM & BRIDE</h3>
            <div className="space-y-3">
                {/* Groom Side */}
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white/80">
                    <button
                        onClick={() => setOpenSide(openSide === 'groom' ? null : 'groom')}
                        className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-[#F4F9FF]"
                    >
                        <span>신랑측 마음 전하실 곳</span>
                        <ChevronDown size={16} className={`transition-transform ${openSide === 'groom' ? 'rotate-180' : ''}`} />
                    </button>
                    {openSide === 'groom' && (
                        <div className="p-4 bg-white/50 space-y-3">
                            {groomAccounts.map((acc, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs">{acc.bank} (예금주: {acc.holder})</span>
                                        <span className="text-gray-800 font-medium">{acc.accountNumber}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(acc.accountNumber)}
                                        className="px-3 py-1.5 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200"
                                    >
                                        복사
                                    </button>
                                </div>
                            ))}
                            {groomAccounts.length === 0 && <p className="text-xs text-gray-400 text-center py-2">등록된 계좌가 없습니다.</p>}
                        </div>
                    )}
                </div>

                {/* Bride Side */}
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white/80">
                    <button
                        onClick={() => setOpenSide(openSide === 'bride' ? null : 'bride')}
                        className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-[#FFF4F4]"
                    >
                        <span>신부측 마음 전하실 곳</span>
                        <ChevronDown size={16} className={`transition-transform ${openSide === 'bride' ? 'rotate-180' : ''}`} />
                    </button>
                    {openSide === 'bride' && (
                        <div className="p-4 bg-white/50 space-y-3">
                            {brideAccounts.map((acc, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs">{acc.bank} (예금주: {acc.holder})</span>
                                        <span className="text-gray-800 font-medium">{acc.accountNumber}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(acc.accountNumber)}
                                        className="px-3 py-1.5 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200"
                                    >
                                        복사
                                    </button>
                                </div>
                            ))}
                            {brideAccounts.length === 0 && <p className="text-xs text-gray-400 text-center py-2">등록된 계좌가 없습니다.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
