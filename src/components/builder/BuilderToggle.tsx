import styles from './Builder.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

interface BuilderToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    className?: string;
}

const hexToRgbValues = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export const BuilderToggle = ({
    checked,
    onChange,
    label,
    className = ""
}: BuilderToggleProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={clsx(styles.buttonToggle, checked && styles.checked, className)}
            style={{
                '--accent-rgb': hexToRgbValues(accentColor)
            } as React.CSSProperties}
        >
            {label}
        </button>
    );
};
