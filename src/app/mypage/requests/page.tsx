import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { approvalRequestService } from '@/services/approvalRequestService';
import { invitationService } from '@/services/invitationService';
import RequestsPageClient from './RequestsPageClient';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is admin
    const { data: profileData } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

    const isAdmin = profileData?.is_admin || false;

    if (!isAdmin) {
        redirect('/mypage');
    }

    // Fetch data for admin
    const [approvalRequests, adminInvitations] = await Promise.all([
        approvalRequestService.getAllRequests(),
        invitationService.getAdminInvitations()
    ]);

    return (
        <RequestsPageClient
            userId={user.id}
            initialApprovalRequests={approvalRequests}
            initialAdminInvitations={adminInvitations}
        />
    );
}
