import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';

interface HeaderProps {
    onSave?: () => void;
    onLogin?: () => void;
    isLoading?: boolean;
}

import { Button } from '@/components/builder/Button';

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
                    <Button
                        variant="weak"
                        size="small"
                        onClick={() => {
                            reset();
                            router.push('/builder');
                        }}
                    >
                        <Plus size={14} />
                        <span>새 청첩장 만들기</span>
                    </Button>

                    {user ? (
                        <Link href="/mypage">
                            <Button variant="weak" color="dark" size="small">
                                마이페이지
                            </Button>
                        </Link>
                    ) : (
                        onLogin && (
                            <Button
                                variant="weak"
                                color="dark"
                                size="small"
                                onClick={onLogin}
                            >
                                로그인
                            </Button>
                        )
                    )}
                </nav>

                <div className={styles.userActions}>
                    {user && (
                        <Button
                            variant="weak"
                            color="dark"
                            size="small"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Button>
                    )}
                    {onSave && (
                        <Button
                            color="primary"
                            size="small"
                            onClick={onSave}
                            loading={!!isLoading}
                        >
                            저장하기
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
