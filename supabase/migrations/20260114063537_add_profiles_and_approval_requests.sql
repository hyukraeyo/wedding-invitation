-- ============================================================================
-- Migration: Add Profiles and Approval Requests Tables
-- Description: Creates profiles table with auto-creation trigger and 
--              approval_requests table for managing invitation approvals
-- Best Practices Applied:
--   - Separate profiles table linked to auth.users (Supabase recommended)
--   - Automatic profile creation via trigger on user signup
--   - Comprehensive RLS policies for security
--   - Idempotent statements (IF NOT EXISTS)
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- Stores additional user information not available in auth.users
-- Linked via foreign key to auth.users(id)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    is_profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profile information extending auth.users';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN public.profiles.full_name IS 'User display name';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number for contact';
COMMENT ON COLUMN public.profiles.is_admin IS 'Admin flag for privileged access';
COMMENT ON COLUMN public.profiles.is_profile_complete IS 'Flag to track if user completed profile setup';

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES RLS POLICIES
-- ============================================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Allow insert during trigger execution (service role handles this)
-- The trigger runs with SECURITY DEFINER so it bypasses RLS
CREATE POLICY "Enable insert for authenticated users on their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Policy: Admin can view all profiles (for admin dashboard)
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- ============================================================================
-- 2. AUTOMATIC PROFILE CREATION TRIGGER
-- Creates a profile record when a new user signs up
-- Extracts name from OAuth metadata if available
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, is_admin)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'nickname'
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        -- Set admin flag for specific email
        CASE WHEN NEW.email = 'admin@test.com' THEN TRUE ELSE FALSE END
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. APPROVAL_REQUESTS TABLE
-- Stores approval requests from users for their invitations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    invitation_slug TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requester_name TEXT NOT NULL,
    requester_phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.approval_requests IS 'Tracks invitation approval requests from users';
COMMENT ON COLUMN public.approval_requests.status IS 'pending, approved, or rejected';
COMMENT ON COLUMN public.approval_requests.reviewed_by IS 'Admin who reviewed the request';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_approval_requests_user_id ON public.approval_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_invitation_id ON public.approval_requests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON public.approval_requests(status);

-- Enable RLS
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- APPROVAL_REQUESTS RLS POLICIES
-- ============================================================================

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own approval requests"
    ON public.approval_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Users can create their own requests
CREATE POLICY "Users can create own approval requests"
    ON public.approval_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all requests
CREATE POLICY "Admins can view all approval requests"
    ON public.approval_requests FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Policy: Admins can update any request (for approval/rejection)
CREATE POLICY "Admins can update approval requests"
    ON public.approval_requests FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- ============================================================================
-- 4. UPDATED_AT TRIGGER
-- Automatically updates the updated_at column on row update
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply updated_at trigger to profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply updated_at trigger to approval_requests
DROP TRIGGER IF EXISTS set_approval_requests_updated_at ON public.approval_requests;
CREATE TRIGGER set_approval_requests_updated_at
    BEFORE UPDATE ON public.approval_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. HELPER FUNCTION: Check if user profile is complete
-- Returns true if both full_name and phone are filled
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_profile_complete(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_complete BOOLEAN;
BEGIN
    SELECT 
        (full_name IS NOT NULL AND full_name != '' AND phone IS NOT NULL AND phone != '')
    INTO profile_complete
    FROM public.profiles
    WHERE id = user_id;
    
    RETURN COALESCE(profile_complete, FALSE);
END;
$$;
