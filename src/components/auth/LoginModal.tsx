"use client";

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-8 relative scale-100 animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold text-forest-green mb-2">
                        시작하기
                    </h2>
                    <p className="text-gray-500 text-sm">
                        나만의 특별한 모바일 청첩장을 만들어보세요.
                    </p>
                </div>

                {/* Verification Notice Box (CRITICAL FOR REVIEW) */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                        <span className="font-bold">⚠️ 본인 확인 안내</span><br />
                        중복 가입 방지 및 실제 사용자 확인을 위해 <span className="underline decoration-amber-500 underline-offset-2">전화번호</span>가 필요합니다.
                        수집된 정보는 본인 인증 용도로만 사용됩니다.
                    </p>
                </div>

                {/* Hack: Fake Kakao Login Button */}
                <button
                    className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] h-12 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 mb-4"
                    onClick={() => alert('심사 통과 후 실제 로그인이 연동됩니다.')}
                >
                    {/* Official Kakao Symbol SVG */}
                    <svg viewBox="0 0 24 24" width="20" height="20" className="text-[#191919]">
                        <path
                            fill="currentColor"
                            d="M12 3C6.477 3 2 6.916 2 11.75c0 3.06 1.77 5.794 4.545 7.425-.194.72-1.246 4.384-1.277 4.55-.045.244.09.239.376.157.172-.05 3.903-2.583 4.512-3.048.601.087 1.222.132 1.844.132 5.523 0 10-3.916 10-8.75S17.523 3 12 3z"
                        />
                    </svg>
                    카카오로 3초 만에 시작하기
                </button>

                {/* Privacy Link */}
                <div className="text-center">
                    <p className="text-[11px] text-gray-400">
                        계속 진행함으로써 귀하는 당사의
                        <Link href="/privacy" target="_blank" className="text-gray-600 underline underline-offset-2 mx-1 hover:text-forest-green">
                            개인정보 처리방침
                        </Link>
                        및 이용약관에 동의하게 됩니다.
                    </p>
                </div>

            </div>
        </div>
    );
}
