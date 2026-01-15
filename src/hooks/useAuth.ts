"use client";

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import type { User } from 'next-auth';
import { Profile, profileService } from '@/services/profileService';

export function useAuth() {
    const { data: session, status } = useSession();
    const sessionUser = session?.user ?? null;
    const queryClient = useQueryClient();

    // 프로필 새로고침 함수 (외부에서 호출 가능)
    const {
        data: profileData,
        isFetching: profileFetching,
        refetch: refetchProfile,
    } = useQuery<Profile | null>({
        queryKey: ['profile', sessionUser?.id],
        queryFn: async () => {
            if (!sessionUser?.id) return null;
            return profileService.getProfile(sessionUser.id);
        },
        enabled: !!sessionUser?.id,
        staleTime: 60 * 1000,
    });

    const refreshProfile = useCallback(async () => {
        if (!sessionUser?.id) return;
        await refetchProfile();
    }, [refetchProfile, sessionUser?.id]);

    const signOut = async () => {
        queryClient.removeQueries({ queryKey: ['profile'] });
        await nextAuthSignOut({ callbackUrl: "/" });
    };

    const profile = sessionUser ? profileData ?? null : null;
    const isEmailAdmin = sessionUser?.email === 'admin@test.com';
    const isAdmin = !!sessionUser && (!!profile?.is_admin || isEmailAdmin);
    const isProfileComplete = !!(profile?.full_name && profile?.phone);

    return {
        user: sessionUser as User | null,
        profile,
        loading: status === "loading",
        profileLoading: !!sessionUser && profileFetching,
        isProfileComplete,
        isAdmin,
        signOut,
        refreshProfile,
    };
}
