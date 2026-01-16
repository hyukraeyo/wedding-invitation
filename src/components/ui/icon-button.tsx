import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface IconButtonProps extends Omit<ButtonProps, "size" | "variant"> {
    /**
     * The icon to display from lucide-react
     */
    icon?: LucideIcon
    /**
     * Size of the button.
     * @default "md"
     */
    size?: "sm" | "md" | "lg" | "xl"
    /**
     * Color variant of the button.
     * @default "ghost"
     */
    variant?: "solid" | "line" | "ghost" | "secondary" | "outline" | "destructive" | "default"
}

/**
 * 아이콘 전용 버튼 컴포넌트.
 * 바나나웨딩 디자인 시스템의 터치 영역(48px)과 인터랙션 가이드를 준수합니다.
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, icon: Icon, size = "md", variant = "ghost", children, ...props }, ref) => {
        // Map custom size props to Button's size variants
        const sizeMap: Record<NonNullable<IconButtonProps["size"]>, NonNullable<ButtonProps["size"]>> = {
            sm: "icon-sm", // 32px
            md: "icon",    // 48px (Standard Touch Area)
            lg: "icon-lg", // 56px
            xl: "icon-lg",
        }

        // Map size to icon size
        const iconSizeMap = {
            sm: "h-4 w-4",
            md: "h-6 w-6",
            lg: "h-7 w-7",
            xl: "h-8 w-8",
        }

        const { loading, ...rest } = props;

        return (
            <Button
                variant={variant}
                size={sizeMap[size]}
                className={cn(
                    "rounded-full transition-transform duration-100 ease-in-out active:scale-[0.92]", // iOS/Toss Interaction
                    className
                )}
                ref={ref}
                loading={loading}
                {...rest}
            >
                {!loading && Icon ? <Icon className={cn(iconSizeMap[size as keyof typeof iconSizeMap])} /> : null}
                {children}
            </Button>
        )
    }
)
IconButton.displayName = "IconButton"

export { IconButton }
