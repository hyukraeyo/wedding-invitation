'use client';

import { useEffect } from 'react';

/**
 * Manages all body-level side effects when the gallery lightbox is open:
 * - Sets `data-gallery-fullscreen-open` attribute on body
 * - Locks background scroll by freezing overflow/overscroll/touch-action
 *
 * Automatically cleans up on close or unmount.
 */
export function useLightboxEffects(isOpen: boolean) {
  // Notify outer mobile preview shell (Builder Drawer) that gallery fullscreen is active.
  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.setAttribute('data-gallery-fullscreen-open', 'true');

    return () => {
      document.body.removeAttribute('data-gallery-fullscreen-open');
    };
  }, [isOpen]);

  // Lock background scroll while lightbox is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const lockTargets = [document.documentElement, document.body];
    const snapshots = lockTargets.map((element) => ({
      element,
      overflow: element.style.overflow,
      overscrollBehavior: element.style.overscrollBehavior,
      touchAction: element.style.touchAction,
    }));

    snapshots.forEach(({ element }) => {
      element.style.overflow = 'hidden';
      element.style.overscrollBehavior = 'none';
      element.style.touchAction = 'none';
    });

    return () => {
      snapshots.forEach(({ element, overflow, overscrollBehavior, touchAction }) => {
        element.style.overflow = overflow;
        element.style.overscrollBehavior = overscrollBehavior;
        element.style.touchAction = touchAction;
      });
    };
  }, [isOpen]);
}
