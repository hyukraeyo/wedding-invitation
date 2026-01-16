import React from 'react';
import dynamic from 'next/dynamic';
import { Image as ImageIcon } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

const GallerySectionContent = dynamic(() => import('./GallerySectionContent'), {
    ssr: false,
    loading: () => (
        <div className="h-40 w-full rounded-xl bg-muted/20 animate-pulse" />
    ),
});

const GallerySection = React.memo<SectionProps>(function GallerySection({ value, isOpen }) {
    const gallery = useInvitationStore(state => state.gallery);
    return (
        <AccordionItem
            value={value}
            title="웨딩 갤러리"
            icon={ImageIcon}
            isOpen={isOpen}
            isCompleted={gallery.length > 0}
        >
            {isOpen ? <GallerySectionContent /> : null}
        </AccordionItem>
    );
});

export default GallerySection;
