import React from 'react';
import Image from 'next/image';

// --- Brand & Decorative Icons ---

export const AmpersandSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 36 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      width: '1.5em',
      height: '1em',
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    }}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="24" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const HeartSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      width: '1em',
      height: '1em',
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    }}
  >
    <path
      d="M12 8C14.21 5.5 17.5 5.5 19.5 7.5C21.5 9.5 21.5 12.8 19.5 14.8L12 21L4.5 14.8C2.5 12.8 2.5 9.5 4.5 7.5C6.5 5.5 9.79 5.5 12 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RingIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <Image
    src="/images/wedding-ring.png"
    alt="ring"
    width={48}
    height={48}
    className={className}
    style={{ width: 'auto', height: '1.5em', ...style }}
  />
);

// --- Map & Navigation Icons ---

interface IconProps {
  size?: number;
  className?: string;
}

interface KakaoIconProps extends IconProps {
  showBackground?: boolean;
}

export const NaverIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient
        id="naver_map_grad_comp"
        x1="256"
        y1="20"
        x2="256"
        y2="492"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#2db400">
          <animate
            attributeName="stop-color"
            values="#1585F6; #00C73C"
            dur="1s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="0" stopColor="#1585F6" />
        <stop offset="1" stopColor="#00C73C" />
      </linearGradient>
      <radialGradient
        id="highlight_glow_comp"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(256 120) rotate(90) scale(100 180)"
      >
        <stop stopColor="white" stopOpacity="0.3" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path
      d="M256 20C145.5 20 56 109.5 56 220C56 345 256 492 256 492C256 492 456 345 456 220C456 109.5 366.5 20 256 20Z"
      fill="url(#naver_map_grad_comp)"
    />
    <path d="M175 310V130H223L289 233.5V130H337V310H289L223 206.5V310H175Z" fill="white" />
  </svg>
);

export const KakaoIcon = ({ size = 24, showBackground = true, className }: KakaoIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {showBackground ? <rect width="1024" height="1024" rx="160" fill="#FAE100" /> : null}
    <path
      d="M512 880c0 0-300-300-300-470a300 300 0 1 1 600 0c0 170-300 470-300 470z M512 310a100 100 0 1 0 0 200 100 100 0 1 0 0 -200z"
      fill="#1585F6"
    />
  </svg>
);

export const ChrysanthemumSVG = ({
  size = 24,
  className,
  style,
}: IconProps & { style?: React.CSSProperties }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <g fill="currentColor">
      <circle cx="32" cy="32" r="6" />
      <ellipse cx="32" cy="14" rx="4" ry="12" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(22.5 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(45 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(67.5 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(90 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(112.5 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(135 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(157.5 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(180 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(202.5 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(225 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(247.5 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(270 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(292.5 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(315 32 32)" />
      <ellipse cx="32" cy="14" rx="4" ry="12" transform="rotate(337.5 32 32)" />
    </g>
  </svg>
);
