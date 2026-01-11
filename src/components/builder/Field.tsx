import styles from './Builder.module.scss';
import { clsx } from 'clsx';
import { Label } from './Label';

interface FieldProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    required?: boolean;
    description?: string;
}

export const Field = ({ label, children, className, required, description }: FieldProps) => {
    return (
        <div className={clsx(styles.field, className)}>
            <Label required={!!required} className={styles.label}>
                {label}
            </Label>
            {description && <div className={styles.description}>{description}</div>}
            {children}
        </div>
    );
};
