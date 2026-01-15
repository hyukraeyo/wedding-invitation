-- ============================================================================
-- Migration: Add Naver ID to profiles for fast OAuth lookup
-- ============================================================================

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS naver_id TEXT;

COMMENT ON COLUMN public.profiles.naver_id IS 'Naver user id for OAuth linkage';

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_naver_id_unique
    ON public.profiles (naver_id)
    WHERE naver_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, is_admin, naver_id)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'nickname'
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        CASE WHEN NEW.email = 'admin@test.com' THEN TRUE ELSE FALSE END,
        NEW.raw_user_meta_data->>'naver_id'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        naver_id = COALESCE(public.profiles.naver_id, EXCLUDED.naver_id);
    RETURN NEW;
END;
$$;
