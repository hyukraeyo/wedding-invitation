
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'next_auth' }
});

async function testConnection() {
    console.log('Testing connection to next_auth.users...');
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
        console.error('Error connecting:', error);
    } else {
        console.log('Success! Data:', data);
    }
}

testConnection();
