-- ============================================================================
-- BACKFILL: 기존 사용자들의 프로필 레코드 생성
-- 이 스크립트는 Supabase 대시보드의 SQL Editor에서 실행하세요.
-- ============================================================================

-- 기존 auth.users에 있지만 profiles에 없는 사용자들의 프로필 생성
INSERT INTO public.profiles (id, full_name, avatar_url, is_admin)
SELECT 
    id,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        raw_user_meta_data->>'nickname'
    ),
    raw_user_meta_data->>'avatar_url',
    CASE WHEN email = 'admin@test.com' THEN TRUE ELSE FALSE END
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 결과 확인
SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.is_admin,
    p.is_profile_complete,
    u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;
