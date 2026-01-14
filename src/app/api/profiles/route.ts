import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const updateSchema = z.object({
    userId: z.string().uuid(),
    full_name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    avatar_url: z.string().url().optional().nullable(),
});

// GET /api/profiles?userId=xxx
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = supabaseAdmin || supabase;

        const { data, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', userId)
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
        const validatedData = updateSchema.parse(body);

        const { userId, ...updates } = validatedData;

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
            .eq('id', userId)
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
