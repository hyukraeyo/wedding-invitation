import { Switch as ShadcnSwitch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import styles from './SwitchField.module.scss';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string | undefined;
    className?: string | undefined; // Additional className for the container
    disabled?: boolean | undefined;
}

export const SwitchField = ({ checked, onChange, label, className, disabled }: SwitchProps) => {
    return (
        <div
            className={cn(
                styles.container,
                disabled && styles.disabled,
                className
            )}
            onClick={() => !disabled && onChange(!checked)}
        >
            <div className={styles.content}>
                {label ? (
                    <Label
                        className={styles.label}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent double trigger since parent has onClick
                        }}
                    >
                        {label}
                    </Label>
                ) : null}
                <ShadcnSwitch
                    checked={checked}
                    onCheckedChange={() => {
                        // This might be redundant if the parent handles it, 
                        // but good for accessibility if they use keyboard.
                    }}
                    disabled={disabled}
                    className={styles.switch} // Parent handles click
                />
            </div>
        </div>
    );
};
