"use client";

import { useRef, useEffect } from 'react';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';

interface StoreHydratorProps {
    data: InvitationData;
}

export default function StoreHydrator({ data }: StoreHydratorProps) {
    const hasHydrated = useRef(false);

    useEffect(() => {
        if (!hasHydrated.current && data) {
            useInvitationStore.setState(data);
            hasHydrated.current = true;
        }
    }, [data]);

    return null;
}
