import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders main heading correctly', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/달콤한 시작/);
    expect(heading).toHaveTextContent(/바나나웨딩/);
  });

  it('renders description text', () => {
    render(<Home />);
    expect(
      screen.getByText(/유통기한 없는 우리만의 달콤한 이야기/)
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
    expect(screen.getByText(/© 2026 banana wedding/i)).toBeInTheDocument();
  });
});
