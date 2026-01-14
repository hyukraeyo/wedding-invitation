-- ============================================================================
-- Migration: Fix Admin Access and RLS
-- Description: 
--  1. Allows admins to see all invitations in the invitations table.
--  2. Ensures existing admin account has the is_admin flag set.
-- ============================================================================

-- 1. Ensure the user 'admin@test.com' is an admin in the profiles table.
-- This handles users who were created before the trigger was added.
UPDATE public.profiles
SET is_admin = TRUE
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'admin@test.com'
);

-- 2. Update RLS policies for invitations table
-- Drop the existing version 2 policy
DROP POLICY IF EXISTS "Users can manage their own invitations_v2" ON public.invitations;

-- Create a new policy that allows admins full access
CREATE POLICY "Users and admins can manage invitations"
    ON public.invitations FOR ALL
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- 3. (Optional but recommended) Ensure admins can view all profiles for management
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );
