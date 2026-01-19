-- WARNING: This script will DELETE ALL user data and invitations
-- Use with caution! This action cannot be undone.

-- 1. Delete all approval requests (must be first due to foreign key constraints)
DELETE FROM public.approval_requests;

-- 2. Delete all guests
DELETE FROM public.guests;

-- 3. Delete all invitations
DELETE FROM public.invitations;

-- 4. Delete all profiles
DELETE FROM public.profiles;

-- 5. Delete all auth users (this will cascade delete related data)
-- Note: This requires admin privileges
DELETE FROM auth.users;

-- Verify deletion
SELECT 
    (SELECT COUNT(*) FROM public.approval_requests) as approval_requests_count,
    (SELECT COUNT(*) FROM public.guests) as guests_count,
    (SELECT COUNT(*) FROM public.invitations) as invitations_count,
    (SELECT COUNT(*) FROM public.profiles) as profiles_count,
    (SELECT COUNT(*) FROM auth.users) as users_count;
