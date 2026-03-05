import { AnimatedMarqueeHero } from '@/components/ui/hero-3';

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=900&auto=format&fit=crop&q=60',
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
