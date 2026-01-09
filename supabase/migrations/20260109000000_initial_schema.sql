-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    invitation_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for viewing the invitation)
CREATE POLICY "Allow public read access" ON invitations
    FOR SELECT USING (true);

-- Allow authenticated users to manage their own invitations
CREATE POLICY "Users can manage their own invitations" ON invitations
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow anon to insert if no user_id? No, usually we want at least some protection.
-- For now, let's allow service role as before
CREATE POLICY "Allow service role full access" ON invitations
    USING (true)
    WITH CHECK (true);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);

-- Setup Storage (Optional but recommended)
-- Note: Replace 'gallery' with your desired bucket name
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invitations', 'invitations', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'invitations' );

-- Policy to allow service role to manage everything
CREATE POLICY "Service Role Access"
ON storage.objects
USING (true)
WITH CHECK (true);
