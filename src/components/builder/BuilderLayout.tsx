'use client';

import React from 'react';
import styles from './BuilderLayout.module.scss';
import { clsx } from 'clsx';

// ============================================
// Builder Layout Components
// 빌더 UI의 통합 레이아웃 컴포넌트 시스템
// ============================================

interface LayoutProps {
    children: React.ReactNode;
    className?: string | undefined;
}

// ----- Section: 아코디언 내부 최상위 컨테이너 -----
export const Section = ({ children, className }: LayoutProps) => (
    <div className={clsx(styles.section, className)}>{children}</div>
);

// ----- Stack: 수직 나열 -----
type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface StackProps extends LayoutProps {
    gap?: StackGap | undefined;
}

const stackGapMap: Record<StackGap, string> = {
    xs: styles.stackXs ?? '',
    sm: styles.stackSm ?? '',
    md: styles.stackMd ?? '',
    lg: styles.stackLg ?? '',
    xl: styles.stackXl ?? '',
};

export const Stack = ({ children, className, gap = 'md' }: StackProps) => (
    <div className={clsx(stackGapMap[gap], className)}>{children}</div>
);

// ----- Row: 수평 나열 -----
type RowGap = 'xs' | 'sm' | 'md' | 'lg';
type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'between';
type RowJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';

interface RowProps extends LayoutProps {
    gap?: RowGap | undefined;
    align?: RowAlign | undefined;
    justify?: RowJustify | undefined;
    wrap?: boolean | undefined;
}

const rowGapMap: Record<RowGap, string> = {
    xs: styles.rowXs ?? '',
    sm: styles.rowSm ?? '',
    md: styles.rowMd ?? '',
    lg: styles.rowLg ?? '',
};

const rowJustifyMap: Record<RowJustify, string> = {
    start: styles.rowJustifyStart ?? '',
    center: styles.rowJustifyCenter ?? '',
    end: styles.rowJustifyEnd ?? '',
    'space-between': styles.rowJustifyBetween ?? '',
    'space-around': styles.rowJustifyAround ?? '',
};

export const Row = ({ children, className, gap = 'md', align = 'center', justify, wrap = false }: RowProps) => (
    <div className={clsx(
        rowGapMap[gap],
        align === 'stretch' && styles.rowStretch,
        align === 'between' && styles.rowBetween,
        justify && rowJustifyMap[justify],
        wrap && styles.rowWrap,
        className
    )}>{children}</div>
);

// ----- Grid: 그리드 레이아웃 -----
type GridCols = 2 | 3 | 4 | 'auto';

interface GridProps extends LayoutProps {
    cols?: GridCols | undefined;
}

const gridColsMap: Record<GridCols, string> = {
    2: styles.grid2 ?? '',
    3: styles.grid3 ?? '',
    4: styles.grid4 ?? '',
    auto: styles.gridAuto ?? '',
};

export const Grid = ({ children, className, cols = 2 }: GridProps) => (
    <div className={clsx(gridColsMap[cols], className)}>{children}</div>
);

// ----- Divider: 구분선 -----
interface DividerProps {
    className?: string | undefined;
    vertical?: boolean | undefined;
}

export const Divider = ({ className, vertical = false }: DividerProps) => (
    <div className={clsx(vertical ? styles.dividerVertical : styles.divider, className)} />
);

// ----- Card: 박스 형태 컨테이너 -----
interface CardProps extends LayoutProps {
    hoverable?: boolean | undefined;
}

export const Card = ({ children, className, hoverable = false }: CardProps) => (
    <div className={clsx(hoverable ? styles.cardHover : styles.card, className)}>{children}</div>
);

// ----- SubLabel: 인라인 라벨 -----
interface SubLabelProps {
    children: React.ReactNode;
    className?: string | undefined;
}

export const SubLabel = ({ children, className }: SubLabelProps) => (
    <span className={clsx(styles.subLabel, className)}>{children}</span>
);

// ----- FormRow: 라벨 + 인풋 가로 배치 -----
type FormRowCols = 2 | 3 | 4;

interface FormRowProps extends LayoutProps {
    cols?: FormRowCols | undefined;
    label?: string | undefined;
}

export const FormRow = ({ children, className, cols = 2, label }: FormRowProps) => {
    const colsClass = cols === 3 ? styles.formRow3 : cols === 4 ? styles.formRow4 : styles.formRow;
    return (
        <div className={clsx(colsClass, className)}>
            {label && <SubLabel>{label}</SubLabel>}
            {children}
        </div>
    );
};

// ----- Fieldset: 그룹화된 필드 컨테이너 -----
export const Fieldset = ({ children, className }: LayoutProps) => (
    <div className={clsx(styles.fieldset, className)}>{children}</div>
);

// ----- ImageGrid: 갤러리용 그리드 -----
export const ImageGrid = ({ children, className }: LayoutProps) => (
    <div className={clsx(styles.imageGrid, className)}>{children}</div>
);

// ----- GalleryItem: 갤러리 아이템 래퍼 -----
interface GalleryItemProps extends LayoutProps {
    isDragging?: boolean | undefined;
}

export const GalleryItem = ({ children, className, isDragging = false }: GalleryItemProps) => (
    <div className={clsx(styles.galleryItem, isDragging && styles.dragging, className)}>{children}</div>
);

// ----- SortableItem: 드래그 정렬 가능한 아이템 -----
export const SortableItem = ({ children, className }: LayoutProps) => (
    <div className={clsx(styles.sortableItem, className)}>{children}</div>
);

// ----- 유틸리티 래퍼 -----
export const FullWidth = ({ children, className }: LayoutProps) => (
    <div className={clsx(styles.fullWidth, className)}>{children}</div>
);

// Re-export styles for direct class access when needed
export { styles };
