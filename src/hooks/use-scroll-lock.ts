import { useEffect } from 'react';

interface ScrollLockOptions {
  containerSelector?: string;
  usePreviousSibling?: boolean;
}

export function useScrollLock(isLocked: boolean, options: ScrollLockOptions = {}) {
  const { containerSelector, usePreviousSibling } = options;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const rootElement = containerSelector ? document.querySelector(containerSelector) : null;
    const scrollContainer = rootElement
      ? usePreviousSibling
        ? rootElement.previousElementSibling
        : rootElement
      : null;

    if (!isLocked) {
      const scrollY = document.body.getAttribute('data-scroll-lock-y');
      document.body.style.cssText = '';
      document.documentElement.style.overflow = '';
      document.body.removeAttribute('data-scroll-lock-y');

      if (scrollContainer instanceof HTMLElement) {
        scrollContainer.style.overflowY = 'auto';
      }

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }

      return;
    }

    const currentScrollY = window.scrollY;
    document.body.setAttribute('data-scroll-lock-y', currentScrollY.toString());
    document.body.style.cssText = `
      position: fixed;
      top: -${currentScrollY}px;
      left: 0;
      width: 100%;
      overflow: hidden;
    `;
    document.documentElement.style.overflow = 'hidden';

    if (scrollContainer instanceof HTMLElement) {
      scrollContainer.style.overflowY = 'hidden';
    }

    return () => {
      const scrollY = document.body.getAttribute('data-scroll-lock-y');
      document.body.style.cssText = '';
      document.documentElement.style.overflow = '';
      document.body.removeAttribute('data-scroll-lock-y');

      if (scrollContainer instanceof HTMLElement) {
        scrollContainer.style.overflowY = 'auto';
      }

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
    };
  }, [isLocked, containerSelector, usePreviousSibling]);
}
