import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

const authMocks = vi.hoisted(() => ({
  setSession: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: authMocks,
  },
}));

function TestComponent() {
  useAuth();
  return null;
}

describe('useAuth hash session hydration', () => {
  beforeEach(() => {
    authMocks.setSession.mockResolvedValue({ error: null });
    authMocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    authMocks.onAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe: vi.fn() },
      },
    });
    window.history.pushState({}, '', '/login#access_token=token&refresh_token=refresh');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    authMocks.setSession.mockReset();
    authMocks.getSession.mockReset();
    authMocks.onAuthStateChange.mockReset();
    authMocks.signOut.mockReset();
  });

  it('sets session and clears hash', async () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    render(<TestComponent />);

    await waitFor(() => {
      expect(authMocks.setSession).toHaveBeenCalledWith({
        access_token: 'token',
        refresh_token: 'refresh',
      });
    });

    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/login');
  });

  it('clears hash even when setSession fails', async () => {
    authMocks.setSession.mockResolvedValue({ error: { message: 'fail' } });
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    render(<TestComponent />);

    await waitFor(() => {
      expect(authMocks.setSession).toHaveBeenCalled();
    });

    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/login');
  });
});
