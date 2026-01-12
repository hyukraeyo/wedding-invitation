import { cn } from '@/lib/utils';
import { Label } from './Label';

interface FieldProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string | undefined;
    required?: boolean | undefined;
    description?: string | undefined;
    error?: React.ReactNode;
    id?: string;
}

export const Field = ({ label, children, className, required, description, error, id }: FieldProps) => {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex flex-col gap-1.5">
                {label && (
                    <Label htmlFor={id} required={!!required}>
                        {label}
                    </Label>
                )}
                {children}
                {description && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", error && "text-destructive")}>
                        {description}
                    </p>
                )}
                {error && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};
