import React from 'react';
import Image from 'next/image';

export const AmpersandSVG = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: '1.5em', height: '1em', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export const HeartSVG = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
        <path d="M12 8C14.21 5.5 17.5 5.5 19.5 7.5C21.5 9.5 21.5 12.8 19.5 14.8L12 21L4.5 14.8C2.5 12.8 2.5 9.5 4.5 7.5C6.5 5.5 9.79 5.5 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const RingIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <Image
        src="/images/wedding-ring.png"
        alt="ring"
        width={48}
        height={48}
        className={className}
        style={{ width: 'auto', height: '1.5em', ...style }}
    />
);
