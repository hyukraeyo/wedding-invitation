'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PALETTE } from '@/constants/palette';
import styles from './PreviewAccordion.module.scss';
import { clsx } from 'clsx';

interface PreviewAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  accentColor?: string;
  mode?: 'accent' | 'subtle' | 'white';
}

/**
 * Common Accordion component for the preview canvas.
 * Used in Gift/Accounts and other expandable sections.
 *
 * Smooth open/close via CSS grid rows animation.
 * Single chevron rotates 180° on toggle.
 */
export default function PreviewAccordion({
  title,
  children,
  defaultOpen = false,
  className,
  accentColor,
  mode = 'subtle',
}: PreviewAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const getContrastColor = (hex?: string) => {
    if (!hex) return 'inherit';
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? PALETTE.BLACK : PALETTE.WHITE;
  };

  const textColor = mode === 'accent' ? getContrastColor(accentColor) : 'inherit';

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={clsx(styles.groupContainer, styles[mode], isOpen && styles.expanded, className)}
      style={
        {
          '--accent-bg': accentColor,
          '--accent-text': textColor,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className={styles.groupHeader}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.groupTitle} dangerouslySetInnerHTML={{ __html: title }} />
        <span className={clsx(styles.chevronWrap, isOpen && styles.chevronOpen)}>
          <ChevronDown size={18} className={styles.icon} strokeWidth={2.5} />
        </span>
      </button>

      <div
        ref={contentRef}
        className={clsx(styles.groupContent, isOpen && styles.open)}
        aria-hidden={!isOpen}
      >
        <div className={styles.innerContent}>{children}</div>
      </div>
    </div>
  );
}
