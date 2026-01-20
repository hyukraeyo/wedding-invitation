import React from 'react';
import styles from './MyPageHeader.module.scss';

interface MyPageHeaderProps {
    title: string;
    actions?: React.ReactNode;
}

export function MyPageHeader({ title, actions }: MyPageHeaderProps) {
    return (
        <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>{title}</h1>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
}
