-- Disable RLS on Auth.js tables for service_role access
ALTER TABLE IF EXISTS next_auth.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS next_auth.accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS next_auth.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS next_auth.verification_tokens DISABLE ROW LEVEL SECURITY;
