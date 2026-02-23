async function test() {
  const dotenv = await import('dotenv');
  const { createClient } = await import('@supabase/supabase-js');

  dotenv.config({ path: '.env.local' });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { db: { schema: 'next_auth' } }
  );

  const { data, error } = await supabase
    .from('sessions')
    .select('*, users(*)')
    .limit(1);

  console.log('Data:', data);
  console.log('Error:', error);
}

void test();
