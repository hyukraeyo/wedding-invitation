import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
    onSave?: () => void;
}

export default function Header({ onSave }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
            {/* Logo */}
            <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold tracking-tight text-black">
                    their+mood
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/builder" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        초대장 만들기
                    </Link>
                    {user && (
                        <Link href="/mypage" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                            마이페이지
                        </Link>
                    )}
                </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                    돌아가기
                </Link>
                {onSave && (
                    <button
                        onClick={onSave}
                        className="px-6 py-2 rounded-full border border-black text-sm font-medium text-black hover:bg-black hover:text-white transition-all"
                    >
                        저장하기
                    </button>
                )}
            </div>
        </header>
    );
}
