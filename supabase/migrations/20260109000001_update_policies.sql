-- Drop old broad policy if exists (it wasn't named in the first migration, but let's be safe)
-- The previous policy was: CREATE POLICY "Allow service role full access" ON invitations USING (true) WITH CHECK (true);

-- Allow authenticated users to manage their own invitations
CREATE POLICY "Users can manage their own invitations_v2" ON invitations
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
