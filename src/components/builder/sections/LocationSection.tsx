import React from 'react';
import dynamic from 'next/dynamic';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
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


    return (
        <AccordionItem value={value} autoScroll>
            <AccordionTrigger>
                예식 장소
            </AccordionTrigger>
            <AccordionContent>
                {isOpen ? <LocationSectionContent /> : null}
            </AccordionContent>
        </AccordionItem>
    );
});

export default LocationSection;
