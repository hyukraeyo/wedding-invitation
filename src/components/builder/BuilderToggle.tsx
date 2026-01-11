import { Switch } from './Switch';

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
        <Switch
            checked={checked}
            onChange={onChange}
            label={label}
            {...(className ? { className } : {})}
        />
    );
};
