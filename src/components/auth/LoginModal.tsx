"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './LoginModal.module.scss';
import { TextField } from '../builder/TextField';
import { createPortal } from 'react-dom';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TEST_ACCOUNTS: Record<string, string> = {
    'admin': 'admin@test.com',
    'amin': 'admin@test.com',
    'test_1': 'test_1@test.com',
};

// SSR-safe check for client-side mounting
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // useSyncExternalStore for SSR-safe mounting check (no lint warnings)
    const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleOAuthLogin = useCallback(async (provider: 'kakao' | 'naver') => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provider: provider as any,
            options: { redirectTo: `${window.location.origin}/builder` }
        });
        if (error) {
            alert(error.message);
            setLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const loginEmail = TEST_ACCOUNTS[email] || email;
        const isTestAccount = email in TEST_ACCOUNTS;

        const { error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password
        });

        if (error) {
            if (error.status === 400 && isTestAccount) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email: loginEmail,
                    password
                });
                alert(signUpError?.message || '테스트 계정이 생성되었습니다. 다시 로그인해주세요.');
            } else {
                alert('로그인 정보가 올바르지 않습니다.');
            }
        } else {
            onClose();
        }
        setLoading(false);
    }, [email, password, onClose]);

    if (!isOpen || !isMounted) return null;

    return createPortal(
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton} aria-label="닫기">
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <h2 id="login-title" className={styles.title}>시작하기</h2>
                    <p className={styles.subtitle}>
                        나만의 특별한 모바일 청첩장을<br />쉽고 빠르게 만들어보세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
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
                    <button type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? '처리 중...' : '로그인'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>또는 SNS 계정으로 시작</span>
                </div>

                <div className={styles.socialButtons}>
                    <button
                        className={`${styles.socialButton} ${styles.kakao}`}
                        onClick={() => handleOAuthLogin('kakao')}
                        disabled={loading}
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" className={styles.icon}>
                            <path fill="currentColor" d="M12 3C6.477 3 2 6.916 2 11.75c0 3.06 1.77 5.794 4.545 7.425-.194.72-1.246 4.384-1.277 4.55-.045.244.09.239.376.157.172-.05 3.903-2.583 4.512-3.048.601.087 1.222.132 1.844.132 5.523 0 10-3.916 10-8.75S17.523 3 12 3z" />
                        </svg>
                        <span>카카오로 3초 만에 시작하기</span>
                    </button>

                    <button
                        className={`${styles.socialButton} ${styles.naver}`}
                        onClick={() => handleOAuthLogin('naver')}
                        disabled={loading}
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
                            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                        </svg>
                        <span>네이버로 시작하기</span>
                    </button>
                </div>

                <div className={styles.footer}>
                    <p>
                        계속 진행함으로써 귀하는 당사의
                        <Link href="/privacy" target="_blank" className={styles.link}>개인정보 처리방침</Link>
                        및<br />이용약관에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
