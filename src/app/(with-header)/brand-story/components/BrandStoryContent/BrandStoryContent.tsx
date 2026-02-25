'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Zap, Heart, ArrowRight, Share2 } from 'lucide-react';
import styles from './BrandStoryContent.module.scss';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const values = [
  {
    icon: <Sparkles className={styles.icon} />,
    title: '아름다운 첫인상',
    description:
      '모바일 환경에 최적화된 감성적인 테마로 하객들의 시선을 사로잡는 시각적 경험을 제공합니다.',
  },
  {
    icon: <Share2 className={styles.icon} />,
    title: '매끄러운 공유',
    description:
      '실제 청첩장을 다수 전달하는 카카오톡 환경에 맞춰, 전달하는 사람과 받는 사람 모두에게 매끄러운 경험을 집중합니다.',
  },
  {
    icon: <Zap className={styles.icon} />,
    title: '단순한 편의성',
    description:
      '복잡한 설정 없이 직관적인 인터페이스로 3분 만에 만들고 언제든지 쉽게 수정할 수 있습니다.',
  },
];

export function BrandStoryContent() {
  return (
    <article className={styles.article}>
      <motion.div
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        <span className={styles.heroBadge}>우리의 이야기</span>
        <h1 className={styles.heroTitle}>바나나 웨딩 브랜드 스토리</h1>
        <p className={styles.heroLead}>
          결혼 준비는 복잡한데, 모바일 청첩장 제작만큼은 간단해야 한다는 생각에서 시작했습니다.
          바나나웨딩은 처음 만드는 사람도 직관적으로 이해하고 쉽게 공유할 수 있도록 가장 중요한
          가치와 흐름에 집중하여 만든 서비스입니다.
        </p>
      </motion.div>

      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
      >
        <motion.div className={styles.sectionHeader} variants={fadeUpVariants}>
          <Heart className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>바나나웨딩이 중요하게 보는 기준</h2>
          <p className={styles.sectionDescription}>
            가장 빛나는 순간을 준비하는 당신을 위해 우리는 세 가지 기준을 중요하게 생각합니다.
          </p>
        </motion.div>

        <motion.div className={styles.valuesGrid} variants={staggerContainer}>
          {values.map((value, idx) => (
            <motion.div key={idx} className={styles.valueCard} variants={fadeUpVariants}>
              <div className={styles.iconWrapper}>{value.icon}</div>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeUpVariants}
      >
        <div className={styles.problemBox}>
          <h2 className={styles.problemTitle}>우리가 해결하고자 하는 문제</h2>
          <p className={styles.problemText}>
            기존의 모바일 청첩장 제작 도구는 예쁜 템플릿이 있어도 입력 화면이 복잡하거나 모바일 편집
            경험이 매끄럽지 않은 경우가 많았습니다.
            <br />
            <br />
            바나나 웨딩은 <strong>‘모바일에서 바로 만들고, 바로 고치고, 바로 공유하는’</strong>
            연속적인 모바일 경험에 모든 에너지를 쏟았습니다.
          </p>
        </div>
      </motion.section>

      <motion.section
        className={styles.ctaSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <h2 className={styles.ctaTitle}>이제 시작해볼까요?</h2>
        <p className={styles.ctaDescription}>
          지금도 우리의 핵심 가치는 변함이 없습니다. 누구나 부담 없이 아름다운 모바일 청첩장을
          만들고, 공유할 수 있는 경험을 제공하는 것. 바나나웨딩과 함께 인생의 소중한 페이지를
          완성해보세요.
        </p>

        <div className={styles.actions}>
          <Link href="/setup" className={styles.primaryAction}>
            3분 만에 시작하기
            <ArrowRight className={styles.actionIcon} />
          </Link>
          <Link href="/" className={styles.secondaryAction}>
            홈으로 돌아가기
          </Link>
        </div>
      </motion.section>
    </article>
  );
}
