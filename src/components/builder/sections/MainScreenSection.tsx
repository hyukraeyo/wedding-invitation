import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { Home, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import { HeaderAction } from '@/components/common/HeaderAction';
import type { ExampleItem } from '@/components/common/ExampleSelectorModal';
import type { SectionProps } from '@/types/builder';
import { MAIN_TITLE_SAMPLES } from '@/constants/samples';
import styles from './MainScreenSection.module.scss';

const ExampleSelectorModal = dynamic(() => import('@/components/common/ExampleSelectorModal').then(mod => mod.ExampleSelectorModal), {
    ssr: false
});

const MainScreenSectionContent = dynamic(() => import('./MainScreenSectionContent'), {
    loading: () => (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
        </div>
    ),
    ssr: false
});

export default function MainScreenSection({ isOpen, value }: SectionProps) {
    const imageUrl = useInvitationStore(state => state.imageUrl);
    const setMainScreen = useInvitationStore(state => state.setMainScreen);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);



    const handleSelectSample = (sample: ExampleItem) => {
        setMainScreen({ title: sample.title });
        setIsSampleModalOpen(false);
    };

    return (
        <>
            <AccordionItem
                value={value}
                title="메인 화면"
                icon={Home}
                isOpen={isOpen}
                isCompleted={!!imageUrl}
                action={
                    <HeaderAction
                        icon={Sparkles}
                        label="추천 문구"
                        onClick={() => setIsSampleModalOpen(true)}
                    />
                }
            >
                {isOpen ? <MainScreenSectionContent /> : null}
            </AccordionItem>

            {/* Sample Titles Modal */}
            <ExampleSelectorModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                title="추천 제목 문구"
                items={MAIN_TITLE_SAMPLES}
                onSelect={handleSelectSample}
            />
        </>
    );
}
