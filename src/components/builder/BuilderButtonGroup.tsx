import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Option<T> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}

interface BuilderButtonGroupProps<T> {
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
    className?: string;
    size?: 'sm' | 'md';
}

// Helper to add opacity to hex colors
const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const BuilderButtonGroup = <T extends string | number>({
    value,
    options,
    onChange,
    className = "",
    size = 'md'
}: BuilderButtonGroupProps<T>) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <div className={twMerge("flex flex-wrap gap-2", className)}>
            {options.map((option) => {
                const isActive = value === option.value;

                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={twMerge(
                            "flex-1 flex items-center justify-center gap-2 font-bold rounded-xl border transition-all duration-200",
                            size === 'sm' ? "py-1.5 px-3 text-[11px]" : "py-2.5 px-4 text-[13px]",
                            !isActive && "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50 active:scale-95"
                        )}
                        style={isActive ? {
                            backgroundColor: hexToRgba(accentColor, 0.1),
                            borderColor: hexToRgba(accentColor, 0.3),
                            color: '#111827'
                        } : {}}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
