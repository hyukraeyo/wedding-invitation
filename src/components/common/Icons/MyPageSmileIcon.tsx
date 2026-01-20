import React from 'react';
import { LucideProps } from 'lucide-react';

export const MyPageSmileIcon = ({ size, className, ...props }: LucideProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.5" fill="white" />
            <circle cx="12" cy="12" r="7" fill="#FF8A80" stroke="none" />

            {/* Eyes (Happy arcs) */}
            <path d="M9 11C9 11 9.5 10.5 10 11" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 11C14 11 14.5 10.5 15 11" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />

            {/* Mouth (Smile) */}
            <path d="M10 14.5C10 14.5 11 15.5 12 15.5C13 15.5 14 14.5 14 14.5" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};
