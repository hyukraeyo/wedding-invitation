import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { BoardRow } from '@/components/ui/BoardRow';
import { HeaderAction } from '@/components/common/HeaderAction';
import { SampleList } from '@/components/common/SampleList';
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

export default function MainScreenSection(props: SectionProps) {

    const setMainScreen = useInvitationStore(state => state.setMainScreen);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);



    const handleSelectSample = (sample: SamplePhraseItem) => {
        setMainScreen({ title: sample.title });
        setIsSampleModalOpen(false);
    };

    return (
        <>
            <>
                <BoardRow
                    title="메인 화면"
                    isOpened={props.isOpen}
                    onOpen={() => props.onToggle?.(true)}
                    onClose={() => props.onToggle?.(false)}
                    icon={<BoardRow.ArrowIcon />}
                >
                    {props.isOpen ? (
                        <div style={{ padding: '0 0 24px' }}>
                            <div style={{ padding: '0 24px 12px', display: 'flex', justifyContent: 'flex-end' }}>
                                <HeaderAction
                                    icon={Sparkles}
                                    label="추천 문구"
                                    onClick={() => {
                                        setIsSampleModalOpen(true);
                                    }}
                                />
                            </div>
                            <MainScreenSectionContent />
                        </div>
                    ) : null}
                </BoardRow>

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
        </>
    );
}
