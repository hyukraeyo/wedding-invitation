const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]:not([aria-disabled="true"])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(', ');

interface OpenAutoFocusOptions {
  onOpenAutoFocus?: ((event: Event) => void) | undefined;
  preferContainerOnPrevented?: boolean | undefined;
}

function focusContainer(container: HTMLElement) {
  if (!container.hasAttribute('tabindex')) {
    container.setAttribute('tabindex', '-1');
  }

  container.focus({ preventScroll: true });
}

function findFirstFocusableElement(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).find((element) => {
    if (element.getAttribute('aria-hidden') === 'true') return false;
    if (element.closest('[aria-hidden="true"]')) return false;
    if (element.closest('[inert]')) return false;
    return true;
  });
}

export function handleOpenAutoFocusFallback(
  event: Event,
  container: HTMLElement | null,
  options: OpenAutoFocusOptions = {}
) {
  const { onOpenAutoFocus, preferContainerOnPrevented = true } = options;

  onOpenAutoFocus?.(event);

  if (!container) return;
  if (container.contains(document.activeElement)) return;

  const shouldPreferContainer = event.defaultPrevented && preferContainerOnPrevented;
  event.preventDefault();

  if (!shouldPreferContainer) {
    const firstFocusableElement = findFirstFocusableElement(container);
    if (firstFocusableElement) {
      firstFocusableElement.focus({ preventScroll: true });
      return;
    }
  }

  focusContainer(container);
}
