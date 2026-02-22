import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseJwt } from '@/lib/supabase/jwt';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = await createSupabaseJwt(userId);
  return NextResponse.json({ token });
}
