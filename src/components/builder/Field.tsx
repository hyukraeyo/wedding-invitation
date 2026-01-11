import { cn } from '@/lib/utils';
import { Label } from './Label';

interface FieldProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string | undefined;
    required?: boolean | undefined;
    description?: string | undefined;
}

export const Field = ({ label, children, className, required, description }: FieldProps) => {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex flex-col gap-1.5">
                <Label required={!!required}>
                    {label}
                </Label>
                {description && (
                    <p className="text-[0.8rem] text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
};
