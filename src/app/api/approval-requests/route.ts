import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { APPROVAL_REQUEST_SUMMARY_SELECT } from '@/lib/approval-request-summary';
import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';
import { auth } from '@/auth';
import { z } from 'zod';
import { createRejectionReason } from '@/lib/rejection-helpers';

const requestSchema = z.object({
  invitationId: z.string().uuid(),
  invitationSlug: z.string().min(1),
  requesterName: z.string().min(1),
  requesterPhone: z.string().min(1),
});

const rejectSchema = z.object({
  invitationId: z.string().uuid(),
  rejectionReason: z.string().min(1),
});

const approveSchema = z.object({
  invitationId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const bodyPromise = request.json();
    const sessionPromise = auth();
    const [body, session] = await Promise.all([bodyPromise, sessionPromise]);
    const validatedData = requestSchema.parse(body);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient(session);
    const db = supabaseAdmin || supabase;

    // Check for existing pending request to prevent duplicates
    const { data: existingRequest } = await db
      .from('approval_requests')
      .select(APPROVAL_REQUEST_SUMMARY_SELECT)
      .eq('invitation_id', validatedData.invitationId)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { success: true, data: existingRequest as unknown as ApprovalRequestSummary },
        { status: 200 }
      );
    }

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
      .select(APPROVAL_REQUEST_SUMMARY_SELECT)
      .single();

    if (error) {
      console.error('Error creating approval request:', error);
      return NextResponse.json(
        { error: '승인 신청 저장에 실패했어요.', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data as unknown as ApprovalRequestSummary },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않아요.', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unexpected error in POST /api/approval-requests:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user ?? null;
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userOnly = searchParams.get('userOnly') === 'true';

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

    const db = supabaseAdmin || supabase;

    if (userOnly) {
      // User fetching their own rejected requests
      const { data, error } = await db
        .from('approval_requests')
        .select(APPROVAL_REQUEST_SUMMARY_SELECT)
        .eq('user_id', user.id)
        .eq('status', 'rejected')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user approval requests:', error);
        return NextResponse.json(
          { error: '승인 요청 목록을 불러오는데 실패했어요.', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: (data ?? []) as unknown as ApprovalRequestSummary[],
      });
    }

    // Admin fetching all requests (pending, rejected, approved)
    if (!isAdmin) {
      return NextResponse.json({ error: '접근 권한이 없어요.' }, { status: 403 });
    }

    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error } = await db
      .from('approval_requests')
      .select(APPROVAL_REQUEST_SUMMARY_SELECT)
      .in('status', ['pending', 'rejected', 'approved'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching approval requests:', error);
      return NextResponse.json(
        { error: '승인 요청 목록을 불러오는데 실패했어요.', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: (data ?? []) as unknown as ApprovalRequestSummary[],
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/approval-requests:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const bodyPromise = request.json();
    const sessionPromise = auth();
    const [body, session] = await Promise.all([bodyPromise, sessionPromise]);
    const validatedData = rejectSchema.parse(body);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
    }

    const isEmailAdmin = session.user?.email === 'admin@test.com';
    const supabase = await createSupabaseServerClient(session);
    let isAdmin = isEmailAdmin;

    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      isAdmin = profile?.is_admin || false;
    }

    if (!isAdmin) {
      return NextResponse.json({ error: '접근 권한이 없어요.' }, { status: 403 });
    }

    const db = supabaseAdmin || supabase;

    // Check current status to determine if it's a rejection or revocation
    const { data: currentRequest } = await db
      .from('approval_requests')
      .select('id, status')
      .eq('invitation_id', validatedData.invitationId)
      .in('status', ['pending', 'approved'])
      .maybeSingle();

    if (!currentRequest) {
      return NextResponse.json(
        { error: '처리할 승인 요청 내역을 찾을 수 없어요.' },
        { status: 404 }
      );
    }

    // DB가 canceled 상태를 지원하지 않는 것으로 추정되므로 status는 rejected로 통일하고
    // 대신 rejection_reason에 마커를 추가하여 구분함 (유틸리티 사용)
    const isRevocation = currentRequest.status === 'approved';
    const finalReason = createRejectionReason(validatedData.rejectionReason, isRevocation);

    const [deleteResult, invitationResult] = await Promise.all([
      db
        .from('approval_requests')
        .update({
          status: 'rejected',
          rejection_reason: finalReason,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', currentRequest.id),
      db.from('invitations').select('*').eq('id', validatedData.invitationId).single(),
    ]);

    if (deleteResult.error) {
      console.error('Error rejecting approval request:', deleteResult.error);
      return NextResponse.json({ error: '거절 처리에 실패했어요.' }, { status: 500 });
    }

    const invData = invitationResult.data;
    if (invData) {
      const newData = {
        ...invData.invitation_data,
        isRequestingApproval: false,
        isApproved: false,
        hasNewRejection: true, // Mark as new rejection for notification
      };
      await db
        .from('invitations')
        .update({ invitation_data: newData })
        .eq('id', validatedData.invitationId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않아요.', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unexpected error in PUT /api/approval-requests:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient(session);
    const db = supabaseAdmin || supabase;

    const [deleteResult, invitationResult] = await Promise.all([
      db.from('approval_requests').delete().eq('invitation_id', invitationId).eq('user_id', userId),
      db.from('invitations').select('*').eq('id', invitationId).single(),
    ]);

    if (deleteResult.error) {
      console.error('Error deleting approval request:', deleteResult.error);
      return NextResponse.json({ error: '신청 취소에 실패했어요.' }, { status: 500 });
    }

    const invData = invitationResult.data;
    if (invData) {
      const newData = { ...invData.invitation_data, isRequestingApproval: false };
      await db.from('invitations').update({ invitation_data: newData }).eq('id', invitationId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/approval-requests:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const bodyPromise = request.json();
    const sessionPromise = auth();
    const [body, session] = await Promise.all([bodyPromise, sessionPromise]);
    const validatedData = approveSchema.parse(body);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
    }

    // Check admin
    const isEmailAdmin = session.user?.email === 'admin@test.com';
    const supabase = await createSupabaseServerClient(session);
    let isAdmin = isEmailAdmin;

    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      isAdmin = profile?.is_admin || false;
    }

    if (!isAdmin) {
      return NextResponse.json({ error: '관리자만 사용할 수 있어요.' }, { status: 403 });
    }

    const db = supabaseAdmin || supabase;

    // Update approval_requests status to approved
    const [updateResult, invitationResult] = await Promise.all([
      db
        .from('approval_requests')
        .update({
          status: 'approved',
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('invitation_id', validatedData.invitationId)
        .eq('status', 'pending'),
      db.from('invitations').select('*').eq('id', validatedData.invitationId).single(),
    ]);

    if (updateResult.error) {
      console.error('Error approving request:', updateResult.error);
      return NextResponse.json({ error: '승인 처리에 실패했어요.' }, { status: 500 });
    }

    const invData = invitationResult.data;
    if (invData) {
      const newData = {
        ...invData.invitation_data,
        isApproved: true,
        isRequestingApproval: false,
        hasNewRejection: false, // Clear rejection flag if approved
        hasNewApproval: true, // Mark as new approval for notification
      };

      await Promise.all([
        db
          .from('invitations')
          .update({ invitation_data: newData })
          .eq('id', validatedData.invitationId),
        // Clean up old rejected requests for this invitation when approved
        db
          .from('approval_requests')
          .delete()
          .eq('invitation_id', validatedData.invitationId)
          .eq('status', 'rejected'),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않아요.', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unexpected error in PATCH /api/approval-requests:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 });
  }
}
