"use client";

import { useRouter } from "next/navigation";
import Link, { LinkProps } from "next/link";
import { MouseEvent, ReactNode, useCallback, useTransition } from "react";

interface ViewTransitionLinkProps extends LinkProps {
    children: ReactNode;
    className?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * 브라우저의 View Transition API를 활용하여 부드러운 페이지 전환을 지원하는 링크 컴포넌트입니다.
 * 최신 Next.js 및 React 19의 Concurrent Rendering(useTransition)과 결합되어 최적의 성능을 제공합니다.
 */
export function ViewTransitionLink({
    href,
    children,
    className,
    onClick,
    ...props
}: ViewTransitionLinkProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLAnchorElement>) => {
            // 보조 클릭(우클릭, Ctrl+클릭 등)인 경우 기본 동작 허용
            if (
                event.defaultPrevented ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
            ) {
                return;
            }

            event.preventDefault();

            // 클릭 즉시 로딩바 표시 이벤트 발생
            window.dispatchEvent(new Event('routeChangeStart'));

            // 사용자 정의 onClick 핸들러가 있으면 실행
            if (onClick) {
                onClick(event);
            }

            const navigate = () => {
                // router.push를 직접 호출하여 즉각적인 응답성을 확보합니다.
                // (useTransition을 사용하면 서버 응답을 기다리느라 0.5초 지연이 발생합니다.)
                router.push(href.toString());
            };

            // View Transition API 지원 여부 확인
            const doc = document as any;
            if (typeof doc.startViewTransition === "function") {
                doc.startViewTransition(() => {
                    navigate();
                });
            } else {
                navigate();
            }
        },
        [href, router, onClick]
    );

    return (
        <Link
            href={href}
            className={className}
            onClick={handleClick}
            data-pending={isPending}
            {...props}
        >
            {children}
        </Link>
    );
}

ViewTransitionLink.displayName = "ViewTransitionLink";
