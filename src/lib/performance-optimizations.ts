import { useRef } from 'react';

export function useDerivedState<T>(
  getValue: () => T,
  dependency: T
): T {
  const ref = useRef(dependency);

  if (ref.current !== dependency) { // eslint-disable-line react-hooks/refs
    ref.current = dependency; // eslint-disable-line react-hooks/refs
  }

  return ref.current; // eslint-disable-line react-hooks/refs
}

const expensiveCalculations = new Map<string, unknown>();

export function cachedCalculation<T>(
  key: string,
  calculation: () => T
): T {
  if (expensiveCalculations.has(key)) {
    return expensiveCalculations.get(key) as T;
  }

  const result = calculation();
  expensiveCalculations.set(key, result);
  return result;
}

export function useLatest<T>(value: T): { current: T } {
  const ref = useRef(value);
  ref.current = value; // eslint-disable-line react-hooks/refs
  return ref;
}

export function loadDeferredAnalytics() {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      if (process.env.NEXT_PUBLIC_GA_ID) {
      }
    }, 2000);
  }
}

export function batchStyleChanges(
  element: HTMLElement,
  styles: Record<string, string>
) {
  const styleString = Object.entries(styles)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');

  element.style.cssText = styleString;
}

import React from 'react';

export const StaticElements = {
  LoadingSpinner: React.createElement(
    'div',
    { className: 'loading-spinner', 'aria-label': 'Loading...' },
    React.createElement('div', { className: 'spinner-ring' })
  ),
  ErrorBoundary: React.createElement(
    'div',
    { className: 'error-boundary' },
    React.createElement('p', null, 'Something went wrong. Please try again.')
  )
};