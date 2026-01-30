import { Skeleton } from '@/components/ui/Skeleton';
import styles from './AccountPage.module.scss';
import { clsx } from 'clsx';

export default function Loading() {
    return (
        <div className={clsx("view-transition-content", styles.accountList)}>
            {/* Profile Header Skeleton */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarWrapper}>
                    <Skeleton pattern="listOnly" repeatLastItemCount={1} className={styles.avatar} />
                </div>
                <div className={styles.headerInfo} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'inherit', width: '100%', maxWidth: '200px' }}>
                    <Skeleton pattern="listOnly" repeatLastItemCount={1} style={{ height: '28px', width: '120px' }} />
                    <Skeleton pattern="listOnly" repeatLastItemCount={1} style={{ height: '20px', width: '180px' }} />
                </div>
            </div>

            {/* Account Items Skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} className={styles.accountItem}>
                    <div className={styles.itemHeader}>
                        <Skeleton pattern="listOnly" repeatLastItemCount={1} style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
                        <Skeleton pattern="listOnly" repeatLastItemCount={1} style={{ width: '40px', height: '16px' }} />
                    </div>
                    <div className={styles.itemContent}>
                        <Skeleton pattern="listOnly" repeatLastItemCount={1} style={{ width: '100%', maxWidth: '200px', height: '24px' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
