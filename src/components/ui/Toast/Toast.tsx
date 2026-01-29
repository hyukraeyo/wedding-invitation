import { Toast as TDSToast } from '@toss/tds-mobile';
import type { ToastProps as TDSToastProps } from '@toss/tds-mobile';
import styles from './Toast.module.scss';
import { cn } from '@/lib/utils';

export type ToastProps = TDSToastProps & {
    className?: string;
};

/**
 * 🍌 바나나웨딩 전용 Toast 컴포넌트
 * TDS Toast를 래핑하여 프로젝트 스타일 가이드를 따릅니다.
 */
export const Toast = ({ className, ...props }: ToastProps) => {
    return (
        <TDSToast
            className={cn(styles.toast, className)}
            {...props}
        />
    );
};

Toast.displayName = 'Toast';
