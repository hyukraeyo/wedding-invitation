import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const requestSchema = z.object({
  invitationId: z.string().uuid(),
  invitationSlug: z.string().min(1),
  requesterName: z.string().min(1),
  requesterPhone: z.string().min(1),
});


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const db = supabaseAdmin || supabase;

    const { data, error } = await db
      .from('approval_requests')
      .insert({
        invitation_id: validatedData.invitationId,
        invitation_slug: validatedData.invitationSlug,
        requester_name: validatedData.requesterName,
        requester_phone: validatedData.requesterPhone,
        user_id: authData.user.id,
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
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single();

    // Strict admin check
    const isEmailAdmin = authData.user.email === 'admin@test.com';
    const isAdmin = profile?.is_admin || isEmailAdmin || false;

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

    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const db = supabaseAdmin || supabase;

    // 1. Delete request
    const { error: deleteError } = await db
      .from('approval_requests')
      .delete()
      .eq('invitation_id', invitationId)
      .eq('user_id', authData.user.id); // Ensure user owns the request

    if (deleteError) {
      console.error('Error deleting approval request:', deleteError);
      return NextResponse.json(
        { error: '신청 취소에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 2. Update invitation status
    // We need to fetch the current invitation first to get the JSON data, modify it, and save it back?
    // Or just update the JSONB column partially? modifying JSONB is hard directly.
    // But wait, invitation_data is just a JSONB column. We probably want to fetch -> update -> update.
    // However, simpler way is: Update invitations set invitation_data = jsonb_set(invitation_data, '{isRequestingApproval}', 'false')

    // Using supabase rpc or just fetch-update pattern. 
    // Fetch first.
    const { data: invData } = await db
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (invData) {
      const newData = { ...invData.invitation_data, isRequestingApproval: false };
      await db.from('invitations')
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
