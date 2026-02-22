'use client';

import React from 'react';
import { MyPageHeader } from '../MyPageHeader';
import styles from './MyPageContent.module.scss';
import { clsx } from 'clsx';

interface MyPageContentProps {
  title?: string;
  children: React.ReactNode;
  className?: string | undefined;
}

/**
 * 🍌 MyPage Common Content Wrapper
 * 마이페이지 내 각 페이지의 공통 구조(헤더 + 컨텐츠 영역)를 잡아주는 컴포넌트입니다.
 */
export function MyPageContent({ title, children, className }: MyPageContentProps) {
  return (
    <div className={styles.container}>
      {title && <MyPageHeader title={title} />}
      <div className={clsx(styles.contentWrapper, className)}>{children}</div>
    </div>
  );
}
