import { Heading } from '@/components/ui/Heading';
import styles from './MyPageHeader.module.scss';

interface MyPageHeaderProps {
    title: string;
    actions?: React.ReactNode;
}

export function MyPageHeader({ title, actions }: MyPageHeaderProps) {
    return (
        <div className={styles.sectionHeader}>
            <Heading as="h1" size="5" weight="bold" className={styles.sectionTitle}>{title}</Heading>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
}
