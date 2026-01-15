import { getBrowserSupabaseClient } from '@/lib/supabase';

export interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    naver_id?: string | null;
    is_admin: boolean;
    is_profile_complete: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdatePayload {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    is_profile_complete?: boolean;
}

export const profileService = {
    /**
     * 현재 사용자의 프로필 조회
     */
    async getProfile(userId: string): Promise<Profile | null> {
        try {
            const supabase = await getBrowserSupabaseClient();
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // 레코드가 없거나 테이블이 없는 경우 등 모든 에러에서 null 반환
                // PGRST116: 레코드 없음, 42P01: 테이블 없음
                if (error.code === 'PGRST116' || error.code === '42P01') {
                    return null;
                }
                // 다른 에러도 로깅만 하고 null 반환 (앱 크래시 방지)
                console.warn('Profile fetch warning:', error.code, error.message);
                return null;
            }

            return data as Profile;
        } catch (err) {
            // 네트워크 에러 등 예외 상황
            console.warn('Profile fetch exception:', err);
            return null;
        }
    },

    /**
     * 프로필 업데이트 (없으면 생성)
     */
    async updateProfile(userId: string, updates: ProfileUpdatePayload): Promise<Profile> {
        const currentProfile = await this.getProfile(userId);
        const fullName = updates.full_name ?? currentProfile?.full_name ?? null;
        const phone = updates.phone ?? currentProfile?.phone ?? null;
        const isComplete = !!(fullName && phone);

        const supabase = await getBrowserSupabaseClient();
        // upsert 사용: 프로필이 없으면 생성, 있으면 업데이트
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...updates,
                is_profile_complete: isComplete,
            }, {
                onConflict: 'id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            throw error;
        }

        return data as Profile;
    },

    /**
     * 프로필이 완성되었는지 확인
     */
    async isProfileComplete(userId: string): Promise<boolean> {
        const profile = await this.getProfile(userId);
        if (!profile) return false;

        return !!(profile.full_name && profile.phone);
    },

    /**
     * 관리자 여부 확인
     */
    async isAdmin(userId: string): Promise<boolean> {
        const profile = await this.getProfile(userId);
        return profile?.is_admin ?? false;
    },
};
