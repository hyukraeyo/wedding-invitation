import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import { clsx } from 'clsx';

interface HeaderProps {
    onSave?: () => void;
    onLogin?: () => void;
    isLoading?: boolean;
}

export default function Header({ onSave, onLogin, isLoading }: HeaderProps) {
    const router = useRouter();
    const { user } = useAuth();
    const reset = useInvitationStore(state => state.reset);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <header className={styles.header}>
            {/* Logo */}
            <div className={styles.logo}>
                <Link href="/" className={styles.link}>
                    WEDDING
                </Link>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <nav className={styles.nav}>
                    <button
                        onClick={() => {
                            reset();
                            router.push('/builder');
                        }}
                        className={styles.createButton}
                    >
                        <Plus size={16} />
                        <span>새 청첩장 만들기</span>
                    </button>
                    {user ? (
                        <Link href="/mypage" className={styles.linkButton}>
                            마이페이지
                        </Link>
                    ) : (
                        onLogin && (
                            <button
                                onClick={onLogin}
                                className={styles.linkButton}
                            >
                                로그인
                            </button>
                        )
                    )}
                </nav>

                <div className={styles.userActions}>
                    {user && (
                        <button
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            로그아웃
                        </button>
                    )}
                    {onSave && (
                        <button
                            onClick={onSave}
                            disabled={isLoading}
                            className={styles.saveButton}
                        >
                            {isLoading && (
                                <div className={styles.spinner} />
                            )}
                            저장하기
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
