import { SwitchField } from './SwitchField';

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
    className
}: BuilderToggleProps) => {
    return (
        <SwitchField
            checked={checked}
            onChange={onChange}
            label={label}
            {...(className ? { className } : {})}
        />
    );
};
