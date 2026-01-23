import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

import { GreetingSkeleton } from './Skeletons';

const GreetingSectionContent = dynamic(() => import('./GreetingSectionContent'), {
    loading: () => <GreetingSkeleton />,
    ssr: false
});

import { ResponsiveModal } from '@/components/common/ResponsiveModal';

import { SampleList } from '@/components/ui/SampleList';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import { HeaderAction } from '@/components/common/HeaderAction';
import { useShallow } from 'zustand/react/shallow';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { GREETING_SAMPLES } from '@/constants/samples';

export default function GreetingSection({ isOpen, value }: SectionProps) {
    const {
        message,
        setMessage,
        setGreetingTitle,
        setGreetingSubtitle,
    } = useInvitationStore(useShallow((state) => ({
        message: state.message,
        setMessage: state.setMessage,
        setGreetingTitle: state.setGreetingTitle,
        setGreetingSubtitle: state.setGreetingSubtitle,
    })));

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const handleSelectSample = (sample: SamplePhraseItem) => {
        setGreetingSubtitle(sample.subtitle || '');
        setGreetingTitle(sample.title);
        setMessage(sample.content);
        setIsSampleModalOpen(false);
    };

    return (
        <>
            <AccordionItem
                value={value}
                title="인사말"
                icon={MessageSquare}
                isOpen={isOpen}
                isCompleted={message.length > 0}
                action={
                    <HeaderAction
                        icon={Sparkles}
                        label="추천 문구"
                        onClick={() => {
                            setIsSampleModalOpen(true);
                        }}
                    />
                }
            >
                {isOpen ? <GreetingSectionContent /> : null}

            </AccordionItem>

            {/* Sample Phrases Modal */}
            <ResponsiveModal
                open={isSampleModalOpen}
                onOpenChange={setIsSampleModalOpen}
                title="인사말 추천 문구"
                useScrollFade={true}
            >
                <SampleList
                    items={GREETING_SAMPLES}
                    onSelect={handleSelectSample}
                />
            </ResponsiveModal>
        </>
    );
}
