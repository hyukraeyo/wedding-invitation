import React from 'react';
import { MapPin } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import dynamic from 'next/dynamic';
import { AccordionItem } from '@/components/common/AccordionItem';
import type { SectionProps } from '@/types/builder';
import styles from './LocationSection.module.scss';

const LocationSectionContent = dynamic(() => import('./LocationSectionContent'), {
    loading: () => (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
        </div>
    ),
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
