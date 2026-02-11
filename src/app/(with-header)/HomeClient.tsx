import {
  ArrowRight,
  CheckCircle2,
  Images,
  MapPin,
  Palette,
  Share2,
  Sparkles,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Home.module.scss';

const COPYRIGHT_YEAR = '2026';
const FEATURE_ITEMS = [
  {
    title: '3분 제작 + 즉시 미리보기',
    description:
      '대표 이미지, 문구, 예식 정보를 입력하면 바로 결과를 확인하며 완성도를 빠르게 높일 수 있습니다.',
    icon: Sparkles,
  },
  {
    title: '사진/지도/공유를 한 화면에서',
    description:
      '사진 구성, 지도 안내, 카카오톡 공유까지 하객 전달에 필요한 흐름을 한 번에 정리합니다.',
    icon: Share2,
  },
  {
    title: '웨딩 갤러리 편집',
    description: '사진 순서와 노출 방식을 조정해 분위기를 정리합니다.',
    icon: Images,
  },
  {
    title: '예식 정보 + 지도 안내',
    description: '일시, 장소, 주소와 지도 안내를 함께 제공합니다.',
    icon: MapPin,
  },
  {
    title: '테마/스타일 설정',
    description: '폰트와 강조색으로 두 분의 분위기를 맞춥니다.',
    icon: Palette,
  },
  {
    title: '축의금 계좌 안내',
    description: '신랑/신부 측 정보를 분리해 깔끔하게 안내합니다.',
    icon: Wallet,
  },
  {
    title: '모바일 전달 최적화',
    description: '하객이 모바일에서 바로 읽고 이동할 수 있도록 읽기 흐름을 최적화했습니다.',
    icon: CheckCircle2,
  },
] as const;

const FLOW_STEPS = [
  {
    title: '기본 정보 입력',
    description: '예식 일시, 장소, 인사말을 먼저 정리합니다.',
  },
  {
    title: '사진/디자인 구성',
    description: '메인·갤러리·테마를 편집하며 즉시 미리보기 합니다.',
  },
  {
    title: '링크 공유',
    description: '완성된 청첩장을 카카오톡과 메신저로 전달합니다.',
  },
] as const;

export function HomeClient() {
  return (
    <div className={styles.container}>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <Image
          src="/assets/images/hero-wedding.png"
          alt="웨딩 부케를 든 신랑 신부"
          fill
          priority
          quality={90}
          className={styles.heroImage}
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 id="home-hero-title" className={styles.heroTitle}>
            우리만의 특별한
            <br />
            <span className={styles.heroAccent}>모바일 청첩장</span>
          </h1>
          <p className={styles.heroDescription}>
            유통기한 없는 달콤한 이야기, 3분 만에 제작하고 공유하세요.
          </p>
          <div className={styles.heroActions}>
            <Link href="/setup" className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
              무료로 시작하기
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className={styles.section} aria-labelledby="home-features-title">
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Core Value</span>
          <h2 id="home-features-title" className={styles.sectionTitle}>
            복잡함을 덜어낸 핵심 기능 구성
          </h2>
          <p className={styles.sectionDescription}>
            실제로 자주 쓰는 기능만 남겨, 처음 시작해도 빠르게 초안을 완성할 수 있도록 정리했습니다.
          </p>
        </header>

        <div className={styles.coreGrid}>
          {FEATURE_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className={styles.coreCard}>
                <div className={styles.coreIcon} aria-hidden="true">
                  <Icon size={20} />
                </div>
                <h3 className={styles.coreTitle}>{item.title}</h3>
                <p className={styles.coreDescription}>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.flowSection}`}
        aria-labelledby="home-flow-title"
      >
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Workflow</span>
          <h2 id="home-flow-title" className={styles.sectionTitle}>
            실제 제작 흐름
          </h2>
        </header>

        <ol className={styles.flowList}>
          {FLOW_STEPS.map((step, index) => (
            <li key={step.title} className={styles.flowItem}>
              <span className={styles.flowIndex}>{index + 1}</span>
              <div className={styles.flowContent}>
                <h3 className={styles.subTitle}>{step.title}</h3>
                <p className={styles.subDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="home-cta-title">
        <div className={styles.finalShell}>
          <h2 id="home-cta-title" className={styles.finalTitle}>
            지금 바로 청첩장 초안을 만들어 보세요
          </h2>
          <p className={styles.finalDescription}>
            제작 후 바로 링크를 공유할 수 있도록 핵심 동선을 최소 단계로 구성했습니다.
          </p>
          <div className={styles.finalActions}>
            <Link href="/setup" className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
              무료로 시작하기
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/privacy" className={`${styles.ctaButton} ${styles.ctaGhost}`}>
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer} aria-label="바나나웨딩 안내">
        <nav className={styles.footerLinks} aria-label="주요 페이지 링크">
          <Link href="/setup">청첩장 시작하기</Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/login">로그인</Link>
          <Link href="/privacy">개인정보 처리방침</Link>
        </nav>
        <p className={styles.footerCopy}>© {COPYRIGHT_YEAR} Banana Wedding. All rights reserved.</p>
      </footer>

      <div className={styles.mobileDock}>
        <Link
          href="/setup"
          className={`${styles.ctaButton} ${styles.ctaPrimary} ${styles.mobileDockButton}`}
        >
          3분 안에 시작하기
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
