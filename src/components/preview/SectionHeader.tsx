import React, { memo } from 'react';
import styles from './SectionHeader.module.scss';
import { clsx } from 'clsx';

interface SectionHeaderProps {
  title: string;
  subtitle?: string | undefined;
  accentColor?: string | undefined;
  className?: string;
}

const SectionHeader = memo(function SectionHeader({
  title,
  subtitle,
  accentColor,
  className,
}: SectionHeaderProps) {
  if (!title) return null;

  return (
    <div className={clsx(styles.header, className)}>
      {subtitle ? (
        <span className={styles.subtitle} style={{ color: accentColor }}>
          {subtitle}
        </span>
      ) : null}
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.decorationLine} style={{ backgroundColor: accentColor }} />
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
