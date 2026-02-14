import type { Metadata } from 'next';

import { BirthdayEventLanding } from '@/components/common/BirthdayEventLanding';

export const metadata: Metadata = {
  title: 'Birthday Event Love',
  description: '아이폰 전용 생일 이벤트 랜딩 러브 페이지',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function BirthdayEventLovePage() {
  return <BirthdayEventLanding />;
}
