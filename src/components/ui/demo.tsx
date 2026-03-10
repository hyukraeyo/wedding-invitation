import { AnimatedMarqueeHero } from '@/components/ui/hero-3';

const DEMO_IMAGES = [
  '/images/hero/image-01.png',
  '/images/hero/image-02.png',
  '/images/hero/image-03.png',
  '/images/hero/image-04.jpg',
  '/images/hero/image-05.jpg',
  '/images/hero/image-06.jpg',
  '/images/hero/image-07.jpg',
  '/images/hero/image-08.jpg',
];

export default function AnimatedHeroDemo() {
  return (
    <AnimatedMarqueeHero
      tagline="3분 완성 모바일 청첩장"
      title={
        <>
          쉽고 감성적인
          <br />
          바나나웨딩 초대장
        </>
      }
      description="직관적인 에디터와 실시간 미리보기로 예식 정보를 빠르게 정리하고, 카카오톡으로 손쉽게 공유하세요."
      ctaText="3분 만에 시작하기"
      ctaHref="/builder?mode=new"
      images={DEMO_IMAGES}
    />
  );
}
