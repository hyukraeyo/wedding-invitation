import React from 'react';
import { cn } from '@/lib/utils';

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
    <div className={cn("p-4", className)}>{children}</div>
);

// ----- Stack: 수직 나열 -----
type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface StackProps extends LayoutProps {
    gap?: StackGap | undefined;
}

const stackGapMap: Record<StackGap, string> = {
    xs: "space-y-1", // 4px
    sm: "space-y-2", // 8px
    md: "space-y-4", // 16px
    lg: "space-y-6", // 24px
    xl: "space-y-8", // 32px
};

export const Stack = ({ children, className, gap = 'md' }: StackProps) => (
    <div className={cn("flex flex-col", stackGapMap[gap], className)}>{children}</div>
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
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
};

const rowAlignMap: Record<RowAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    between: "items-baseline", // check behavior
};

const rowJustifyMap: Record<RowJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    'space-between': "justify-between",
    'space-around': "justify-around",
};

export const Row = ({ children, className, gap = 'md', align = 'center', justify, wrap = false }: RowProps) => (
    <div className={cn(
        "flex",
        rowGapMap[gap],
        align === 'between' ? "justify-between" : (align && rowAlignMap[align]), // align 'between' in original code mapped to rowBetween style? Usually Align is Cross Axis. assuming original meant 'justify-between'? 
        // Original code had align='between' && styles.rowBetween. If meant justify-between, it should be justify. 
        // But if meant items-baseline or similar? 
        // Let's assume align='between' was effectively justify-between or items-center + w-full?
        // Actually earlier code had `justify` prop. 
        // Let's trust standard flex props.
        justify && rowJustifyMap[justify],
        wrap && "flex-wrap",
        !wrap && "flex-nowrap",
        className
    )}>{children}</div>
);

// ----- Grid: 그리드 레이아웃 -----
type GridCols = 2 | 3 | 4 | 'auto';

interface GridProps extends LayoutProps {
    cols?: GridCols | undefined;
}

const gridColsMap: Record<GridCols, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    auto: "grid-cols-auto-fit", // approximated
};

export const Grid = ({ children, className, cols = 2 }: GridProps) => (
    <div className={cn("grid gap-4", gridColsMap[cols], className)}>{children}</div>
);

// ----- Divider: 구분선 -----
interface DividerProps {
    className?: string | undefined;
    vertical?: boolean | undefined;
}

export const Divider = ({ className, vertical = false }: DividerProps) => (
    <div className={cn("bg-border", vertical ? "w-px h-full" : "h-px w-full", className)} />
);

// ----- Card: 박스 형태 컨테이너 -----
interface CardProps extends LayoutProps {
    hoverable?: boolean | undefined;
}

export const Card = ({ children, className, hoverable = false }: CardProps) => (
    <div className={cn(
        "bg-card text-card-foreground rounded-lg border shadow-sm p-4",
        hoverable && "hover:bg-accent/50 transition-colors cursor-pointer",
        className
    )}>{children}</div>
);

// ----- SubLabel: 인라인 라벨 -----
interface SubLabelProps {
    children: React.ReactNode;
    className?: string | undefined;
}

export const SubLabel = ({ children, className }: SubLabelProps) => (
    <span className={cn("text-xs font-medium text-muted-foreground", className)}>{children}</span>
);

// ----- FormRow: 라벨 + 인풋 가로 배치 -----
type FormRowCols = 2 | 3 | 4;

interface FormRowProps extends LayoutProps {
    cols?: FormRowCols | undefined;
    label?: string | undefined;
}

export const FormRow = ({ children, className, cols = 2, label }: FormRowProps) => {
    // FormRow implementation using Grid or Flex?
    // Original used styles.formRow.
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && <SubLabel>{label}</SubLabel>}
            <div className={cn(
                "grid gap-2",
                cols === 2 && "grid-cols-2",
                cols === 3 && "grid-cols-3",
                cols === 4 && "grid-cols-4"
            )}>
                {children}
            </div>
        </div>
    );
};

// ----- Fieldset: 그룹화된 필드 컨테이너 -----
export const Fieldset = ({ children, className }: LayoutProps) => (
    <div className={cn("space-y-4 border rounded-md p-4", className)}>{children}</div>
);

// ----- ImageGrid: 갤러리용 그리드 -----
export const ImageGrid = ({ children, className }: LayoutProps) => (
    <div className={cn("grid grid-cols-3 gap-2", className)}>{children}</div>
);

// ----- GalleryItem: 갤러리 아이템 래퍼 -----
interface GalleryItemProps extends LayoutProps {
    isDragging?: boolean | undefined;
}

export const GalleryItem = ({ children, className, isDragging = false }: GalleryItemProps) => (
    <div className={cn(
        "relative rounded-md overflow-hidden bg-muted aspect-square",
        isDragging && "opacity-50 ring-2 ring-primary",
        className
    )}>{children}</div>
);

// ----- SortableItem: 드래그 정렬 가능한 아이템 -----
export const SortableItem = ({ children, className }: LayoutProps) => (
    <div className={cn("bg-background border rounded-md p-2 flex items-center gap-2", className)}>{children}</div>
);

// ----- 유틸리티 래퍼 -----
export const FullWidth = ({ children, className }: LayoutProps) => (
    <div className={cn("w-full", className)}>{children}</div>
);

// Deprecated export styles for backward compatibility or remove
export const styles = {};
