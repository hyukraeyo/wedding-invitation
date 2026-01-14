import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const requestSchema = z.object({
  invitationId: z.string().uuid(),
  invitationSlug: z.string().min(1),
  requesterName: z.string().min(1),
  requesterPhone: z.string().min(1),
  userId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    // 서버사이드에서는 supabaseAdmin 사용 (있으면), 없으면 일반 클라이언트 사용
    const db = supabaseAdmin || supabase;

    const { data, error } = await db
      .from('approval_requests')
      .insert({
        invitation_id: validatedData.invitationId,
        invitation_slug: validatedData.invitationSlug,
        requester_name: validatedData.requesterName,
        requester_phone: validatedData.requesterPhone,
        user_id: validatedData.userId,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating approval request:', error);
      return NextResponse.json(
        { error: '승인 신청 저장에 실패했습니다.', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unexpected error in POST /api/approval-requests:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 서버사이드에서는 supabaseAdmin 사용 (있으면)
    const db = supabaseAdmin || supabase;

    const { data, error } = await db
      .from('approval_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approval requests:', error);
      return NextResponse.json(
        { error: '승인 요청 목록을 불러오는데 실패했습니다.', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected error in GET /api/approval-requests:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

