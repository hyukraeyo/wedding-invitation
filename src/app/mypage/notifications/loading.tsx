import { Skeleton } from '@/components/ui/Skeleton';
import styles from './NotificationsPage.module.scss';
import { clsx } from 'clsx';

export default function Loading() {
    return (
        <div className={clsx("view-transition-content", styles.container)}>
            <div className={styles.content}>
                <div className={styles.notificationList}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={styles.skeletonItem}>
                            <Skeleton className={styles.skeletonIcon ?? ''} />
                            <div className={styles.skeletonInfo}>
                                <Skeleton className={styles.skeletonTitle ?? ''} />
                                <Skeleton className={styles.skeletonDate ?? ''} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
