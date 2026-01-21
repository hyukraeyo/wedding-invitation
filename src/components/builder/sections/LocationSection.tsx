import React from 'react';
import { MapPin } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import dynamic from 'next/dynamic';
import { AccordionItem } from '@/components/common/AccordionItem';
import type { SectionProps } from '@/types/builder';

const LocationSectionContent = dynamic(() => import('./LocationSectionContent'), {
    loading: () => <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>,
    ssr: false
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
