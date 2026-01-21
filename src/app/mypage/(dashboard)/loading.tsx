import { Skeleton } from '@/components/ui/Skeleton';
import styles from './MyPage.module.scss';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { MENU_TITLES } from '@/constants/navigation';

export default function Loading() {
    return (
        <div className="view-transition-content">
            <MyPageHeader title={MENU_TITLES.DASHBOARD} />
            <div className={styles.cardGrid}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.createCardWrapper}>
                        <Skeleton className={styles.skeletonCard} />
                        <Skeleton className={styles.skeletonText} />
                    </div>
                ))}
            </div>
        </div>
    );
}
