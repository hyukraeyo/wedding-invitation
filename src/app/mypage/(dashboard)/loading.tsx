import { Skeleton } from '@/components/ui/Skeleton';
import styles from './MyPage.module.scss';
import { clsx } from 'clsx';

export default function Loading() {
    return (
        <div className={clsx("view-transition-content", styles.cardGrid)}>
            {/* Create New Card Skeleton */}
            <div className={styles.createCardWrapper}>
                <Skeleton pattern="cardOnly" className={styles.skeletonCard} />
                <Skeleton pattern="listOnly" repeatLastItemCount={1} className={styles.skeletonText} />
            </div>

            {/* Invitation Cards Skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} className={styles.createCardWrapper}>
                    <Skeleton pattern="cardOnly" className={styles.skeletonCard} />
                    <Skeleton pattern="listOnly" repeatLastItemCount={1} className={styles.skeletonText} />
                </div>
            ))}
        </div>
    );
}
