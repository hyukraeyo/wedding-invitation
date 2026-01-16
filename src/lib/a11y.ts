export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const focusFirstFocusable = (container: HTMLElement | null): boolean => {
  if (!container) return false

  const focusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
  if (focusable) {
    focusable.focus()
    return true
  }

  if (container.getAttribute("tabindex") !== null) {
    container.focus()
    return true
  }

  return false
}
