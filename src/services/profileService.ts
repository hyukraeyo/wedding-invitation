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
    /**
     * 프로필 업데이트 (API Route 사용)
     */
    async updateProfile(userId: string, updates: ProfileUpdatePayload): Promise<Profile> {
        try {
            const response = await fetch('/api/profiles', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '프로필 업데이트 실패');
            }

            const { data } = await response.json();
            return data as Profile;
        } catch (error) {
            console.error('Error updating profile via API:', error);
            throw error;
        }
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
