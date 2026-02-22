require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: "next_auth" } }
);

async function test() {
  const { data, error } = await supabase.from("sessions").select("*, users(*)").limit(1);
  console.log("Data:", data);
  console.log("Error:", error);
}
test();
