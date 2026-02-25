'use client';

import { Timer, Palette, MessageCircle, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './FeaturesSection.module.scss';

const features = [
  {
    icon: <Timer className={styles.icon} />,
    title: '3분 완성',
    description:
      '복잡한 과정 없이 핵심 정보만 입력하면 누구나 쉽게 모바일 청첩장을 완성할 수 있어요.',
  },
  {
    icon: <Smartphone className={styles.icon} />,
    title: '실시간 미리보기',
    description: '입력하는 즉시 모바일 화면과 동일한 프리뷰로 완성된 모습을 확인할 수 있어요.',
  },
  {
    icon: <Palette className={styles.icon} />,
    title: '감성적인 테마',
    description: '바나나웨딩만의 따뜻하고 감성적인 디자인으로 특별한 순간을 더욱 빛나게 해드려요.',
  },
  {
    icon: <MessageCircle className={styles.icon} />,
    title: '간편한 카톡 공유',
    description: '완성된 청첩장은 카카오톡 메시지로 지인들에게 바로 안전하게 전달할 수 있어요.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const, // iOS feel
    },
  },
};

export function FeaturesSection() {
  return (
    <section className={styles.section} aria-labelledby="features-title">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <span className={styles.badge}>바나나웨딩만의 특별함</span>
          <h2 id="features-title" className={styles.title}>
            쉽고 빠른 모바일 청첩장 제작
          </h2>
          <p className={styles.description}>
            첫 화면은 감성적인 비주얼 그대로, 제작은 3분 안에 끝낼 수 있도록 편의성을 극대화했어요.
            카카오톡 공유, 실시간 미리보기, 간편 수정 기능을 경험해보세요.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.actions}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <Link href="/builder?mode=new" className={styles.primaryLink}>
            3분 만에 시작하기
            <ArrowRight className={styles.linkIcon} />
          </Link>
          <Link href="/brand-story" className={styles.secondaryLink}>
            브랜드 스토리 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
