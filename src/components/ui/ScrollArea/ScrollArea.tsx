"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import styles from "./ScrollArea.module.scss"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
    useScrollFade?: boolean;
    viewportRef?: React.Ref<HTMLDivElement>;
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
    orientation?: "vertical" | "horizontal";
}

const ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    ScrollAreaProps
>(({ className, children, useScrollFade: useFade = false, viewportRef: externalViewportRef, onScroll, orientation = "vertical", ...props }, ref) => {
    const { setViewportRef, showTopFade, showBottomFade } = useScrollFade<HTMLDivElement>({
        enabled: useFade
    });

    // 🍌 Ref 동기화: useLayoutEffect를 사용하여 린트 오류(Immutability)를 회피하고 안전하게 전달
    const [viewportNode, setViewportNode] = React.useState<HTMLDivElement | null>(null);

    const handleViewportRef = React.useCallback((node: HTMLDivElement | null) => {
        setViewportNode(node);
        setViewportRef(node);
    }, [setViewportRef]);

    React.useLayoutEffect(() => {
        if (!externalViewportRef) return;

        if (typeof externalViewportRef === 'function') {
            externalViewportRef(viewportNode);
        } else {
            // eslint-disable-next-line react-hooks/immutability
            (externalViewportRef as React.MutableRefObject<HTMLDivElement | null>).current = viewportNode;
        }
    }, [externalViewportRef, viewportNode]);

    return (
        <ScrollAreaPrimitive.Root
            ref={ref}
            className={cn(styles.root, className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                ref={handleViewportRef}
                className={cn(
                    styles.viewport,
                    useFade && styles.scrollFadeContainer
                )}
                data-top-fade={useFade && showTopFade}
                data-bottom-fade={useFade && showBottomFade}
                onScroll={onScroll}
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar orientation={orientation} />
            <ScrollAreaPrimitive.Corner className={styles.corner} />
        </ScrollAreaPrimitive.Root>
    )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(styles.scrollbar, className)}
        {...props}
    >
        <ScrollAreaPrimitive.ScrollAreaThumb className={styles.thumb} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
