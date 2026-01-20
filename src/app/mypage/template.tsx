"use client";

import React from 'react';
import styles from './MyPage.module.scss';

export default function MyPageTemplate({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${styles.templateWrapper} view-transition-content`}>
            {children}
        </div>
    );
}
