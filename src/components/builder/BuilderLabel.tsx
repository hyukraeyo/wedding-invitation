import styles from './Builder.module.scss';
import { clsx } from 'clsx';

interface BuilderLabelProps {
    children: React.ReactNode;
    className?: string; // Allow overriding or extending
}

export const BuilderLabel = ({ children, className = '' }: BuilderLabelProps) => {
    return (
        <label className={clsx(styles.label, className)}>
            {children}
        </label>
    );
};
