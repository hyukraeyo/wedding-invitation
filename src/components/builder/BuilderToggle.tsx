import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useInvitationStore } from '@/store/useInvitationStore';

interface BuilderToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    className?: string;
}

// Helper to add opacity to hex colors
const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const BuilderToggle = ({
    checked,
    onChange,
    label,
    className = ""
}: BuilderToggleProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={twMerge(
                "flex items-center justify-center px-5 py-2.5 rounded-xl text-[13px] font-bold tracking-tight transition-all border",
                !checked && 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50/50',
                className
            )}
            style={checked ? {
                backgroundColor: hexToRgba(accentColor, 0.1),
                borderColor: hexToRgba(accentColor, 0.2),
                color: accentColor
            } : {}}
        >
            {label}
        </button>
    );
};
