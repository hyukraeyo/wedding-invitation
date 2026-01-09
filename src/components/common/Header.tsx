import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
            {/* Logo */}
            <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold tracking-tight text-black">
                    WEDDING
                </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <nav className="flex items-center gap-6">
                    <Link
                        href="/builder"
                        onClick={() => reset()}
                        className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                    >
                        초대장 만들기
                    </Link>
                    {user ? (
                        <Link href="/mypage" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                            마이페이지
                        </Link>
                    ) : (
                        onLogin && (
                            <button
                                onClick={onLogin}
                                className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                            >
                                로그인
                            </button>
                        )
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                        >
                            로그아웃
                        </button>
                    )}
                    {onSave && (
                        <button
                            onClick={onSave}
                            disabled={isLoading}
                            className="px-6 py-2 rounded-full border border-black text-sm font-medium text-black hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading && (
                                <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            )}
                            저장하기
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
