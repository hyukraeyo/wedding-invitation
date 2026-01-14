import { Switch as ShadcnSwitch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
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
        <div
            className={cn(
                "flex items-center justify-between py-2.5 px-1 rounded-lg transition-colors cursor-pointer active:bg-accent/50 group select-none",
                disabled && "cursor-not-allowed opacity-50",
                className
            )}
            onClick={() => !disabled && onChange(!checked)}
        >
            <div className="flex items-center justify-between w-full">
                {label && (
                    <Label
                        className="text-[15px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
                        onClick={(e) => {
                            e.preventDefault(); // Prevent double trigger since parent has onClick
                        }}
                    >
                        {label}
                    </Label>
                )}
                <ShadcnSwitch
                    checked={checked}
                    onCheckedChange={() => {
                        // This might be redundant if the parent handles it, 
                        // but good for accessibility if they use keyboard.
                    }}
                    disabled={disabled}
                    className="pointer-events-none" // Parent handles click
                />
            </div>
        </div>
    );
};
