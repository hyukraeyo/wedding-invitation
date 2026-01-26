import type { SupabaseClient } from '@supabase/supabase-js';
import { getBrowserSupabaseClient } from '@/lib/supabase';
import { INVITATION_SUMMARY_SELECT, toInvitationSummary } from '@/lib/invitation-summary';
import type { InvitationSummaryRow } from '@/lib/invitation-summary';
import { InvitationData } from '@/store/useInvitationStore';

/**
 * Client-side invitation service
 * Used by Client Components
 * Automatically uses browser Supabase client
 */
export const clientInvitationService = {
    async saveInvitation(slug: string, data: InvitationData, userId?: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getBrowserSupabaseClient();

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

    async getUserInvitations(userId: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getBrowserSupabaseClient();
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
        const supabaseClient = client ?? await getBrowserSupabaseClient();
        const { data, error } = await supabaseClient
            .from('invitations')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (error) return null;
        return data;
    },

    async getInvitationsBySlugs(slugs: string[], client?: SupabaseClient) {
        if (!slugs.length) return [];

        const supabaseClient = client ?? await getBrowserSupabaseClient();
        const { data, error } = await supabaseClient
            .from('invitations')
            .select('*')
            .in('slug', slugs);

        if (error) throw error;
        return data || [];
    },

    async getInvitationsByIds(ids: string[], client?: SupabaseClient) {
        if (!ids.length) return [];

        const supabaseClient = client ?? await getBrowserSupabaseClient();
        const { data, error } = await supabaseClient
            .from('invitations')
            .select(INVITATION_SUMMARY_SELECT)
            .in('id', ids);

        if (error) throw error;
        const rows = (data ?? []) as unknown as InvitationSummaryRow[];
        return rows.map(toInvitationSummary);
    },

    async deleteInvitation(id: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getBrowserSupabaseClient();
        const { error } = await supabaseClient
            .from('invitations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async markNotificationAsRead(id: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getBrowserSupabaseClient();
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