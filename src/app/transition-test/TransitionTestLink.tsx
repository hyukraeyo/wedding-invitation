"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MouseEvent, ReactNode, useCallback, useTransition } from "react";
import styles from "./TransitionTestLink.module.scss";
import { cn } from "@/lib/utils";

type TransitionTestLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

const isModifiedClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

const shouldUseViewTransition = () => {
  if (typeof document === "undefined") {
    return false;
  }

  const viewTransition = (
    document as Document & { startViewTransition?: (callback: () => void) => void }
  ).startViewTransition;

  if (!viewTransition) {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default function TransitionTestLink({
  href,
  children,
  className,
}: TransitionTestLinkProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.defaultPrevented || isModifiedClick(event)) {
        return;
      }

      event.preventDefault();

      const navigate = () => {
        startTransition(() => {
          router.push(href);
        });
      };

      if (shouldUseViewTransition()) {
        (document as Document & { startViewTransition: (callback: () => void) => void })
          .startViewTransition(() => {
            navigate();
          });
        return;
      }

      navigate();
    },
    [href, router, startTransition]
  );

  return (
    <Link href={href} className={cn(styles.link, className)} onClick={handleClick}>
      {children}
    </Link>
  );
}
