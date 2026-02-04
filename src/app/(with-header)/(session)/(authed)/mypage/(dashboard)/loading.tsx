import { Skeleton } from '@/components/ui/Skeleton';
import styles from './MyPage.module.scss';
import { clsx } from 'clsx';

export default function Loading() {
    return (
        <div className={clsx("view-transition-content", styles.cardGrid)}>
            {/* Create New Card Skeleton */}
            <div className={styles.createCardWrapper}>
                <Skeleton className={styles.skeletonCard ?? ''} />
            </div>

            {/* Invitation Cards Skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} className={styles.createCardWrapper}>
                    <Skeleton className={styles.skeletonCard ?? ''} />
                </div>
            ))}
        </div>
    );
}
