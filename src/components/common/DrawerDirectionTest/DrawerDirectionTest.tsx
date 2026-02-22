'use client';

import * as React from 'react';
import { ArrowLeft, Eye, Save } from 'lucide-react';

import { IconButton } from '@/components/ui/IconButton';

import styles from './DrawerDirectionTest.module.scss';

type DirectionVariant = 'rail' | 'speed-dial' | 'dock';

interface VariantCard {
  key: DirectionVariant;
  title: string;
  summary: string;
}

const VARIANT_CARDS: readonly VariantCard[] = [
  {
    key: 'rail',
    title: '1. 오른쪽 세로 레일',
    summary: '손가락 이동이 짧고, 3개 액션을 한 눈에 볼 수 있어요.',
  },
  {
    key: 'speed-dial',
    title: '2. 스피드 다이얼',
    summary: '주요 액션(미리보기)만 크게 보이고 보조 액션은 주변에 둬요.',
  },
  {
    key: 'dock',
    title: '3. 하단 글래스 도크',
    summary: '아이콘과 레이블을 함께 보여서 처음 쓰는 사용자에게 친숙해요.',
  },
] as const;

const MockField = React.memo(function MockField() {
  return <div className={styles.mockField} />;
});

const MockCanvas = React.memo(function MockCanvas() {
  return (
    <div className={styles.mockCanvas}>
      <MockField />
      <MockField />
      <MockField />
      <MockField />
      <MockField />
      <div className={styles.mockUploader} />
    </div>
  );
});

interface ActionChipProps {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary';
  size?: 'xl' | 'lg';
}

const ActionChip = React.memo(function ActionChip({
  icon,
  label,
  variant = 'secondary',
  size = 'xl',
}: ActionChipProps) {
  return (
    <div className={styles.actionChip}>
      <IconButton type="button" variant={variant} size={size} aria-label={label} name="">
        {icon}
      </IconButton>
    </div>
  );
});

interface VariantPreviewProps {
  variant: DirectionVariant;
}

const VariantPreview = React.memo(function VariantPreview({ variant }: VariantPreviewProps) {
  return (
    <div className={styles.phoneMock}>
      <MockCanvas />

      {variant === 'rail' ? (
        <div className={styles.railActions}>
          <ActionChip
            icon={<ArrowLeft className={styles.actionIcon} />}
            label="뒤로가기"
            variant="secondary"
          />
          <ActionChip
            icon={<Save className={styles.actionIcon} />}
            label="저장"
            variant="secondary"
          />
          <ActionChip
            icon={<Eye className={styles.actionIcon} />}
            label="미리보기"
            variant="primary"
          />
        </div>
      ) : null}

      {variant === 'speed-dial' ? (
        <div className={styles.speedDial}>
          <div className={styles.speedDialPrimary}>
            <ActionChip
              icon={<Eye className={styles.actionIcon} />}
              label="미리보기"
              variant="primary"
            />
          </div>
          <div className={styles.speedDialSave}>
            <ActionChip
              icon={<Save className={styles.actionIcon} />}
              label="저장"
              variant="secondary"
              size="lg"
            />
          </div>
          <div className={styles.speedDialBack}>
            <ActionChip
              icon={<ArrowLeft className={styles.actionIcon} />}
              label="뒤로가기"
              variant="secondary"
              size="lg"
            />
          </div>
        </div>
      ) : null}

      {variant === 'dock' ? (
        <div className={styles.bottomDock}>
          <div className={styles.dockItem}>
            <ActionChip
              icon={<ArrowLeft className={styles.actionIcon} />}
              label="뒤로가기"
              variant="secondary"
              size="lg"
            />
            <span className={styles.dockLabel}>뒤로</span>
          </div>
          <div className={styles.dockItem}>
            <ActionChip
              icon={<Save className={styles.actionIcon} />}
              label="저장"
              variant="primary"
              size="lg"
            />
            <span className={styles.dockLabel}>저장</span>
          </div>
          <div className={styles.dockItem}>
            <ActionChip
              icon={<Eye className={styles.actionIcon} />}
              label="미리보기"
              variant="secondary"
              size="lg"
            />
            <span className={styles.dockLabel}>미리보기</span>
          </div>
        </div>
      ) : null}
    </div>
  );
});

export function DrawerDirectionTest() {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <p className={styles.kicker}>Builder UX Test</p>
        <h1 className={styles.title}>모바일 액션 패턴 1 / 2 / 3 비교</h1>
      </header>

      <div className={styles.grid}>
        {VARIANT_CARDS.map((card) => (
          <article key={card.key} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardSummary}>{card.summary}</p>
            </div>
            <VariantPreview variant={card.key} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default DrawerDirectionTest;
