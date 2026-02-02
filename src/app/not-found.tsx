import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';

export const metadata = {
  title: '페이지를 찾을 수 없어요 | 바나나웨딩',
  description: '요청하신 페이지를 찾을 수 없어요.',
};

export default function NotFound() {
  return (
    <div>
      <div>
        <Heading size="4">
          404
        </Heading>
        <p>
          요청하신 페이지를 찾을 수 없어요.
        </p>
        <Link href="/" passHref>
          <Button variant="solid" size="md">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
