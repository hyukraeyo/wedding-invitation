import React from 'react';
import { renderWithProviders, waitFor } from '@/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

const sessionMocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

const profileMocks = vi.hoisted(() => ({
  getProfile: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: sessionMocks.useSession,
  signOut: sessionMocks.signOut,
}));

vi.mock('@/services/profileService', () => ({
  profileService: {
    getProfile: profileMocks.getProfile,
  },
}));

function TestComponent() {
  const { user, isProfileComplete, loading } = useAuth();
  return (
    <div
      data-testid="auth-state"
      data-user={user?.id ?? ''}
      data-complete={isProfileComplete ? 'yes' : 'no'}
      data-loading={loading ? 'yes' : 'no'}
    />
  );
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes loading state while session is loading', () => {
    sessionMocks.useSession.mockReturnValue({ data: null, status: 'loading' });
    const { getByTestId } = renderWithProviders(<TestComponent />);
    const node = getByTestId('auth-state');
    expect(node.getAttribute('data-loading')).toBe('yes');
  });

  it('loads profile when session is ready', async () => {
    sessionMocks.useSession.mockReturnValue({
      data: { user: { id: 'user-1', email: 'user@test.com' } },
      status: 'authenticated',
    });
    profileMocks.getProfile.mockResolvedValue({
      id: 'user-1',
      full_name: '홍길동',
      phone: '01012341234',
      avatar_url: null,
      is_admin: false,
      is_profile_complete: true,
      created_at: 'now',
      updated_at: 'now',
    });

    const { getByTestId } = renderWithProviders(<TestComponent />);
    await waitFor(() => {
      const node = getByTestId('auth-state');
      expect(node.getAttribute('data-user')).toBe('user-1');
      expect(node.getAttribute('data-complete')).toBe('yes');
    });
  });
});
