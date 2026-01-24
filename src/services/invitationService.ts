import type { SupabaseClient } from '@supabase/supabase-js';
import { INVITATION_SUMMARY_SELECT, toInvitationSummary } from '@/lib/invitation-summary';
import type { InvitationSummaryRecord, InvitationSummaryRow } from '@/lib/invitation-summary';
import { getBrowserSupabaseClient } from '@/lib/supabase';
import { InvitationData } from '@/store/useInvitationStore';

const getDefaultClient = async () => getBrowserSupabaseClient() as Promise<SupabaseClient>;

export const invitationService = {
    async saveInvitation(slug: string, data: InvitationData, userId?: string, client?: SupabaseClient) {
        // async-dependencies: Start client promise early
        const clientPromise = client ? Promise.resolve(client) : getDefaultClient();
        const supabaseClient = await clientPromise;
        
        const { data: result, error } = await supabaseClient
            .from('invitations')
            .upsert({
                slug,
                invitation_data: data,
                user_id: userId,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'slug' })
            .select();

        if (error) throw error;
        return result;
    },

    async getAllInvitations(client?: SupabaseClient) {
        const clientPromise = client ? Promise.resolve(client) : getDefaultClient();
        const supabaseClient = await clientPromise;
        
        const { data, error } = await supabaseClient
            .from('invitations')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getAdminInvitations() {
        const response = await fetch('/api/admin/invitations');
        if (!response.ok) {
            throw new Error('Failed to fetch admin invitations');
        }
        const result = await response.json();
        return result.data as InvitationSummaryRecord[];
    },

    async getUserInvitations(userId: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
        const { data, error } = await supabaseClient
            .from('invitations')
            .select(INVITATION_SUMMARY_SELECT)
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        const rows = (data ?? []) as unknown as InvitationSummaryRow[];
        return rows.map(toInvitationSummary);
    },

    async getInvitation(slug: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
        const { data, error } = await supabaseClient
            .from('invitations')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (error) return null;
        return data;
    },

async getInvitationsBySlugs(slugs: string[], client?: SupabaseClient) {
        // js-length-check-first: Check array length before expensive operation
        if (!slugs.length) return [];
        
        const clientPromise = client ? Promise.resolve(client) : getDefaultClient();
        const supabaseClient = await clientPromise;
        
        const { data, error } = await supabaseClient
            .from('invitations')
            .select('*')
            .in('slug', slugs);

        if (error) throw error;
        return data || [];
    },

    async getInvitationsByIds(ids: string[], client?: SupabaseClient) {
        // js-length-check-first: Check array length before expensive operation
        if (!ids.length) return [];
        
        const clientPromise = client ? Promise.resolve(client) : getDefaultClient();
        const supabaseClient = await clientPromise;
        
        const { data, error } = await supabaseClient
            .from('invitations')
            .select(INVITATION_SUMMARY_SELECT)
            .in('id', ids);

        if (error) throw error;
        const rows = (data ?? []) as unknown as InvitationSummaryRow[];
        return rows.map(toInvitationSummary);
    },

    async deleteInvitation(id: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
        const { error } = await supabaseClient
            .from('invitations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async markNotificationAsRead(id: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
        // Fetch current data first to avoid overriding everything
        const { data: inv, error: fetchError } = await supabaseClient
            .from('invitations')
            .select('invitation_data')
            .eq('id', id)
            .single();

        if (fetchError || !inv) throw fetchError || new Error('Invitation not found');

        const updatedData = {
            ...inv.invitation_data,
            hasNewRejection: false,
            hasNewApproval: false
        };

        const { error: updateError } = await supabaseClient
            .from('invitations')
            .update({ invitation_data: updatedData })
            .eq('id', id);

        if (updateError) throw updateError;
        return true;
    }
};
