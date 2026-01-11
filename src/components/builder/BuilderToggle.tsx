import styles from './Builder.module.scss';
import { clsx } from 'clsx';

interface BuilderToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    className?: string;
}

export const BuilderToggle = ({
    checked,
    onChange,
    label,
    className = ""
}: BuilderToggleProps) => {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={clsx(styles.toggle, checked && styles.checked, className)}
        >
            <div className={styles.toggleTrack}>
                <div className={styles.toggleThumb} />
            </div>
            {label && <span className={styles.toggleLabel}>{label}</span>}
        </button>
    );
};
