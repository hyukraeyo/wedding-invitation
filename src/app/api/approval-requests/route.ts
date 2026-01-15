import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';
import { z } from 'zod';

const requestSchema = z.object({
  invitationId: z.string().uuid(),
  invitationSlug: z.string().min(1),
  requesterName: z.string().min(1),
  requesterPhone: z.string().min(1),
});


export async function POST(request: NextRequest) {
  try {
    const bodyPromise = request.json();
    const sessionPromise = auth();
    const [body, session] = await Promise.all([bodyPromise, sessionPromise]);
    const validatedData = requestSchema.parse(body);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = await createSupabaseServerClient(session);
    const db = supabaseAdmin || supabase;

    const { data, error } = await db
      .from('approval_requests')
      .insert({
        invitation_id: validatedData.invitationId,
        invitation_slug: validatedData.invitationSlug,
        requester_name: validatedData.requesterName,
        requester_phone: validatedData.requesterPhone,
        user_id: userId,
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
    const session = await auth();
    const user = session?.user ?? null;
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const isEmailAdmin = user.email === 'admin@test.com';
    const supabase = await createSupabaseServerClient(session);
    let isAdmin = isEmailAdmin;

    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      isAdmin = profile?.is_admin || false;
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: '접근 권한이 없습니다.' },
        { status: 403 }
      );
    }

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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = await createSupabaseServerClient(session);
    const db = supabaseAdmin || supabase;

    const [deleteResult, invitationResult] = await Promise.all([
      db
        .from('approval_requests')
        .delete()
        .eq('invitation_id', invitationId)
        .eq('user_id', userId),
      db
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single(),
    ]);

    if (deleteResult.error) {
      console.error('Error deleting approval request:', deleteResult.error);
      return NextResponse.json(
        { error: '신청 취소에 실패했습니다.' },
        { status: 500 }
      );
    }

    const invData = invitationResult.data;
    if (invData) {
      const newData = { ...invData.invitation_data, isRequestingApproval: false };
      await db
        .from('invitations')
        .update({ invitation_data: newData })
        .eq('id', invitationId);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/approval-requests:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
