import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { HeaderAction } from '@/components/common/HeaderAction';
import { SampleList } from '@/components/ui/SampleList';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { MAIN_TITLE_SAMPLES } from '@/constants/samples';
import styles from './MainScreenSection.module.scss';

import { ResponsiveModal } from '@/components/common/ResponsiveModal';

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



    const handleSelectSample = (sample: SamplePhraseItem) => {
        setMainScreen({ title: sample.title });
        setIsSampleModalOpen(false);
    };

    return (
        <>
            <AccordionItem value={value} autoScroll>
                <AccordionTrigger
                    action={
                        <HeaderAction
                            icon={Sparkles}
                            label="추천 문구"
                            onClick={() => setIsSampleModalOpen(true)}
                        />
                    }
                >
                    메인 화면
                </AccordionTrigger>
                <AccordionContent>
                    {isOpen ? <MainScreenSectionContent /> : null}
                </AccordionContent>
            </AccordionItem >

            {/* Sample Titles Modal */}
            < ResponsiveModal
                open={isSampleModalOpen}
                onOpenChange={setIsSampleModalOpen}
                title="추천 제목 문구"
                useScrollFade={true}
            >
                <SampleList
                    items={MAIN_TITLE_SAMPLES}
                    onSelect={handleSelectSample}
                />
            </ResponsiveModal >
        </>
    );
}
