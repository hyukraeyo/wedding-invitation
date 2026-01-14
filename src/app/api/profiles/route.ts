import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateSchema = z.object({
    full_name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    avatar_url: z.string().url().optional().nullable(),
});

// GET /api/profiles
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

        const db = supabaseAdmin || supabase;

        const { data, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (error) {
            // 레코드가 없는 경우
            if (error.code === 'PGRST116') {
                return NextResponse.json({ success: true, data: null });
            }
            console.error('Error fetching profile:', error);
            return NextResponse.json(
                { error: '프로필 조회에 실패했습니다.', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Unexpected error in GET /api/profiles:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// PATCH /api/profiles
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const updates = updateSchema.parse(body);

        const supabase = await createSupabaseServerClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        // is_profile_complete 자동 계산
        const isComplete = !!(updates.full_name && updates.phone);

        const db = supabaseAdmin || supabase;

        const { data, error } = await db
            .from('profiles')
            .update({
                ...updates,
                is_profile_complete: isComplete,
                updated_at: new Date().toISOString(),
            })
            .eq('id', authData.user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            return NextResponse.json(
                { error: '프로필 업데이트에 실패했습니다.', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: '입력 데이터가 올바르지 않습니다.', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Unexpected error in PATCH /api/profiles:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

