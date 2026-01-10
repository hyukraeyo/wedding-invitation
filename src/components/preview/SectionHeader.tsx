import React from 'react';
import styles from './SectionHeader.module.scss';
import { clsx } from 'clsx';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    accentColor?: string;
    className?: string;
}

export default function SectionHeader({ title, subtitle, accentColor, className }: SectionHeaderProps) {
    return (
        <div className={clsx(styles.header, className)}>
            {subtitle && (
                <span className={styles.subtitle} style={{ color: accentColor }}>
                    {subtitle}
                </span>
            )}
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.decorationLine} style={{ backgroundColor: accentColor }} />
        </div>
    );
}
