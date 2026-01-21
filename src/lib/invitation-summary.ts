// PostgREST syntax for aliasing JSON fields: alias:field
export const INVITATION_SUMMARY_SELECT = [
  'id',
  'slug',
  'updated_at',
  'user_id',
  'image_url:invitation_data->>imageUrl',
  'main_title:invitation_data->mainScreen->>title',
  'main_image:invitation_data->mainScreen->>image',
  'gallery:invitation_data->gallery',
  'date:invitation_data->>date',
  'location:invitation_data->>location',
  'address:invitation_data->>address',
  'is_approved:invitation_data->>isApproved',
  'is_requesting_approval:invitation_data->>isRequestingApproval',
  'has_new_rejection:invitation_data->>hasNewRejection',
  'has_new_approval:invitation_data->>hasNewApproval',
  'kakao_share:invitation_data->kakaoShare',
].join(', ');

export interface InvitationSummaryData {
  imageUrl: string | null;
  mainScreen: {
    title: string;
    image?: string | null;
  };
  gallery?: string[];
  date: string;
  location: string;
  address?: string;
  isApproved: boolean;
  isRequestingApproval: boolean;
  hasNewRejection?: boolean;
  hasNewApproval?: boolean;
  kakaoShare?: {
    title?: string;
    description?: string;
    imageUrl?: string | null;
    buttonType?: 'none' | 'location' | 'rsvp';
  };
}

export interface InvitationSummaryRecord {
  id: string;
  slug: string;
  invitation_data: InvitationSummaryData;
  updated_at: string;
  user_id: string;
}

export interface InvitationSummaryRow {
  id: string;
  slug: string;
  updated_at: string;
  user_id: string;
  image_url: string | null;
  main_title: string | null;
  main_image: string | null;
  gallery: string[] | null; // JSONB array
  date: string | null;
  location: string | null;
  address: string | null;
  is_approved: boolean | string | null;
  is_requesting_approval: boolean | string | null;
  has_new_rejection: boolean | string | null;
  has_new_approval: boolean | string | null;
  kakao_share: {
    title?: string;
    description?: string;
    imageUrl?: string | null;
    buttonType?: 'none' | 'location' | 'rsvp';
  } | null;
}

const toBoolean = (value: boolean | string | null | undefined) =>
  value === true || value === 'true';

export const toInvitationSummary = (row: InvitationSummaryRow): InvitationSummaryRecord => ({
  id: row.id,
  slug: row.slug,
  updated_at: row.updated_at,
  user_id: row.user_id,
  invitation_data: {
    imageUrl: row.image_url ?? null,
    mainScreen: {
      title: row.main_title ?? '',
      image: row.main_image ?? null,
    },
    gallery: row.gallery ?? [],
    date: row.date ?? '',
    location: row.location ?? '',
    address: row.address ?? '',
    isApproved: toBoolean(row.is_approved),
    isRequestingApproval: toBoolean(row.is_requesting_approval),
    hasNewRejection: toBoolean(row.has_new_rejection),
    hasNewApproval: toBoolean(row.has_new_approval),
    ...(row.kakao_share ? { kakaoShare: row.kakao_share } : {}),
  },
});
