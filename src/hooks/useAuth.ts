"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session with error handling
        supabase.auth.getSession()
            .then(({ data: { session }, error }) => {
                if (error) {
                    // If refresh token is invalid, clear the session
                    if (error.message.includes('refresh_token') || error.message.includes('Refresh Token')) {
                        supabase.auth.signOut({ scope: 'local' }).catch(() => { });
                        setUser(null);
                    }
                    console.warn('Supabase auth session error:', error.message);
                } else {
                    setUser(session?.user ?? null);
                }
            })
            .catch((err) => {
                console.error('Unexpected auth error:', err);
            })
            .finally(() => {
                setLoading(false);
            });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                setUser(session?.user ?? null);
            } else if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
}
