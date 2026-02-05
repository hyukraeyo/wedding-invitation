'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ViewTransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string | undefined;
  onClick?: ((event: React.MouseEvent<HTMLAnchorElement>) => void) | undefined;
  id?: string | undefined;
  style?: React.CSSProperties | undefined;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  prefetchMode?: 'auto' | 'hover' | 'none';
}

/**
 * 釉뚮씪?곗???View Transition API瑜??쒖슜?섏뿬 遺?쒕윭???섏씠吏 ?꾪솚??吏?먰븯??留곹겕 而댄룷?뚰듃?낅땲??
 * 理쒖떊 Next.js 諛?React 19??Concurrent Rendering(useTransition)怨?寃고빀?섏뼱 理쒖쟻???깅뒫???쒓났?⑸땲??
 */
export function ViewTransitionLink({
  href,
  children,
  className,
  onClick,
  target,
  rel,
  prefetchMode = 'hover',
  ...props
}: ViewTransitionLinkProps) {
  const router = useRouter();
  const hasPrefetchedRef = React.useRef(false);

  const isExternalHref = React.useCallback((value: string) => {
    return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
  }, []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // 보조 클릭(우클릭), Ctrl+클릭 등일 경우 기본 동작 허용
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

      // 사용자 정의 onClick 핸들러가 있으면 실행
      if (onClick) {
        onClick(event);
      }

      if (event.defaultPrevented) return;

      const hrefValue = href.toString();
      if (target === '_blank' || isExternalHref(hrefValue)) {
        return;
      }

      event.preventDefault();

      // 클릭 즉시 로딩바 표시 이벤트 발생
      window.dispatchEvent(new Event('routeChangeStart'));

      const navigate = () => {
        // router.push瑜?吏곸젒 ?몄텧?섏뿬 利됯컖?곸씤 ?묐떟?깆쓣 ?뺣낫?⑸땲??
        // (useTransition???ъ슜?섎㈃ ?쒕쾭 ?묐떟??湲곕떎由щ뒓??0.5珥?吏?곗씠 諛쒖깮?⑸땲??)
        router.push(href.toString());
      };

      // View Transition API 吏???щ? ?뺤씤
      const vtDocument = document as unknown as { startViewTransition?: (cb: () => void) => void };
      if (typeof vtDocument.startViewTransition === 'function') {
        vtDocument.startViewTransition(() => {
          navigate();
        });
      } else {
        navigate();
      }
    },
    [href, router, onClick, target, isExternalHref]
  );

  const handlePrefetch = React.useCallback(() => {
    if (prefetchMode !== 'hover' || hasPrefetchedRef.current) return;
    if (target === '_blank' || isExternalHref(href.toString())) return;
    hasPrefetchedRef.current = true;
    router.prefetch(href.toString());
  }, [href, prefetchMode, router, target, isExternalHref]);

  const linkProps: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string } = {
    href,
    className,
    onClick: handleClick,
    ...(prefetchMode === 'auto' ? { prefetch: true } : {}),
    ...(prefetchMode === 'none' ? { prefetch: false } : {}),
  };

  if (prefetchMode === 'hover') {
    linkProps.onMouseEnter = handlePrefetch;
    linkProps.onFocus = handlePrefetch;
  }

  if (target) {
    linkProps.target = target;
  }

  if (rel) {
    linkProps.rel = rel;
  }

  return (
    <Link {...linkProps} {...props}>
      {children}
    </Link>
  );
}

ViewTransitionLink.displayName = 'ViewTransitionLink';
