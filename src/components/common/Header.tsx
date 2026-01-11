import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/builder/Button';

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
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2 font-serif font-bold text-xl tracking-tight">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    WEDDING
                </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <nav className="hidden md:flex items-center gap-4">
                    <Button
                        variant="weak"
                        size="sm"
                        onClick={() => {
                            reset();
                            router.push('/builder');
                        }}
                    >
                        <Plus size={14} className="mr-1" />
                        <span>새 청첩장 만들기</span>
                    </Button>

                    {user ? (
                        <Link href="/mypage">
                            <Button variant="ghost" size="sm">
                                마이페이지
                            </Button>
                        </Link>
                    ) : (
                        onLogin && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLogin}
                            >
                                로그인
                            </Button>
                        )
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    {user && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Button>
                    )}
                    {user && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden md:inline-flex"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Button>
                    )}

                    {onSave && (
                        <Button
                            variant="default" // primary
                            size="sm"
                            onClick={onSave}
                            // loading prop handled in Button wrapper
                            loading={isLoading}
                        >
                            저장하기
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
