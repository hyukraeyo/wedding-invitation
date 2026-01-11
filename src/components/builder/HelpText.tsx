'use client';

import React from 'react';
import styles from './HelpText.module.scss';
import { clsx } from 'clsx';
import { Info, AlertCircle } from 'lucide-react';

/**
 * TDS-style HelpText Component
 * 도움말/힌트 문구를 일관된 스타일로 표시
 */

interface HelpTextProps {
    /** 표시할 메시지 */
    children: React.ReactNode;
    /** 스타일 변형 */
    variant?: 'info' | 'warning';
    /** 추가 className */
    className?: string;
    /** 아이콘 표시 여부 */
    showIcon?: boolean;
    /** 아이콘 크기 */
    iconSize?: number;
}

export const HelpText = ({
    children,
    variant = 'info',
    className,
    showIcon = true,
    iconSize = 14,
}: HelpTextProps) => {
    const Icon = variant === 'warning' ? AlertCircle : Info;

    return (
        <div className={clsx(styles.container, styles[variant], className)}>
            {showIcon && <Icon size={iconSize} className={styles.icon} />}
            <span className={styles.text}>{children}</span>
        </div>
    );
};

export default HelpText;
