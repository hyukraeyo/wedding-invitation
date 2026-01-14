const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndFixAdmin() {
    const email = 'admin@test.com'; // Admin email
    
    console.log(`Checking user: ${email}`);
    
    // 1. Get user ID from email
    const { data: users, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Error listing users:', authError);
        return;
    }
    
    const user = users.users.find(u => u.email === email);
    if (!user) {
        console.error(`User ${email} not found.`);
        return;
    }
    
    const userId = user.id;
    console.log(`Found user ID: ${userId}`);
    
    // 2. Check profile
    let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        // If recursion error happens here, it's because service role is also subject to some RLS? 
        // No, service role bypasses RLS.
    }
    
    if (!profile) {
        console.log('Profile missing. Creating one...');
        const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                full_name: 'Test Admin',
                is_admin: true,
                is_profile_complete: true
            })
            .select()
            .single();
            
        if (insertError) {
            console.error('Error creating profile:', insertError);
        } else {
            console.log('Profile created successfully with admin rights.');
        }
    } else {
        console.log('Profile exists. Updating to admin...');
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', userId);
            
        if (updateError) {
            console.error('Error updating profile:', updateError);
        } else {
            console.log('Profile updated to admin successfully.');
        }
    }
}

checkAndFixAdmin();
