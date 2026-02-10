'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

import { IconButton } from '@/components/ui/IconButton';
import type { EditorSectionKey } from '@/constants/editorSections';

import styles from './EditorForm.module.scss';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NAV_INDICATOR_OFFSET = 12;
const NAV_ITEM_STRIDE = 72;

/* ------------------------------------------------------------------ */
/*  NavItem – individually memoised                                    */
/* ------------------------------------------------------------------ */

interface NavItemProps {
  sectionKey: EditorSectionKey;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isInvalid: boolean;
  onSelect: (key: EditorSectionKey) => void;
}

const NavItem = React.memo(function NavItem({
  sectionKey,
  label,
  icon: Icon,
  isActive,
  isInvalid,
  onSelect,
}: NavItemProps) {
  const handleClick = React.useCallback(() => {
    onSelect(sectionKey);
  }, [onSelect, sectionKey]);

  return (
    <IconButton
      unstyled
      className={clsx(
        styles.navItem,
        styles.navItemLayer,
        isActive && styles.active,
        isInvalid && styles.invalid
      )}
      onClick={handleClick}
      aria-label={`${label} 섹션으로 이동`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className={styles.navIcon} strokeWidth={2} />
      <span className={styles.navLabel}>{label}</span>
    </IconButton>
  );
});

NavItem.displayName = 'NavItem';

/* ------------------------------------------------------------------ */
/*  NavRail                                                            */
/* ------------------------------------------------------------------ */

export interface SectionEntry {
  key: EditorSectionKey;
  label: string;
  icon: LucideIcon;
}

interface NavRailProps {
  sections: readonly SectionEntry[];
  activeSection: EditorSectionKey;
  activeSectionIndex: number;
  validationErrors: readonly string[];
  onSectionChange: (key: EditorSectionKey) => void;
}

const NavRail = React.memo(function NavRail({
  sections,
  activeSection,
  activeSectionIndex,
  validationErrors,
  onSectionChange,
}: NavRailProps) {
  return (
    <nav className={styles.navRail}>
      <div
        className={styles.activeIndicator}
        style={{
          transform: `translateY(${NAV_INDICATOR_OFFSET + Math.max(activeSectionIndex, 0) * NAV_ITEM_STRIDE}px)`,
        }}
      />
      {sections.map(({ key, label, icon }) => (
        <NavItem
          key={key}
          sectionKey={key}
          label={label}
          icon={icon}
          isActive={activeSection === key}
          isInvalid={validationErrors.includes(key)}
          onSelect={onSectionChange}
        />
      ))}
    </nav>
  );
});

NavRail.displayName = 'NavRail';

export { NavRail };
