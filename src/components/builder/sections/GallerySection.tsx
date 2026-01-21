import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import dynamic from 'next/dynamic';
import { AccordionItem } from '@/components/common/AccordionItem';
import type { SectionProps } from '@/types/builder';

const GallerySectionContent = dynamic(() => import('./GallerySectionContent'), {
    loading: () => <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>,
    ssr: false
});

const GallerySection = React.memo<SectionProps>(function GallerySection({ value, isOpen }) {
    const gallery = useInvitationStore(useShallow(state => state.gallery));
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
