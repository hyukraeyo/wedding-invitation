import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpTextProps {
    /** 표시할 메시지 */
    children: React.ReactNode;
    /** 스타일 변형 */
    variant?: 'info' | 'warning';
    /** 추가 className */
    className?: string;
    /** 아이콘 표시 여부 */
    showIcon?: boolean;
    /** 아이콘 크기 */
    iconSize?: number;
}

export const HelpText = ({
    children,
    variant = 'info',
    className,
    showIcon = true,
    iconSize = 14,
}: HelpTextProps) => {
    const Icon = variant === 'warning' ? AlertCircle : Info;

    return (
        <div className={cn(
            "flex items-start gap-1.5 text-xs py-1",
            variant === 'info' && "text-muted-foreground",
            variant === 'warning' && "text-destructive font-medium",
            className
        )}>
            {showIcon && <Icon size={iconSize} className="mt-0.5 shrink-0" />}
            <span className="leading-normal">{children}</span>
        </div>
    );
};

export default HelpText;
