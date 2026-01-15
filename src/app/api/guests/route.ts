import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';


const guestSchema = z.object({
  invitationId: z.string().uuid(),
  name: z.string().min(1),
  attending: z.boolean(),
  numberOfGuests: z.number().min(0).max(10),
  dietaryRestrictions: z.array(z.string()).optional(),
  specialRequests: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const bodyPromise = request.json();
    const supabasePromise = createSupabaseServerClient(null);
    const [body, supabase] = await Promise.all([bodyPromise, supabasePromise]);
    const validatedData = guestSchema.parse(body);

    // Check if guest already exists
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('invitation_id', validatedData.invitationId)
      .eq('name', validatedData.name)
      .single();

    if (existingGuest) {
      const { data: updatedGuest, error: updateError } = await supabase
        .from('guests')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingGuest.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating guest:', { error: updateError, data: validatedData });
        return NextResponse.json(
          { error: '참석 여부 업데이트에 실패했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: updatedGuest });
    }

    const { data: guest, error: createError } = await supabase
      .from('guests')
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating guest:', { error: createError, data: validatedData });
      return NextResponse.json(
        { error: '참석 여부 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unexpected error in POST /api/guests:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient(null);
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching guests:', error);
      return NextResponse.json(
        { error: '게스트 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: guests });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
