-- ============================================================================
-- Migration: Fix Security Advisor Warnings
-- Description: 
--  1. Enable RLS on next_auth tables.
--  2. Restrict overly broad policies to specific roles (service_role).
--  3. Cleanup redundant and insecure legacy policies.
-- ============================================================================

-- 1. Enable RLS on next_auth tables
-- Previously these were explicitly disabled, which triggers security warnings.
ALTER TABLE next_auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.verification_tokens ENABLE ROW LEVEL SECURITY;

-- 2. Add explicit service_role policies for next_auth
-- Security advisor prefers explicit policies even if service_role bypasses RLS by default.
CREATE POLICY "Service role full access on users" ON next_auth.users TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on accounts" ON next_auth.accounts TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on sessions" ON next_auth.sessions TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on verification_tokens" ON next_auth.verification_tokens TO service_role USING (true) WITH CHECK (true);

-- 3. Fix invitations table policies
-- Drop the legacy broad policy that applied to ALL roles (including anon)
DROP POLICY IF EXISTS "Allow service role full access" ON public.invitations;
DROP POLICY IF EXISTS "Users can manage their own invitations" ON public.invitations;

-- Explicitly allow service_role if needed (though it bypasses RLS)
CREATE POLICY "Service role full access on invitations" 
    ON public.invitations 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

-- Ensure public read access is explicitly for anon and authenticated
DROP POLICY IF EXISTS "Allow public read access" ON public.invitations;
CREATE POLICY "Allow public read access" 
    ON public.invitations 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

-- 4. Fix storage.objects policies
-- The previous "Service Role Access" policy was missing "TO service_role", 
-- making it apply to everyone.
DROP POLICY IF EXISTS "Service Role Access" ON storage.objects;
CREATE POLICY "Service Role Access" 
    ON storage.objects 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

-- Ensure public access to invitations bucket is explicitly for anon/authenticated
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
    ON storage.objects 
    FOR SELECT 
    TO anon, authenticated 
    USING ( bucket_id = 'invitations' );
