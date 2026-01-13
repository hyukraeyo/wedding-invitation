import { env } from '@/lib/env';

import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'test',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  },
}));

describe('Environment Validation', () => {
  it('should have all required environment variables', () => {
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
  });

  it('should have valid URL format', () => {
    const urlPattern = /^https?:\/\/.+/;
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toMatch(urlPattern);
    expect(env.NEXT_PUBLIC_APP_URL).toMatch(urlPattern);
  });

  it('should have valid NODE_ENV', () => {
    expect(['development', 'production', 'test']).toContain(env.NODE_ENV);
  });

  it('should have optional Sentry variables', () => {
    expect(env.NEXT_PUBLIC_SENTRY_DSN).toBeUndefined();
    expect(env.SENTRY_DSN).toBeUndefined();
  });
});
