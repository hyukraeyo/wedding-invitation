import type { SupabaseClient } from '@supabase/supabase-js';
import { getBrowserSupabaseClient } from '@/lib/supabase';
import { InvitationData } from '@/store/useInvitationStore';

const getDefaultClient = async () => getBrowserSupabaseClient() as Promise<SupabaseClient>;

export const invitationService = {
    async saveInvitation(slug: string, data: InvitationData, userId?: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
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
        const supabaseClient = client ?? await getDefaultClient();
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
        return result.data;
    },

    async getUserInvitations(userId: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
        const { data, error } = await supabaseClient
            .from('invitations')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getInvitation(slug: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
        const { data, error } = await supabaseClient
            .from('invitations')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null;
        return data;
    },

    async deleteInvitation(id: string, client?: SupabaseClient) {
        const supabaseClient = client ?? await getDefaultClient();
        const { error } = await supabaseClient
            .from('invitations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
