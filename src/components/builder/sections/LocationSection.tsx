"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

const LocationSectionContent = dynamic(() => import('./LocationSectionContent'), {
    ssr: false,
    loading: () => (
        <div className="h-40 w-full rounded-xl bg-muted/20 animate-pulse" />
    ),
});

const LocationSection = React.memo<SectionProps>(function LocationSection({ value, isOpen }) {
    const address = useInvitationStore(state => state.address);

    return (
        <AccordionItem
            value={value}
            title="예식 장소"
            icon={MapPin}
            isOpen={isOpen}
            isCompleted={!!address}
        >
            {isOpen ? <LocationSectionContent /> : null}
        </AccordionItem>
    );
});

export default LocationSection;
