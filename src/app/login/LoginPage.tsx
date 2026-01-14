"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from '@/components/auth/LoginModal.module.scss';
import { TextField } from '@/components/builder/TextField';
import { PhoneField } from '@/components/builder/PhoneField';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isValidPhone } from '@/lib/utils';
import { Loader2, Phone, User as UserIcon } from 'lucide-react';
import { profileService } from '@/services/profileService';
import { Button } from '@/components/ui/Button';

/**
 * LoginPage: 직접 /login 경로로 접근 시 렌더링되는 전체 페이지 버전
 * 모달과 동일한 UI를 사용하되, 페이지 형태로 중앙에 표시
 */
export default function LoginPage() {
    const router = useRouter();
    const { user, profile, isProfileComplete, loading: authLoading, refreshProfile, signOut } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (!authLoading && user && isProfileComplete) {
            router.replace('/builder');
        }
    }, [user, authLoading, isProfileComplete, router]);

    // 프로필 정보 초기화 (로그인 상태일 때)
    useEffect(() => {
        if (user && profile) {
            setName(profile.full_name || '');
            setPhone(profile.phone || '');
        }
    }, [user, profile]);

    if (!authLoading && user && isProfileComplete) return null;

    /* 
    const handleKakaoLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/builder`
            }
        });
        if (error) {
            toast({ variant: 'destructive', description: error.message });
            setLoading(false);
        }
    };
    */

    const handleNaverLogin = () => {
        setLoading(true);
        // 네이버: 커스텀 OAuth API 사용 (Supabase 미지원)
        window.location.href = '/api/auth/naver';
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

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
            if (error.status === 400 && isTestAccount) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email: loginEmail,
                    password: password
                });
                if (signUpError) toast({ variant: 'destructive', description: signUpError.message });
                else toast({ description: '테스트 계정이 생성되었습니다. 다시 로그인해주세요.' });
            } else {
                toast({ variant: 'destructive', description: '로그인 정보가 올바르지 않습니다.' });
            }
        } else {
            router.push('/builder');
        }
        setLoading(false);
    };



    const handleProfileComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!name.trim()) {
            toast({ variant: 'destructive', description: '이름을 입력해주세요.' });
            return;
        }

        const sanitizedPhone = phone.replace(/[^0-9+]/g, '');
        if (!isValidPhone(sanitizedPhone)) {
            toast({ variant: 'destructive', description: '전화번호 형식이 올바르지 않습니다.' });
            return;
        }

        setLoading(true);
        try {
            await profileService.updateProfile(user.id, {
                full_name: name.trim(),
                phone: sanitizedPhone,
            });

            toast({ description: '프로필이 저장되었습니다.' });
            await refreshProfile();
            router.replace('/builder');
        } catch {
            toast({
                variant: 'destructive',
                description: '프로필 저장 중 오류가 발생했습니다.',
            });
        } finally {
            setLoading(false);
        }
    };

    // 로그인 상태이지만 프로필이 미완성인 경우 프로필 완성 폼 표시
    if (user && !isProfileComplete) {
        return (
            <div className={styles.overlay} style={{ alignItems: 'center', paddingTop: 0 }}>
                <div className={styles.modal} style={{ maxWidth: '440px' }}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>프로필 완성</h1>
                        <p className={styles.subtitle}>
                            청첩장 서비스 이용을 위해 이름과 연락처를 입력해주세요.
                        </p>
                    </div>

                    <form onSubmit={handleProfileComplete} className={styles.form}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div style={{ position: 'absolute', left: '1rem', color: '#6b7280' }}>
                                    <UserIcon size={18} />
                                </div>
                                <TextField
                                    placeholder="이름"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ paddingLeft: '2.75rem' }}
                                    required
                                />
                            </div>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div style={{ position: 'absolute', left: '1rem', color: '#6b7280', zIndex: 1 }}>
                                    <Phone size={18} />
                                </div>
                                <PhoneField
                                    placeholder="전화번호 (예: 010-1234-5678)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{ paddingLeft: '2.75rem' }}
                                    required
                                />
                            </div>
                        </div>

                        <p style={{
                            fontSize: '0.8125rem',
                            color: '#9ca3af',
                            textAlign: 'center',
                            lineHeight: '1.5',
                            marginBottom: '2rem'
                        }}>
                            입력하신 정보는 청첩장 승인 신청 시 사용되며,<br />
                            광고성 목적으로 사용되지 않습니다.
                        </p>

                        <Button
                            type="submit"
                            disabled={loading || !name.trim() || !phone.trim()}
                            className={styles.submitButton}
                            style={{ height: '3.5rem' }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    저장 중...
                                </>
                            ) : (
                                '시작하기'
                            )}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button
                            onClick={async () => {
                                await signOut();
                                router.push('/');
                            }}
                            style={{
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                textDecoration: 'underline',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} style={{ alignItems: 'center', paddingTop: 0 }}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        바나나웨딩 시작하기 🍌
                    </h1>
                    <p className={styles.subtitle}>
                        유통기한 없는 우리만의 특별한 시작,<br />바나나웨딩과 함께 쉽고 빠르게 만들어보세요.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleAdminLogin} className={styles.form}>
                    <TextField
                        type="text"
                        placeholder="아이디"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        autoComplete="username"
                        required
                    />
                    <TextField
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? '처리 중...' : '로그인'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>또는 SNS 계정으로 시작</span>
                </div>

                <div className={styles.socialButtons}>
                    {/* 카카오 로그인 잠시 숨김
                    <button
                        className={`${styles.socialButton} ${styles.kakao}`}
                        onClick={handleKakaoLogin}
                        disabled={loading}
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" className={styles.icon}>
                            <path
                                fill="currentColor"
                                d="M12 3C6.477 3 2 6.916 2 11.75c0 3.06 1.77 5.794 4.545 7.425-.194.72-1.246 4.384-1.277 4.55-.045.244.09.239.376.157.172-.05 3.903-2.583 4.512-3.048.601.087 1.222.132 1.844.132 5.523 0 10-3.916 10-8.75S17.523 3 12 3z"
                            />
                        </svg>
                        <span>카카오로 3초 만에 시작하기</span>
                    </button>
                    */}

                    <button
                        className={`${styles.socialButton} ${styles.naver}`}
                        onClick={handleNaverLogin}
                        disabled={loading}
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
                            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                        </svg>
                        <span>네이버로 시작하기</span>
                    </button>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>
                        계속 진행함으로써 귀하는 당사의
                        <Link href="/privacy" target="_blank" className={styles.link}>
                            개인정보 처리방침
                        </Link>
                        및<br />이용약관에 동의하게 됩니다.
                    </p>
                </div>

                {/* Back to Home */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            textDecoration: 'underline',
                            textUnderlineOffset: '2px'
                        }}
                    >
                        ← 홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
