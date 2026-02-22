import type { SupabaseClient } from '@supabase/supabase-js';
import { INVITATION_SUMMARY_SELECT, toInvitationSummary } from '@/lib/invitation-summary';
import type { InvitationSummaryRow } from '@/lib/invitation-summary';
import { InvitationData } from '@/store/useInvitationStore';

/**
 * Server-side invitation service
 * Used by Server Components and Server Actions
 * Only accepts injected Supabase server client
 */
export const serverInvitationService = {
  async saveInvitation(
    slug: string,
    data: InvitationData,
    client: SupabaseClient,
    userId?: string
  ) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    const { data: result, error } = await client
      .from('invitations')
      .upsert(
        {
          slug,
          invitation_data: data,
          user_id: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select();

    if (error) throw error;
    return result;
  },

  async getAllInvitations(client: SupabaseClient) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    const { data, error } = await client
      .from('invitations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUserInvitations(userId: string, client: SupabaseClient) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    const { data, error } = await client
      .from('invitations')
      .select(INVITATION_SUMMARY_SELECT)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    const rows = (data ?? []) as unknown as InvitationSummaryRow[];
    return rows.map(toInvitationSummary);
  },

  async getInvitation(slug: string, client: SupabaseClient) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    const { data, error } = await client
      .from('invitations')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  async getInvitationsBySlugs(slugs: string[], client: SupabaseClient) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    if (!slugs.length) return [];

    const { data, error } = await client.from('invitations').select('*').in('slug', slugs);

    if (error) throw error;
    return data || [];
  },

  async getInvitationsByIds(ids: string[], client: SupabaseClient) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    if (!ids.length) return [];

    const { data, error } = await client
      .from('invitations')
      .select(INVITATION_SUMMARY_SELECT)
      .in('id', ids);

    if (error) throw error;
    const rows = (data ?? []) as unknown as InvitationSummaryRow[];
    return rows.map(toInvitationSummary);
  },

  async deleteInvitation(client: SupabaseClient, id: string) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    const { error } = await client.from('invitations').delete().eq('id', id);

    if (error) throw error;
  },

  async markNotificationAsRead(client: SupabaseClient, id: string) {
    if (!client) {
      throw new Error('Server client is required for serverInvitationService');
    }

    const { data: inv, error: fetchError } = await client
      .from('invitations')
      .select('invitation_data')
      .eq('id', id)
      .single();

    if (fetchError || !inv) throw fetchError || new Error('Invitation not found');

    const updatedData = {
      ...inv.invitation_data,
      hasNewRejection: false,
      hasNewApproval: false,
    };

    const { error: updateError } = await client
      .from('invitations')
      .update({ invitation_data: updatedData })
      .eq('id', id);

    if (updateError) throw updateError;
    return true;
  },
};
