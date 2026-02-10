-- ============================================================================
-- Migration: Revoke anon table privileges on invitations
-- Description:
--   Explicitly block anon role at privilege level for public.invitations.
--   Public invitation rendering is performed by trusted server-side service_role.
-- ============================================================================

REVOKE ALL PRIVILEGES ON TABLE public.invitations FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.invitations FROM public;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.invitations TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.invitations TO service_role;
