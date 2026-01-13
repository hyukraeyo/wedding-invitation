import { render, screen, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return Wrapper;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const Wrapper = options?.wrapper || createWrapper();
  return render(ui, { wrapper: Wrapper, ...options });
}

export function createMockStore<T>(initialState: T) {
  return (set: Partial<T> | ((state: T) => Partial<T>)) => ({
    ...initialState,
    ...(typeof set === 'function' ? set(initialState) : set),
  });
}

export { screen };
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
