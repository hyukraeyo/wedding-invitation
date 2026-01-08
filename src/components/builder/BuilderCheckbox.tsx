import React, { useId } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface BuilderCheckboxProps {
    id?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: React.ReactNode;
    className?: string;
}

// Helper to add opacity to hex colors
const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export function BuilderCheckbox({ id, checked, onChange, children, className = '' }: BuilderCheckboxProps) {
    const internalId = useId();
    const generatedId = id || internalId;
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <label
            htmlFor={generatedId}
            className={`flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
        >
            <div className="relative flex items-center justify-center">
                <input
                    id={generatedId}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only"
                />
                <div
                    className={`
                        w-[18px] h-[18px] rounded-[5px] border-2 transition-all duration-300 flex items-center justify-center
                        ${!checked ? 'bg-white border-gray-200 group-hover:border-gray-300' : ''}
                    `}
                    style={checked ? {
                        backgroundColor: accentColor,
                        borderColor: accentColor,
                        boxShadow: `0 2px 8px ${hexToRgba(accentColor, 0.25)}`
                    } : {}}
                >
                    {checked && (
                        <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="animate-in zoom-in-50 duration-200"
                        >
                            <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
            </div>
            {children && (
                <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                    {children}
                </span>
            )}
        </label>
    );
}
