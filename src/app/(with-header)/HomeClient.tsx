'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ArrowRight, ChevronDown, Palette, Smartphone, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './Home.module.scss';

const FEATURE_ITEMS = [
  {
    title: '압도적 속도',
    description: '입력과 동시에 완성되는 실시간 미리보기로 제작 시간을 단축하세요.',
    icon: Zap,
  },
  {
    title: '감각적 디자인',
    description: '전문 디자이너가 조율한 타이포그래피와 레이아웃을 제공합니다.',
    icon: Palette,
  },
  {
    title: '모바일 최적화',
    description: '어떤 기기에서도 완벽하게 보이는 반응형 뷰어를 지원합니다.',
    icon: Smartphone,
  },
];

const FLOW_STEPS = [
  {
    title: '정보 입력',
    description: '예식 정보를 입력하세요',
  },
  {
    title: '디자인 선택',
    description: '취향에 맞는 테마 설정',
  },
  {
    title: '링크 공유',
    description: '카카오톡으로 바로 전달',
  },
];

const THEME_PLACEHOLDERS = [
  { id: 1, name: 'Minimal Mono', color: '#f4f4f5' },
  { id: 2, name: 'Soft Peach', color: '#fff1f2' },
  { id: 3, name: 'Classic Navy', color: '#f0f9ff' },
  { id: 4, name: 'Modern Green', color: '#f0fdf4' },
];

const FAQ_ITEMS = [
  {
    id: 'item-1',
    question: '제작 비용은 얼마인가요?',
    answer:
      '바나나웨딩의 모든 기본 기능은 무료로 제공됩니다. 프리미엄 테마와 추가 기능도 합리적인 가격으로 이용하실 수 있습니다.',
  },
  {
    id: 'item-2',
    question: '수정 횟수에 제한이 있나요?',
    answer:
      '아니요, 예식 전까지 횟수 제한 없이 자유롭게 수정하실 수 있습니다. 변경된 내용은 실시간으로 반영됩니다.',
  },
  {
    id: 'item-3',
    question: '사진은 몇 장까지 올릴 수 있나요?',
    answer:
      '기본 갤러리에는 최대 30장의 고화질 사진을 업로드하실 수 있으며, 순서 변경도 자유롭습니다.',
  },
];

const COPYRIGHT_YEAR = '2026';

export function HomeClient() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
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
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroChip}>
            <Sparkles size={14} className={styles.heroChipIcon} />
            2026 New Collection
          </div>
          <h1 className={styles.heroTitle}>
            가장 완벽한 시작,
            <br />
            <span>바나나 웨딩</span>
          </h1>
          <p className={styles.heroDescription}>
            복잡한 절차는 걷어내고, 오직 두 사람의 이야기에만 집중하세요.
            <br />
            감각적인 당신을 위한 미니멀 모바일 청첩장.
          </p>
          <div className={styles.heroActions}>
            <Button asChild variant="primary" size="lg" radius="full">
              <Link href="/setup">
                무료로 시작하기
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" radius="full">
              <Link href="#features">더 알아보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Features</span>
          <h2 className={styles.sectionTitle}>불필요한 기능은 뺐습니다</h2>
          <p className={styles.sectionDescription}>
            가장 자주 쓰는 핵심 기능만 담아 가볍고 강력합니다.
          </p>
        </header>

        <div className={styles.featureGrid}>
          {FEATURE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIconBox}>
                  <Icon size={24} />
                </div>
                <h3 className={styles.featureTitle}>{item.title}</h3>
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
          <h2 className={styles.sectionTitle}>취향을 담은 프리미엄 테마</h2>
          <p className={styles.sectionDescription}>
            단순하지만 세련된, 질리지 않는 디자인을 만나보세요.
          </p>
        </header>

        <div className={styles.themeGrid}>
          {THEME_PLACEHOLDERS.map((theme) => (
            <div
              key={theme.id}
              className={styles.themeCard}
              style={{ backgroundColor: theme.color }}
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
          <h2 className={styles.sectionTitle}>3분이면 충분합니다</h2>
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

        <Accordion.Root type="single" collapsible className={styles.faqList}>
          {FAQ_ITEMS.map((item) => (
            <Accordion.Item key={item.id} value={item.id} className={styles.faqItem}>
              <Accordion.Header>
                <Accordion.Trigger className={styles.faqTrigger}>
                  {item.question}
                  <ChevronDown size={20} aria-hidden />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className={styles.faqContent}>{item.answer}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
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
      <div className={styles.mobileDock}>
        <Button asChild variant="primary" size="lg" fullWidth radius="lg">
          <Link href="/setup">지금 바로 제작하기</Link>
        </Button>
      </div>
    </div>
  );
}
