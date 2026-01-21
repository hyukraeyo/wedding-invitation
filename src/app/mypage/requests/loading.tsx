import { Skeleton } from '@/components/ui/Skeleton';
import styles from './RequestsPage.module.scss';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { MENU_TITLES } from '@/constants/navigation';

export default function Loading() {
    return (
        <div className="view-transition-content">
            <MyPageHeader title={MENU_TITLES.REQUESTS} />
            <div className={styles.requestList}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={styles.requestItem} style={{ border: 'none' }}>
                        <div className={styles.requestInfo}>
                            <Skeleton className={styles.skeletonTitle} />
                            <Skeleton className={styles.skeletonSub} />
                        </div>
                        <div className={styles.adminButtonGroup}>
                            <Skeleton className={styles.skeletonButton} />
                            <Skeleton className={styles.skeletonButtonSm} />
                            <Skeleton className={styles.skeletonButtonSm} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
