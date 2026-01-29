import React from 'react';
import dynamic from 'next/dynamic';
import { BoardRow } from '@/components/ui/BoardRow';
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

const GallerySection = React.memo<SectionProps>(function GallerySection(props) {
    return (
        <BoardRow
            title="웨딩 갤러리"
            isOpened={props.isOpen}
            onOpen={() => props.onToggle?.(true)}
            onClose={() => props.onToggle?.(false)}
            icon={<BoardRow.ArrowIcon />}
        >
            {props.isOpen ? <GallerySectionContent /> : null}
        </BoardRow>
    );
});

export default GallerySection;
