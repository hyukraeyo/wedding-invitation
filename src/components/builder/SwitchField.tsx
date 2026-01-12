import { Switch as ShadcnSwitch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string | undefined;
    className?: string | undefined; // Additional className for the container
    disabled?: boolean | undefined;
}

export const SwitchField = ({ checked, onChange, label, className, disabled }: SwitchProps) => {
    return (
        <div className={cn("flex items-center justify-between py-1", className)}>
            <div className="flex items-center space-x-2">
                <ShadcnSwitch
                    id={`switch-${label}`}
                    checked={checked}
                    onCheckedChange={onChange}
                    disabled={disabled}
                />
                {label && (
                    <Label htmlFor={`switch-${label}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </Label>
                )}
            </div>
        </div>
    );
};
