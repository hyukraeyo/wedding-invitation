import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Heading } from '@/components/ui/Heading';

export const metadata = {
  title: '페이지를 찾을 수 없습니다 | 바나나웨딩',
  description: '요청하신 페이지를 찾을 수 없습니다.',
};

export default function NotFound() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen px-4"
    >
      <Box className="text-center">
        <Heading size="4" className="mb-4">
          404
        </Heading>
        <p className="text-gray-600 mb-8">
          요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Link href="/" passHref>
          <Button variant="solid" size="2">
            홈으로 돌아가기
          </Button>
        </Link>
      </Box>
    </Flex>
  );
}
