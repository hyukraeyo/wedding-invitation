import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';


const invitationSchema = z.object({
  groom: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
  bride: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  address: z.string(),
  slug: z.string().min(3).max(20),
});

export async function POST(request: NextRequest) {
  try {
    const bodyPromise = request.json();
    const supabasePromise = createSupabaseServerClient(null);
    const [body, supabase] = await Promise.all([bodyPromise, supabasePromise]);
    const validatedData = invitationSchema.parse(body);

    // Check if slug already exists
    const { data: existingSlug } = await supabase
      .from('invitations')
      .select('slug')
      .eq('slug', validatedData.slug)
      .single();

    if (existingSlug) {
      return NextResponse.json(
        { error: '이미 사용 중인 URL입니다. 다른 URL을 입력해주세요.' },
        { status: 409 }
      );
    }

    const { data: invitation, error: createError } = await supabase
      .from('invitations')
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating invitation:', { error: createError, data: validatedData });
      return NextResponse.json(
        { error: '청첩장 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: invitation }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unexpected error in POST /api/invitations:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'URL 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient(null);
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching invitation:', error);
      return NextResponse.json(
        { error: '청첩장을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invitation });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
