import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // supabaseAdmin이 없으면 서버 설정 오류
        if (!supabaseAdmin) {
            console.error('Supabase Service Role Key is missing.');
            return NextResponse.json(
                { error: '서버 설정 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        // Service Role Key를 사용하므로 RLS를 무시하고 삭제를 수행합니다.
        const { error } = await supabaseAdmin
            .from('invitations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting invitation (admin):', error);
            return NextResponse.json(
                { error: '청첩장 삭제에 실패했습니다.', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error in DELETE /api/admin/invitations/[id]:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
