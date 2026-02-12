'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { ArrowRight, Palette, Smartphone, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { BottomCTA } from '@/components/common/BottomCTA';
import { Button } from '@/components/ui/Button';
import { ButtonGroup } from '@/components/ui/ButtonGroup';
import styles from './Home.module.scss';

type ThemeTone = 'mono' | 'peach' | 'navy' | 'green';

const FEATURE_ITEMS = [
  {
    title: '3분 완성 빌더',
    description: '핵심 정보만 입력하면 즉시 완성되는 실시간 미리보기로 준비 시간을 줄여드려요.',
    icon: Zap,
  },
  {
    title: '감성 테마 큐레이션',
    description: '웨딩 무드에 맞춘 타이포와 컬러 조합으로 분위기를 빠르게 완성할 수 있어요.',
    icon: Palette,
  },
  {
    title: '모바일 공유 최적화',
    description:
      '카카오톡, 문자, 링크 어디에서 열어도 깔끔하게 보이는 모바일 화면에 최적화했습니다.',
    icon: Smartphone,
  },
];

const FLOW_STEPS = [
  {
    title: '정보 입력',
    description: '예식 정보와 인사말을 간단히 작성하세요.',
  },
  {
    title: '테마 선택',
    description: '원하는 분위기의 디자인을 바로 적용하세요.',
  },
  {
    title: '링크 공유',
    description: '생성된 링크를 가족과 하객에게 전달하세요.',
  },
];

const THEME_PLACEHOLDERS = [
  { id: 1, name: 'Minimal Mono', tone: 'mono' as const },
  { id: 2, name: 'Peach Bloom', tone: 'peach' as const },
  { id: 3, name: 'Classic Navy', tone: 'navy' as const },
  { id: 4, name: 'Modern Green', tone: 'green' as const },
];

const FAQ_ITEMS = [
  {
    id: 'item-1',
    question: '시작 비용이 있나요?',
    answer:
      '기본 기능은 무료로 사용할 수 있어요. 필요한 경우에만 프리미엄 테마와 추가 기능을 선택하면 됩니다.',
  },
  {
    id: 'item-2',
    question: '수정 횟수 제한이 있나요?',
    answer: '없어요. 예식 전까지 원하는 만큼 수정할 수 있고, 변경 내용은 저장 즉시 반영됩니다.',
  },
  {
    id: 'item-3',
    question: '사진은 몇 장까지 넣을 수 있나요?',
    answer:
      '기본 갤러리에는 최대 30장까지 등록할 수 있으며, 순서 변경과 교체도 자유롭게 할 수 있습니다.',
  },
];

const COPYRIGHT_YEAR = '2026';

const THEME_TONE_CLASS_MAP: Record<ThemeTone, string> = {
  mono: styles.themeToneMono ?? '',
  peach: styles.themeTonePeach ?? '',
  navy: styles.themeToneNavy ?? '',
  green: styles.themeToneGreen ?? '',
};

export function HomeClient() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroChip}>
            <Sparkles size={14} className={styles.heroChipIcon} />
            2026 NEW COLLECTION
          </div>
          <h1 className={styles.heroTitle}>
            우리의 첫 인사,
            <br />
            <span>바나나 웨딩</span>
          </h1>
          <p className={styles.heroDescription}>
            복잡한 준비는 줄이고, 두 사람의 이야기만 담아보세요.
            <br />
            모바일에 최적화된 감성 청첩장을 몇 분 만에 완성할 수 있어요.
          </p>
          <ButtonGroup className={styles.heroActions}>
            <Button asChild variant="primary" size="lg">
              <Link href="/builder">
                무료로 시작하기
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="#features">기능 둘러보기</Link>
            </Button>
          </ButtonGroup>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Features</span>
          <h2 className={styles.sectionTitle}>결혼 준비에 꼭 필요한 기능만 담았습니다</h2>
          <p className={styles.sectionDescription}>
            자주 사용하는 핵심 흐름을 중심으로 빠르고 안정적인 작성 경험을 제공합니다.
          </p>
        </header>

        <div className={styles.featureGrid}>
          {FEATURE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureHeader}>
                  <div className={styles.featureIconBox}>
                    <Icon size={24} />
                  </div>
                  <h3 className={styles.featureTitle}>{item.title}</h3>
                </div>
                <p className={styles.featureDesc}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Theme Preview Section */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Design</span>
          <h2 className={styles.sectionTitle}>취향에 맞춰 고르는 프리미엄 테마</h2>
          <p className={styles.sectionDescription}>
            과하지 않지만 오래 기억에 남는 디자인으로 두 사람의 분위기를 표현하세요.
          </p>
        </header>

        <div className={styles.themeGrid}>
          {THEME_PLACEHOLDERS.map((theme) => (
            <div
              key={theme.id}
              className={`${styles.themeCard} ${THEME_TONE_CLASS_MAP[theme.tone]}`}
            >
              {/* Actual images would go here */}
              <div className={styles.themeOverlay}>
                <span>{theme.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Workflow</span>
          <h2 className={styles.sectionTitle}>3단계면 충분합니다</h2>
        </header>

        <div className={styles.workflowList}>
          {FLOW_STEPS.map((step, idx) => (
            <div key={idx} className={styles.workflowItem}>
              <div className={`${styles.workflowNumber} ${idx <= 1 ? styles.active : ''}`}>
                {idx + 1}
              </div>
              <div className={styles.workflowContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Q&A</span>
          <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>
        </header>

        <Accordion type="single" collapsible className={styles.faqList}>
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <nav className={styles.footerLinks}>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보 처리방침</Link>
          <Link href="/login">로그인</Link>
        </nav>
        <p className={styles.copyright}>© {COPYRIGHT_YEAR} Banana Wedding. All rights reserved.</p>
      </footer>

      {/* Mobile Sticky Dock */}
      <BottomCTA.Single
        fixed
        transparent
        animated
        hideOnScroll
        className={styles.mobileDock}
        asChild
      >
        <Link href="/builder" aria-label="무료 모바일 청첩장 만들기 시작하기">
          지금 바로 시작하기
        </Link>
      </BottomCTA.Single>
    </div>
  );
}
