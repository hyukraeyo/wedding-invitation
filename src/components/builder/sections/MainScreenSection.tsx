import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { Home, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import { HeaderAction } from '@/components/common/HeaderAction';
import type { ExampleItem } from '@/components/common/ExampleSelectorModal';

const ExampleSelectorModal = dynamic(() => import('@/components/common/ExampleSelectorModal').then(mod => mod.ExampleSelectorModal), {
    ssr: false
});

interface SectionProps {
    value: string;
    isOpen: boolean;
}

import MainScreenSectionContent from './MainScreenSectionContent';

export default function MainScreenSection({ isOpen, value }: SectionProps) {
    const imageUrl = useInvitationStore(state => state.imageUrl);
    const setMainScreen = useInvitationStore(state => state.setMainScreen);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const SAMPLE_TITLES = [
        { title: 'THE MARRIAGE', subtitle: '영문 타이틀' },
        { title: 'WEDDING INVITATION', subtitle: '영문 초대장' },
        { title: 'OUR WEDDING DAY', subtitle: '우리의 결혼식' },
        { title: 'WE ARE GETTING MARRIED', subtitle: '우리 결혼합니다 (영문)' },
        { title: 'SAVE THE DATE', subtitle: '날짜를 비워두세요' },
        { title: '결혼합니다', subtitle: '국문 심플' },
        { title: '우리 결혼해요', subtitle: '국문 데이트' },
        { title: '소중한 분들을 초대합니다', subtitle: '국문 정중' },
    ];

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
                items={SAMPLE_TITLES.map(s => ({
                    ...s,
                    content: s.subtitle,
                    badge: '추천'
                }))}
                onSelect={(item) => handleSelectSample(item)}
            />
        </>
    );
}
