import { Suspense } from 'react';
import { BuilderClient } from './BuilderClient';
import styles from './BuilderPage.module.scss';
import type { Metadata } from 'next';
import { detectRequestEnvironment } from '@/lib/requestEnvironment';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: '청첩장 만들기 | 바나나웨딩',
  description: '나만의 특별한 모바일 청첩장을 쉽고 빠르게 만들어보세요.',
};

/**
 * 🍌 빌더 페이지 (서버 컴포넌트)
 * 최신 Next.js 권장 사항에 따라 페이지 진입점은 서버 컴포넌트로 유지합니다.
 * 복잡한 인터랙션 로직은 하위의 BuilderClient에서 처리합니다.
 */
export default async function BuilderPage() {
  const headerList = await headers();
  const userAgent = headerList.get('user-agent') || '';
  const { isMobile, isToss } = detectRequestEnvironment(userAgent);

  return (
    <Suspense fallback={<div className={styles.container} />}>
      <BuilderClient initialIsMobile={isMobile} initialIsToss={isToss} />
    </Suspense>
  );
}
