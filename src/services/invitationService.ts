import { supabase } from '@/lib/supabase';
import { InvitationData } from '@/store/useInvitationStore';

export const invitationService = {
    async saveInvitation(slug: string, data: InvitationData, userId?: string) {
        const { data: result, error } = await supabase
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

    async getAllInvitations() {
        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getUserInvitations(userId: string) {
        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getInvitation(slug: string) {
        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null;
        return data;
    },

    async deleteInvitation(id: string) {
        const { error } = await supabase
            .from('invitations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
