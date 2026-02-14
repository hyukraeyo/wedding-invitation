import type { Metadata } from 'next';

import { DrawerDirectionTest } from '@/components/common/DrawerDirectionTest';

export const metadata: Metadata = {
  title: 'Drawer Direction Test',
  description: '모바일 빌더 액션 배치 시안 비교 테스트',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DrawerDirectionTestPage() {
  return <DrawerDirectionTest />;
}
