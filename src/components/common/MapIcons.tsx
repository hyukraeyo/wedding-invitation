import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

interface KakaoIconProps extends IconProps {
    showBackground?: boolean;
}

export const NaverIcon = ({ size = 12, className }: IconProps) => (
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

export const KakaoIcon = ({ size = 12, showBackground = true, className }: KakaoIconProps) => (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {showBackground && <rect width="240" height="240" rx="20" fill="#FFD900" />}
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M120 30C81.3401 30 50 61.3401 50 100C50 138.66 81.3401 190 120 210C158.66 190 190 138.66 190 100C190 61.3401 158.66 30 120 30ZM120 130C103.431 130 90 116.569 90 100C90 83.4315 103.431 70 120 70C136.569 70 150 83.4315 150 100C150 116.569 136.569 130 120 130Z"
            fill="#0091FF"
        />
        <circle cx="120" cy="100" r="20" fill={showBackground ? "#FFD900" : "white"} />
    </svg>
);
