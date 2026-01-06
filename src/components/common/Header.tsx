import React from 'react';
import Link from 'next/link';

interface HeaderProps {
    onSave?: () => void;
}

export default function Header({ onSave }: HeaderProps) {
    return (
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/" className="text-xl font-bold tracking-tight text-black">
                    their+mood
                </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                    돌아가기
                </Link>
                <button
                    onClick={onSave}
                    className="px-6 py-2 rounded-full border border-black text-sm font-medium text-black hover:bg-black hover:text-white transition-all"
                >
                    저장하기
                </button>
            </div>
        </header>
    );
}
