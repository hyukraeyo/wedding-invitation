import { Skeleton } from '@/components/ui/Skeleton';
import styles from './AccountPage.module.scss';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';

export default function Loading() {
    return (
        <div className="view-transition-content">
            <MyPageHeader title="내 계정 관리" />
            <div className={styles.contentCard}>
                <div className={styles.profileHeader}>
                    <Skeleton className={styles.skeletonAvatar} />
                    <Skeleton className={styles.skeletonTitle} />
                    <Skeleton className={styles.skeletonSub} />
                </div>
                <div className={styles.formSection}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.infoRow} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <div className={styles.labelWrapper}>
                                <Skeleton className={styles.skeletonLabel} />
                            </div>
                            <div className={styles.value}>
                                <Skeleton className={styles.skeletonValue} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
