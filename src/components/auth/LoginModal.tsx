"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { BuilderInput } from '../builder/BuilderInput';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleKakaoLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/builder`
            }
        });
        if (error) alert(error.message);
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Handle test accounts (translated to @test.com for Supabase Auth)
        let loginEmail = email;
        const isTestAccount = email === 'amin' || email === 'admin' || email === 'test_1';

        if (email === 'amin' || email === 'admin') {
            loginEmail = 'admin@test.com';
        } else if (email === 'test_1') {
            loginEmail = 'test_1@test.com';
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: password
        });

        if (error) {
            // If user doesn't exist, try to sign them up (auto-create for test account)
            if (error.status === 400 && isTestAccount) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email: loginEmail,
                    password: password
                });
                if (signUpError) alert(signUpError.message);
                else alert('테스트 계정이 생성되었습니다. 다시 로그인해주세요.');
            } else {
                alert('로그인 정보가 올바르지 않습니다.');
            }
        } else {
            onClose();
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-10 relative scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-[28px] font-bold text-gray-900 mb-2">
                        시작하기
                    </h2>
                    <p className="text-gray-500 text-[15px] font-medium leading-relaxed">
                        나만의 특별한 모바일 청첩장을<br />만들어보세요.
                    </p>
                </div>

                {/* Master Login Form */}
                <form onSubmit={handleAdminLogin} className="space-y-3 mb-8">
                    <BuilderInput
                        type="text"
                        placeholder="아이디"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 text-base border-gray-300 focus:border-black transition-all bg-white"
                    />
                    <BuilderInput
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 text-base border-gray-300 focus:border-black transition-all bg-white"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center text-base shadow-lg shadow-black/10 active:scale-[0.98] mt-2 disabled:bg-gray-200"
                    >
                        {loading ? '처리 중...' : '로그인'}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium tracking-wider">또는 SNS 계정으로 시작</span></div>
                </div>

                {/* Kakao Login Button */}
                <button
                    className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleKakaoLogin}
                    disabled={loading}
                >
                    {/* Official Kakao Symbol SVG */}
                    <svg viewBox="0 0 24 24" width="20" height="20" className="text-[#191919]">
                        <path
                            fill="currentColor"
                            d="M12 3C6.477 3 2 6.916 2 11.75c0 3.06 1.77 5.794 4.545 7.425-.194.72-1.246 4.384-1.277 4.55-.045.244.09.239.376.157.172-.05 3.903-2.583 4.512-3.048.601.087 1.222.132 1.844.132 5.523 0 10-3.916 10-8.75S17.523 3 12 3z"
                        />
                    </svg>
                    {loading ? '처리 중...' : '카카오로 3초 만에 시작하기'}
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
