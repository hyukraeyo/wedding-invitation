import type { Metadata } from 'next';

import { DrawerDirectionTest } from '@/components/common/DrawerDirectionTest';

export const metadata: Metadata = {
  title: 'Drawer Test',
  description: 'Vaul drawer direction and scroll behavior test page',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DrawerTestPage() {
  return <DrawerDirectionTest />;
}
