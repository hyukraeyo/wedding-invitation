import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SubAccordionProps {
    label: string;
    isOpen: boolean;
    onClick: () => void;
    showBadge?: boolean;
    badgeText?: string;
}

export const SubAccordion: React.FC<SubAccordionProps> = ({
    label,
    isOpen,
    onClick,
    showBadge = false,
    badgeText = "PREMIUM"
}) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-white border border-gray-100 rounded-xl transition-all group"
        >
            <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-gray-600 pl-1">{label}</span>
                {showBadge && (
                    <span className="px-1.5 py-0.5 bg-white border border-gray-100 rounded text-[8px] text-gray-400 font-black tracking-tighter uppercase">
                        {badgeText}
                    </span>
                )}
            </div>

            <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
    );
};
