-- WARNING: This migration will DELETE ALL user data and invitations
-- This is a one-time cleanup migration

-- 1. Delete all approval requests (must be first due to foreign key constraints)
DELETE FROM public.approval_requests WHERE true;

-- 2. Delete all invitations
DELETE FROM public.invitations WHERE true;

-- 3. Delete all profiles
DELETE FROM public.profiles WHERE true;

-- 4. Delete all auth users (this will cascade delete related data)
DELETE FROM auth.users WHERE true;
