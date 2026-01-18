import React from 'react';
import { MapPin } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import LocationSectionContent from './LocationSectionContent';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

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
