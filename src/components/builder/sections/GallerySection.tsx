import React from 'react';
import dynamic from 'next/dynamic';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import type { SectionProps } from '@/types/builder';
import styles from './GallerySection.module.scss';

const GallerySectionContent = dynamic(() => import('./GallerySectionContent'), {
    loading: () => (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
        </div>
    ),
    ssr: false
});

const GallerySection = React.memo<SectionProps>(function GallerySection({ value, isOpen }) {

    return (
        <AccordionItem value={value} autoScroll>
            <AccordionTrigger>
                웨딩 갤러리
            </AccordionTrigger>
            <AccordionContent>
                {isOpen ? <GallerySectionContent /> : null}
            </AccordionContent>
        </AccordionItem>
    );
});

export default GallerySection;
