import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'fill' | 'weak' | 'outline' | 'ghost' | 'link' | 'default' | undefined; // Extended types
    color?: 'primary' | 'dark' | 'danger' | 'accent' | undefined;
    size?: 'small' | 'medium' | 'large' | 'xlarge' | 'default' | 'sm' | 'lg' | 'icon' | undefined; // Extended types
    block?: boolean | undefined;
    loading?: boolean | undefined;
    children: React.ReactNode;
}

export const Button = ({
    variant = 'fill',
    color = 'primary',
    size = 'medium',
    block = false,
    loading = false,
    children,
    className,
    style,
    ...props
}: ButtonProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    // Map legacy props to shadcn props
    let shadcnVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" = "default";

    if (variant === 'weak') shadcnVariant = "secondary";
    else if (variant === 'outline') shadcnVariant = "outline";
    else if (variant === 'ghost') shadcnVariant = "ghost";
    else if (variant === 'link') shadcnVariant = "link";
    else if (variant === 'fill') {
        if (color === 'danger') shadcnVariant = "destructive";
        else shadcnVariant = "default"; // primary/dark/accent use default + style overrides
    }

    // Map size
    let shadcnSize: "default" | "sm" | "lg" | "icon" = "default";
    if (size === 'small' || size === 'sm') shadcnSize = "sm";
    else if (size === 'large' || size === 'lg') shadcnSize = "lg";
    else if (size === 'xlarge') shadcnSize = "lg"; // xlarge maps to lg for now
    else if (size === 'icon') shadcnSize = "icon";

    // Custom styles for colors
    const customStyle = { ...style };
    if (color === 'accent') {
        if (variant === 'fill') {
            customStyle.backgroundColor = accentColor;
            customStyle.color = 'white';
        } else if (variant === 'weak') {
            customStyle.backgroundColor = `${accentColor}1A`;
            customStyle.color = accentColor;
        } else if (variant === 'outline') {
            customStyle.borderColor = accentColor;
            customStyle.color = accentColor;
        }
    } else if (color === 'dark') {
        // If dark color is requested and variant is fill
        if (variant === 'fill') {
            // shadcn default is slightly dark/black usually, so we might keep it
            // or override with specific dark class
        }
    }

    return (
        <ShadcnButton
            variant={shadcnVariant}
            size={shadcnSize}
            className={cn(
                block && "w-full",
                color === 'dark' && variant === 'fill' && "bg-slate-800 hover:bg-slate-900 text-white",
                // Ensure loading state is visible if shadcn doesn't handle it natively the same way (Shadcn usually expects disabled + icon)
                loading && "opacity-70 cursor-not-allowed",
                className
            )}
            style={customStyle}
            disabled={props.disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {children}
                </div>
            ) : (
                children
            )}
        </ShadcnButton>
    );
};
