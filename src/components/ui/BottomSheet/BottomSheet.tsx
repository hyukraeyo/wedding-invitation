'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import { clsx } from 'clsx';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import s from './BottomSheet.module.scss';

export interface BottomSheetRootProps {
    open?: boolean | undefined;
    onClose?: (() => void) | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    children: React.ReactNode;
}

export interface BottomSheetContentProps {
    className?: string | undefined;
    variant?: 'default' | 'floating';
    children: React.ReactNode;
}

export interface BottomSheetProps extends BottomSheetRootProps {
    header?: React.ReactNode | undefined;
    cta?: React.ReactNode | undefined;
    className?: string | undefined;
    variant?: 'default' | 'floating';
}

// Root component
const BottomSheetRoot = ({
    open,
    onClose,
    onOpenChange,
    children,
}: BottomSheetRootProps) => {
    return (
        <Drawer.Root
            open={!!open}
            onOpenChange={(val) => {
                onOpenChange?.(val);
                if (!val) onClose?.();
            }}
        >
            {children}
        </Drawer.Root>
    );
};

// Portal component
const BottomSheetPortal = Drawer.Portal;

// Overlay component
const BottomSheetOverlay = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof Drawer.Overlay>
>(({ className, ...props }, ref) => (
    <Drawer.Overlay ref={ref} className={clsx(s.overlay, className)} {...props} />
));
BottomSheetOverlay.displayName = 'BottomSheetOverlay';

// Content component
const BottomSheetContent = React.forwardRef<
    HTMLDivElement,
    BottomSheetContentProps & React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, variant = 'floating', children, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = React.useState(true);

    // Ref merging util
    const setRefs = React.useCallback((node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    }, [ref]);

    React.useEffect(() => {
        const node = internalRef.current;
        if (!node) return;

        const updateState = () => {
            const state = node.getAttribute('data-state');
            setIsActive(state !== 'closed');
        };

        updateState();
        const observer = new MutationObserver(updateState);
        observer.observe(node, { attributes: true, attributeFilter: ['data-state'] });
        return () => observer.disconnect();
    }, []);

    // 🍌 바텀시트 내부의 Swiper 등 제스처 충돌 요소에 대해 드래그 방지 속성 자동 부여
    React.useEffect(() => {
        const preventDragOnSwiper = () => {
            const element = internalRef.current;
            if (!element) return;

            // Swiper JS 컨테이너 클래스 감지 (.swiper, .swiper-container)
            // TimePicker 등에서 사용하는 Swiper가 바텀시트 드래그와 충돌하지 않도록 처리
            const swipers = element.querySelectorAll('.swiper, .swiper-container');
            swipers.forEach(swiper => {
                if (!swiper.hasAttribute('data-vaul-no-drag')) {
                    swiper.setAttribute('data-vaul-no-drag', 'true');
                }
            });
        };

        // 초기 실행
        preventDragOnSwiper();

        // 동적 렌더링 감지 (Swiper 초기화 타이밍 대응)
        const observer = new MutationObserver(() => preventDragOnSwiper());

        if (internalRef.current) {
            observer.observe(internalRef.current, {
                childList: true,
                subtree: true,
            });
        }

        return () => observer.disconnect();
    }, []);

    return (
        <Drawer.Content
            ref={setRefs}
            className={clsx(
                s.content,
                variant === 'floating' && s.floating,
                className
            )}
            {...props}
        >
            <div className={s.wrapper}>
                <div className={s.handle} />
                <VisuallyHidden>
                    <Drawer.Title>
                        {props['aria-label'] || 'Bottom Sheet'}
                    </Drawer.Title>
                    <Drawer.Description>
                        {props['aria-describedby'] || 'Bottom sheet description'}
                    </Drawer.Description>
                </VisuallyHidden>
                <React.Activity mode={isActive ? 'visible' : 'hidden'}>
                    {children}
                </React.Activity>
            </div>
        </Drawer.Content>
    );
});
BottomSheetContent.displayName = 'BottomSheetContent';

// Header component
export interface BottomSheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string | undefined;
    children?: React.ReactNode;
}

const BottomSheetHeader = ({
    children,
    className,
    title,
    ...props
}: BottomSheetHeaderProps) => (
    <div className={clsx(s.header, className)} {...props}>
        {title && <BottomSheetTitle>{title}</BottomSheetTitle>}
        {children}
    </div>
);
BottomSheetHeader.displayName = 'BottomSheetHeader';

// Title component
const BottomSheetTitle = React.forwardRef<
    HTMLHeadingElement,
    React.ComponentPropsWithoutRef<typeof Drawer.Title>
>(({ className, ...props }, ref) => (
    <Drawer.Title ref={ref} className={clsx(s.title, className)} {...props} />
));
BottomSheetTitle.displayName = 'BottomSheetTitle';

// Description component
const BottomSheetDescription = React.forwardRef<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<typeof Drawer.Description>
>(({ className, ...props }, ref) => (
    <Drawer.Description ref={ref} className={clsx(s.description, className)} {...props} />
));
BottomSheetDescription.displayName = 'BottomSheetDescription';

// Body component
const BottomSheetBody = ({
    children,
    className,
    padding = true,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { padding?: boolean }) => (
    <div className={clsx(s.body, !padding && s.noPadding, className)} {...props}>
        {children}
    </div>
);
BottomSheetBody.displayName = 'BottomSheetBody';

// Footer component
const BottomSheetFooter = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={clsx(s.footer, className)} {...props}>
        {children}
    </div>
);
BottomSheetFooter.displayName = 'BottomSheetFooter';

// Close component
const BottomSheetClose = Drawer.Close;

// Trigger component
const BottomSheetTrigger = Drawer.Trigger;

// Legacy API - 기존 사용법 유지
const BottomSheetLegacy = ({
    open,
    onClose,
    onOpenChange,
    children,
    header,
    cta,
    className,
    variant = 'floating'
}: BottomSheetProps) => {
    const activityMode = open === false ? 'hidden' : 'visible';

    return (
        <BottomSheetRoot open={open} onClose={onClose} onOpenChange={onOpenChange}>
            <BottomSheetPortal>
                <BottomSheetOverlay />
                <BottomSheetContent className={className} variant={variant}>
                    {header && (
                        typeof header === 'string' ? (
                            <BottomSheetHeader title={header} />
                        ) : (
                            <BottomSheetHeader>{header}</BottomSheetHeader>
                        )
                    )}
                    <React.Activity mode={activityMode}>
                        {children}
                    </React.Activity>
                    {cta && <BottomSheetFooter>{cta}</BottomSheetFooter>}
                </BottomSheetContent>
            </BottomSheetPortal>
        </BottomSheetRoot>
    );
};

export const BottomSheet = Object.assign(BottomSheetLegacy, {
    Root: BottomSheetRoot,
    Portal: BottomSheetPortal,
    Overlay: BottomSheetOverlay,
    Trigger: BottomSheetTrigger,
    Content: BottomSheetContent,
    Header: BottomSheetHeader,
    Title: BottomSheetTitle,
    Description: BottomSheetDescription,
    Body: BottomSheetBody,
    Footer: BottomSheetFooter,
    Close: BottomSheetClose,
});
