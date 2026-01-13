import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders main heading correctly', () => {
    render(<Home />);
    expect(screen.getByText(/미니멀/)).toBeInTheDocument();
    expect(screen.getByText(/모바일 청첩장/)).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Home />);
    expect(
      screen.getByText(/복잡한 절차 없이, 감각적인 디자인으로/)
    ).toBeInTheDocument();
  });

  it('renders link to builder page', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /청첩장 만들기/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/builder');
  });

  it('renders copyright in footer', () => {
    render(<Home />);
    expect(screen.getByText(/© 2026 nano banana/i)).toBeInTheDocument();
  });
});
