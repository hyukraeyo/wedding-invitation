import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { render, screen } from '@/test-utils';
import { describe, it, expect, vi } from 'vitest';

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Children</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('renders fallback when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>Fallback Component</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback Component')).toBeInTheDocument();
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('calls onError callback when an error occurs', () => {
    const onError = vi.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary onError={onError} fallback={<div>Fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('resets error state after reset', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();

    screen.getByTestId('error-boundary-reset').click();

    rerender(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <div>No Error Now</div>
      </ErrorBoundary>
    );

    expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
    expect(screen.getByText('No Error Now')).toBeInTheDocument();
  });
});
