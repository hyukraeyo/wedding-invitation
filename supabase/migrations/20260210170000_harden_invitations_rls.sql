-- ============================================================================
-- Migration: Harden invitations RLS for public launch
-- Description:
--   1. Remove legacy/broad policies that expose invitations to anon users.
--   2. Keep authenticated owner/admin access for app features.
--   3. Keep service_role full access for trusted server-side rendering.
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Remove legacy policies that may allow anonymous read/write
DROP POLICY IF EXISTS "Allow public read access" ON public.invitations;
DROP POLICY IF EXISTS "Allow service role full access" ON public.invitations;
DROP POLICY IF EXISTS "Service role full access on invitations" ON public.invitations;
DROP POLICY IF EXISTS "Users can manage their own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Users can manage their own invitations_v2" ON public.invitations;
DROP POLICY IF EXISTS "Users and admins can manage invitations" ON public.invitations;

-- Trusted backend access
CREATE POLICY "Service role full access on invitations"
  ON public.invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- App user access (owner + admin)
CREATE POLICY "Users and admins can manage invitations"
  ON public.invitations
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id
    OR check_is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id
    OR check_is_admin()
  );
