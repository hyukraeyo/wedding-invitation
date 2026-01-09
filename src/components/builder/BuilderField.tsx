import styles from './Builder.module.scss';
import { clsx } from 'clsx';
import { BuilderLabel } from './BuilderLabel';

interface BuilderFieldProps {
    label?: React.ReactNode;
    children: React.ReactNode;
    className?: string; // For additional styling if absolutely needed
}

export const BuilderField = ({ label, children, className = "" }: BuilderFieldProps) => {
    return (
        <div className={clsx(styles.field, className)}>
            {label && (typeof label === 'string' ? <BuilderLabel>{label}</BuilderLabel> : label)}
            {children}
        </div>
    );
};
