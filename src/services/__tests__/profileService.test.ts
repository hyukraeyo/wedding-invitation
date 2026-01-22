import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { profileService } from '@/services/profileService';

const dbMocks = vi.hoisted(() => ({
  single: vi.fn(),
  select: vi.fn(),
  upsert: vi.fn(),
  from: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  getBrowserSupabaseClient: vi.fn(async () => ({
    from: dbMocks.from,
  })),
}));

describe('profileService.updateProfile', () => {
  beforeEach(() => {
    dbMocks.single.mockResolvedValue({
      data: {
        id: 'user-1',
        full_name: 'Alice',
        phone: '01012345678',
        avatar_url: null,
        naver_id: null,
        is_admin: false,
        is_profile_complete: true,
        created_at: '',
        updated_at: '',
      },
      error: null,
    });
    dbMocks.select.mockReturnValue({ single: dbMocks.single });
    dbMocks.upsert.mockReturnValue({ select: dbMocks.select });
    dbMocks.from.mockReturnValue({ upsert: dbMocks.upsert });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    dbMocks.single.mockReset();
    dbMocks.select.mockReset();
    dbMocks.upsert.mockReset();
    dbMocks.from.mockReset();
  });

  it('keeps profile complete when only phone is updated', async () => {
    vi.spyOn(profileService, 'getProfile').mockResolvedValue({
      id: 'user-1',
      full_name: 'Alice',
      phone: null,
      avatar_url: null,
      naver_id: null,
      is_admin: false,
      is_profile_complete: false,
      created_at: '',
      updated_at: '',
    });

    await profileService.updateProfile('user-1', { phone: '01012345678' });

    expect(dbMocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-1',
        phone: '01012345678',
        is_profile_complete: true,
      })
    );
  });
});
