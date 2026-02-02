import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import styles from './not-found.module.scss';

export const metadata = {
  title: '페이지를 찾을 수 없어요 | 바나나웨딩',
  description: '요청하신 페이지를 찾을 수 없어요.',
};

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Heading size="4" className="mb-4">
          404
        </Heading>
        <p className="text-gray-600 mb-8">
          요청하신 페이지를 찾을 수 없어요.
        </p>
        <Link href="/" passHref>
          <Button variant="solid" size="2">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
