
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

// Client containing the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    // We need to access both public and next_auth schemas.
    // However, Supabase JS client handles one schema at a time usually in 'db' config.
    // But we can specify schema in .from('table', { schema: '...' }) if supported,
    // or just rely on the fact that service_role refers to tables directly if exposed.
    // Auth.js adapter uses 'next_auth' schema.
});

const ADMIN_EMAIL = 'sqwasd@naver.com';

async function cleanup() {
    console.log(`Starting cleanup... Preserving admin: ${ADMIN_EMAIL}`);

    // 1. Get all users from next_auth.users excluding admin
    // We need to query the 'next_auth' schema explicitly.
    const { data: usersToDelete, error: fetchError } = await supabase
        .schema('next_auth')
        .from('users')
        .select('id, email')
        .neq('email', ADMIN_EMAIL);

    if (fetchError) {
        console.error('Error fetching users:', fetchError);
        return;
    }

    if (!usersToDelete || usersToDelete.length === 0) {
        console.log('No users to delete.');
        return;
    }

    console.log(`Found ${usersToDelete.length} users to delete:`, usersToDelete.map(u => u.email));

    const userIds = usersToDelete.map(u => u.id);

    // 2. Delete from public.profiles
    console.log('Deleting from public.profiles...');
    const { error: profileError } = await supabase
        .schema('public') // Explicitly use public schema
        .from('profiles')
        .delete()
        .in('id', userIds);

    if (profileError) {
        console.error('Error deleting profiles:', profileError);
    } else {
        console.log('Deleted profiles.');
    }

    // 3. Delete from next_auth.users (This should cascade to accounts and sessions usually)
    console.log('Deleting from next_auth.users...');
    const { error: userError } = await supabase
        .schema('next_auth')
        .from('users')
        .delete()
        .in('id', userIds);

    if (userError) {
        console.error('Error deleting users:', userError);
    } else {
        console.log('Deleted users from next_auth schema.');
    }

    console.log('Cleanup complete.');
}

cleanup().catch(console.error);
