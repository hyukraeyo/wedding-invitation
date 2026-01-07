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
        <div className="py-24 px-8">
            <div className="text-center space-y-4 mb-10">
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] tracking-[0.4em] text-forest-green/40 font-medium uppercase">Gift for Groom & Bride</span>
                    <div className="w-8 h-[1px] bg-forest-green opacity-10"></div>
                </div>
            </div>
            <div className="space-y-4 max-w-[320px] mx-auto">
                {/* Groom Side */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm">
                    <button
                        onClick={() => setOpenSide(openSide === 'groom' ? null : 'groom')}
                        className={`w-full flex items-center justify-between p-5 text-[14px] font-medium transition-colors ${openSide === 'groom' ? 'text-gray-900 bg-gray-50/50' : 'text-gray-600 hover:bg-gray-50/30'}`}
                    >
                        <span>신랑측 마음 전하실 곳</span>
                        <ChevronDown size={14} className={`transition-transform duration-500 opacity-40 ${openSide === 'groom' ? 'rotate-180' : ''}`} />
                    </button>
                    {openSide === 'groom' && (
                        <div className="px-5 pb-5 pt-1 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                            {groomAccounts.map((acc, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-3 border-b border-gray-50 last:border-0">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-gray-400 text-[10px] font-sans tracking-wide">{acc.bank} | 예금주 {acc.holder}</span>
                                        <span className="text-gray-700 font-medium tracking-tight text-[13px]">{acc.accountNumber}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(acc.accountNumber)}
                                        className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all font-medium uppercase tracking-tighter shadow-xs"
                                    >
                                        Copy
                                    </button>
                                </div>
                            ))}
                            {groomAccounts.length === 0 && <p className="text-[11px] text-gray-400 text-center py-4 italic">등록된 계좌가 없습니다.</p>}
                        </div>
                    )}
                </div>

                {/* Bride Side */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm">
                    <button
                        onClick={() => setOpenSide(openSide === 'bride' ? null : 'bride')}
                        className={`w-full flex items-center justify-between p-5 text-[14px] font-medium transition-colors ${openSide === 'bride' ? 'text-gray-900 bg-gray-50/50' : 'text-gray-600 hover:bg-gray-50/30'}`}
                    >
                        <span>신부측 마음 전하실 곳</span>
                        <ChevronDown size={14} className={`transition-transform duration-500 opacity-40 ${openSide === 'bride' ? 'rotate-180' : ''}`} />
                    </button>
                    {openSide === 'bride' && (
                        <div className="px-5 pb-5 pt-1 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                            {brideAccounts.map((acc, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-3 border-b border-gray-50 last:border-0">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-gray-400 text-[10px] font-sans tracking-wide">{acc.bank} | 예금주 {acc.holder}</span>
                                        <span className="text-gray-700 font-medium tracking-tight text-[13px]">{acc.accountNumber}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(acc.accountNumber)}
                                        className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all font-medium uppercase tracking-tighter shadow-xs"
                                    >
                                        Copy
                                    </button>
                                </div>
                            ))}
                            {brideAccounts.length === 0 && <p className="text-[11px] text-gray-400 text-center py-4 italic">등록된 계좌가 없습니다.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
