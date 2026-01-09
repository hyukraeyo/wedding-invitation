import styles from './Builder.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Option<T> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}

interface BuilderButtonGroupProps<T> {
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
    className?: string;
    size?: 'sm' | 'md';
}

const hexToRgbValues = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export const BuilderButtonGroup = <T extends string | number>({
    value,
    options,
    onChange,
    className = "",
    size = 'md'
}: BuilderButtonGroupProps<T>) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <div className={clsx(styles.buttonGroup, className)}>
            {options.map((option) => {
                const isActive = value === option.value;

                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={clsx(
                            styles.groupButton,
                            size === 'sm' ? styles.sm : styles.md,
                            isActive && styles.active
                        )}
                        style={{
                            '--accent-rgb': hexToRgbValues(accentColor)
                        } as React.CSSProperties}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
