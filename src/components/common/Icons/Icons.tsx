import React from 'react';
import Image from 'next/image';
import { PALETTE } from '@/constants/palette';

// --- Brand & Decorative Icons ---

export const AmpersandSVG = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
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
      d="M17 18.5c-1.5 1.5-3.5 1.5-5 0-2.5-2.5 1-4.5 2-5.5s1-3-1-3-3 2-3 4-1 2-2 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
    <path
      d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0 0 114.6 0 256s114.6 256 256 256z"
      fill={PALETTE.NAVER_GREEN}
    />
    <path d="M175 310V130H223L289 233.5V130H337V310H289L223 206.5V310H175Z" fill={PALETTE.WHITE} />
  </svg>
);

export const KakaoIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 3C6.47715 3 2 6.47715 2 10.75c0 2.822 1.944 5.289 4.8456 6.575L5.804 20.372c-.114.417.348.749.697.514l4.636-3.13c.284.029.573.044.863.044 5.5228 0 10-3.4772 10-7.75C22 6.47715 17.5228 3 12 3z"
      fill={PALETTE.KAKAO_YELLOW_BRAND}
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
