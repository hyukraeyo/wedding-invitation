import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SampleList } from '@/components/common/SampleList';
import { Button } from '@/components/ui/Button';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { Modal } from '@/components/ui/Modal';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import styles from './MainScreenSection.module.scss';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { MAIN_TITLE_SAMPLES } from '@/constants/samples';
import { SectionAccordion } from '@/components/ui/Accordion';

const MainScreenSectionContent = dynamic(() => import('./MainScreenSectionContent'), {
    loading: () => (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
        </div>
    ),
    ssr: false
});

export default function MainScreenSection(props: SectionProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const setMainScreen = useInvitationStore(state => state.setMainScreen);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const handleSelectSample = (sample: SamplePhraseItem) => {
        setMainScreen({ title: sample.title });
        setIsSampleModalOpen(false);
    };

    const renderSampleList = () => (
        <SampleList
            items={MAIN_TITLE_SAMPLES}
            onSelect={handleSelectSample}
        />
    );

    return (
        <>
            <SectionAccordion
                title="메인 화면"
                value="main"
                isOpen={props.isOpen}
                onToggle={props.onToggle}
            >
                <div style={{ paddingBottom: '16px' }}>
                    <div className={styles.sampleActionRow} style={{ padding: '0 24px 12px' }}>
                        <span className={styles.rowTitle}>추천 문구</span>
                        <Button
                            type="button"
                            variant="weak"
                            size="sm"
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSampleModalOpen(true);
                            }}
                        >
                            <Sparkles size={14} style={{ marginRight: '4px' }} />
                            <span>선택하기</span>
                        </Button>
                    </div>
                    {props.isOpen && <MainScreenSectionContent />}
                </div>
            </SectionAccordion>

            {isDesktop ? (
                <Modal
                    open={isSampleModalOpen}
                    onOpenChange={setIsSampleModalOpen}
                >
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header title="추천 제목 문구" />
                        <Modal.Body>
                            {renderSampleList()}
                        </Modal.Body>
                        <Modal.Footer>
                            <BottomCTA.Single
                                fixed={false}
                                onClick={() => setIsSampleModalOpen(false)}
                            >
                                닫기
                            </BottomCTA.Single>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            ) : (
                <BottomSheet
                    open={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    header="추천 제목 문구"
                    cta={
                        <BottomCTA.Single
                            fixed={false}
                            onClick={() => setIsSampleModalOpen(false)}
                        >
                            닫기
                        </BottomCTA.Single>
                    }
                >
                    <BottomSheet.Body>
                        {renderSampleList()}
                    </BottomSheet.Body>
                </BottomSheet>
            )}
        </>
    );
}
