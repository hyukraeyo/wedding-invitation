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
// Service role key allows admin access to auth.admin methods
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const ADMIN_EMAIL = 'sqwasd@naver.com';

async function cleanupSupabaseAuth() {
  console.log(`Starting Supabase Auth cleanup... Preserving admin: ${ADMIN_EMAIL}`);

  // listUsers gets users from auth.users (the Supabase Auth table)
  // Note: It returns pages of users. If you have thousands, you need pagination.
  // Assuming small number for dev.
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing auth users:', listError);
    return;
  }

  if (!users || users.length === 0) {
    console.log('No auth users to delete.');
    return;
  }

  const usersToDelete = users.filter((u) => u.email !== ADMIN_EMAIL);

  if (usersToDelete.length === 0) {
    console.log('Only admin user exists. Nothing to delete.');
    return;
  }

  console.log(
    `Found ${usersToDelete.length} users to delete in auth.users:`,
    usersToDelete.map((u) => u.email)
  );

  for (const user of usersToDelete) {
    process.stdout.write(`Deleting ${user.email}... `);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`FAILED: ${deleteError.message}`);
    } else {
      console.log('OK');
    }
  }

  console.log('Supabase Auth cleanup complete.');
}

cleanupSupabaseAuth().catch(console.error);
