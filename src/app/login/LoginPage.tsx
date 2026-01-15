"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import styles from '@/components/auth/LoginModal.module.scss';
import { TextField } from '@/components/builder/TextField';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ProfileCompletionModal from '@/components/auth/ProfileCompletionModal';

/**
 * LoginPage: 직접 /login 경로로 접근 시 렌더링되는 전체 페이지 버전
 * 모달과 동일한 UI를 사용하되, 페이지 형태로 중앙에 표시
 */
export default function LoginPage() {
    const router = useRouter();
    const { user, profile, isProfileComplete, loading: authLoading, profileLoading, refreshProfile, signOut } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && user && isProfileComplete) {
            router.replace('/builder');
        }
    }, [user, authLoading, isProfileComplete, router]);

    // 로딩 중일 때는 빈 화면 대신 로딩 표시
    if (authLoading) {
        return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-yellow-400 rounded-full animate-spin border-t-transparent"></div></div>;
    }

    // 이미 로그인하고 프로필도 완성했다면 리디렉션되므로 렌더링 안 함
    if (user && isProfileComplete) return null;

    const handleKakaoLogin = async () => {
        setLoading(true);
        const result = await signIn("kakao", { callbackUrl: "/builder", redirect: false });
        if (result?.error) {
            toast({ variant: 'destructive', description: result.error });
            setLoading(false);
            return;
        }
        if (result?.url) {
            window.location.href = result.url;
        }
    };

    const handleNaverLogin = async () => {
        setLoading(true);
        const result = await signIn("naver", { callbackUrl: "/builder", redirect: false });
        if (result?.error) {
            toast({ variant: 'destructive', description: result.error });
            setLoading(false);
            return;
        }
        if (result?.url) {
            window.location.href = result.url;
        }
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

        const result = await signIn("credentials", {
            email: loginEmail,
            password,
            redirect: false,
            callbackUrl: "/builder",
        });

        if (result?.error) {
            if (isTestAccount) {
                toast({ variant: 'destructive', description: '관리자 계정 인증에 실패했습니다.' });
            } else {
                toast({ variant: 'destructive', description: '로그인 정보가 올바르지 않습니다.' });
            }
        } else {
            router.push('/builder');
        }
        setLoading(false);
    };

    // 로그인 상태이지만 프로필이 미완성인 경우 프로필 완성 모달 표시
    // profileLoading이 아닐 때만 표시 (로딩 중일 때는 깜빡임 방지)
    if (user?.id && !isProfileComplete && !profileLoading) {
        return (
            <div className={styles.overlay} style={{ alignItems: 'center', paddingTop: 0 }}>
                <ProfileCompletionModal
                    isOpen={true}
                    userId={user.id}
                    defaultName={profile?.full_name ?? user.name ?? ''}
                    onComplete={async () => {
                        await refreshProfile();
                        router.replace('/builder');
                    }}
                    onLogout={async () => {
                        await signOut();
                        router.push('/');
                    }}
                />
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
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full h-12 text-lg font-bold"
                    >
                        로그인
                    </Button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>또는 SNS 계정으로 시작</span>
                </div>

                <div className={styles.socialButtons}>
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

                    <Button
                        className={`${styles.socialButton} ${styles.naver}`}
                        onClick={handleNaverLogin}
                        loading={loading}
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
                            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                        </svg>
                        <span>네이버로 시작하기</span>
                    </Button>
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
