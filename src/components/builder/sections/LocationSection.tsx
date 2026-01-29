import React from 'react';
import dynamic from 'next/dynamic';
import { BoardRow } from '@/components/ui/BoardRow';
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

const LocationSection = React.memo<SectionProps>(function LocationSection(props) {
    return (
        <BoardRow
            title="예식 장소"
            isOpened={props.isOpen}
            onOpen={() => props.onToggle?.(true)}
            onClose={() => props.onToggle?.(false)}
            icon={<BoardRow.ArrowIcon />}
        >
            {props.isOpen ? <LocationSectionContent /> : null}
        </BoardRow>
    );
});

export default LocationSection;
