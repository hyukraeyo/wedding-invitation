import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

interface KakaoIconProps extends IconProps {
    showBackground?: boolean;
}

export const NaverIcon = ({ size = 24, className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="naver_map_grad_comp" x1="256" y1="20" x2="256" y2="492" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#2db400">
                    <animate attributeName="stop-color" values="#1585F6; #00C73C" dur="1s" repeatCount="indefinite" />
                </stop>
                <stop offset="0" stopColor="#1585F6" />
                <stop offset="1" stopColor="#00C73C" />
            </linearGradient>

            <radialGradient id="highlight_glow_comp" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(256 120) rotate(90) scale(100 180)">
                <stop stopColor="white" stopOpacity="0.3" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
        </defs>
        <path d="M256 20C145.5 20 56 109.5 56 220C56 345 256 492 256 492C256 492 456 345 456 220C456 109.5 366.5 20 256 20Z" fill="url(#naver_map_grad_comp)" />
        <ellipse cx="256" cy="140" rx="140" ry="80" fill="url(#highlight_glow_comp)" />
        <path d="M175 310V130H223L289 233.5V130H337V310H289L223 206.5V310H175Z" fill="white" />
    </svg>
);

export const KakaoIcon = ({ size = 24, showBackground = true, className }: KakaoIconProps) => (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {showBackground && <rect width="1024" height="1024" rx="160" fill="#FAE100" />}
        <path
            d="M512 880c0 0-300-300-300-470a300 300 0 1 1 600 0c0 170-300 470-300 470z M512 310a100 100 0 1 0 0 200 100 100 0 1 0 0 -200z"
            fill="#1585F6"
        />
    </svg>
);


