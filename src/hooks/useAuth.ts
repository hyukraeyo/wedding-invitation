"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { Profile, profileService } from '@/services/profileService';

interface AuthState {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    profileLoading: boolean;
    isProfileComplete: boolean;
    isAdmin: boolean;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        loading: true,
        profileLoading: false,
        isProfileComplete: false,
        isAdmin: false,
    });

    // 프로필 조회 함수
    const fetchProfile = useCallback(async (userId: string, userEmail?: string | null) => {
        setState(prev => ({ ...prev, profileLoading: true }));
        try {
            const profile = await profileService.getProfile(userId);
            const isComplete = !!(profile?.full_name && profile?.phone);
            const isEmailAdmin = userEmail === 'admin@test.com';
            const isAdmin = profile?.is_admin || isEmailAdmin || false;

            setState(prev => ({
                ...prev,
                profile,
                isProfileComplete: isComplete,
                isAdmin: isAdmin,
                profileLoading: false,
            }));
        } catch {
            setState(prev => ({ ...prev, profileLoading: false }));
        }
    }, []);

    // 프로필 새로고침 함수 (외부에서 호출 가능)
    const refreshProfile = useCallback(async () => {
        if (state.user) {
            await fetchProfile(state.user.id, state.user.email);
        }
    }, [state.user, fetchProfile]);

    useEffect(() => {
        const hydrateSession = async () => {
            if (typeof window !== 'undefined' && window.location.hash) {
                const hashParams = new URLSearchParams(window.location.hash.slice(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                    if (error) {
                        console.warn('Supabase auth session set error:', error.message);
                    }
                    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
                }
            }

            const response = await supabase.auth.getSession();
            const session = response.data.session as Session | null;
            const error = response.error;

            if (error) {
                if (error.message.includes('refresh_token') || error.message.includes('Refresh Token')) {
                    supabase.auth.signOut({ scope: 'local' }).catch(() => { });
                    setState(prev => ({ ...prev, user: null, profile: null, loading: false }));
                }
                console.warn('Supabase auth session error:', error.message);
                setState(prev => ({ ...prev, loading: false }));
            } else {
                const user = session?.user ?? null;
                setState(prev => ({ ...prev, user, loading: false }));
                if (user) {
                    fetchProfile(user.id, user.email);
                }
            }
        };

        hydrateSession().catch((err: unknown) => {
            console.error('Unexpected auth error:', err);
            setState(prev => ({ ...prev, loading: false }));
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            const user = session?.user ?? null;

            if (event === 'SIGNED_OUT') {
                setState(prev => ({
                    ...prev,
                    user: null,
                    profile: null,
                    isProfileComplete: false,
                    isAdmin: false,
                }));
            } else if (event === 'SIGNED_IN' && user) {
                setState(prev => ({ ...prev, user }));
                fetchProfile(user.id, user.email);
            } else if (event === 'USER_UPDATED' && user) {
                setState(prev => ({ ...prev, user }));
            } else if (user) {
                setState(prev => ({ ...prev, user }));
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return {
        user: state.user,
        profile: state.profile,
        loading: state.loading,
        profileLoading: state.profileLoading,
        isProfileComplete: state.isProfileComplete,
        isAdmin: state.isAdmin,
        signOut,
        refreshProfile,
    };
}
