import React from 'react';
import { Banana } from 'lucide-react';

interface SavingOverlayProps {
    isVisible: boolean;
}

export default function SavingOverlay({ isVisible }: SavingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-3 bg-white/90 px-8 py-6 rounded-2xl shadow-xl border border-white/20">
                <Banana className="h-16 w-16 animate-spin text-primary" />
            </div>
        </div>
    );
}
