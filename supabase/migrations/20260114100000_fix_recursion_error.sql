-- ============================================================================
-- Migration: Fix Infinite Recursion in RLS
-- Description: 
--   The previous policy defined on 'profiles' table queried the 'profiles' table itself
--   to check for admin status. This caused an infinite recursion (stack overflow) in Postgres RLS.
--   Solution: Use a SECURITY DEFINER function to check admin status bypassing RLS.
-- ============================================================================

-- 1. Create a secure function to check admin status
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres/admin),
-- bypassing RLS checks on the tables it accesses.
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$;

-- 2. Update profiles policy to use the function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id OR
        check_is_admin()
    );

-- 3. Update invitations policy to use the function (Cleaner and safer)
DROP POLICY IF EXISTS "Users and admins can manage invitations" ON public.invitations;

CREATE POLICY "Users and admins can manage invitations"
    ON public.invitations FOR ALL
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        check_is_admin()
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        check_is_admin()
    );

-- 4. Update approval_requests policies to use the function
DROP POLICY IF EXISTS "Admins can view all approval requests" ON public.approval_requests;
CREATE POLICY "Admins can view all approval requests"
    ON public.approval_requests FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );
-- Note: keeping existing logic for approval_requests is fine if it doesn't cause recursion, 
-- but consistent use of check_is_admin() is better. 
-- However, approval_requests table does NOT recurse into itself, it queries profiles.
-- Querying profiles is what triggered the recursion on profiles table. 
-- So YES, we MUST use check_is_admin() here too, because "SELECT 1 FROM profiles" triggers profiles RLS!

DROP POLICY IF EXISTS "Admins can view all approval requests" ON public.approval_requests;
CREATE POLICY "Admins can view all approval requests"
    ON public.approval_requests FOR SELECT
    TO authenticated
    USING ( check_is_admin() );

DROP POLICY IF EXISTS "Admins can update approval requests" ON public.approval_requests;
CREATE POLICY "Admins can update approval requests"
    ON public.approval_requests FOR UPDATE
    TO authenticated
    USING ( check_is_admin() )
    WITH CHECK ( check_is_admin() );
