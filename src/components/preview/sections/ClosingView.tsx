import React from 'react';
import Image from 'next/image';
import { useInvitationStore } from '@/store/useInvitationStore';
import SectionContainer from '../SectionContainer';

interface Props { id?: string; }

export default function ClosingView({ id }: Props) {
    const { closing } = useInvitationStore();

    if (!closing.imageUrl && !closing.content) return <div id={id} />;

    return (
        <SectionContainer id={id} className="w-full">
            <div className="flex flex-col items-center space-y-8">
                {/* Image Section */}
                {closing.imageUrl && (
                    <div
                        className={`relative w-full overflow-hidden rounded-lg shadow-sm bg-gray-50 ${closing.ratio === 'fixed' ? 'aspect-square' : ''
                            }`}
                    >
                        {closing.ratio === 'fixed' ? (
                            <Image
                                src={closing.imageUrl}
                                alt="Closing"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                src={closing.imageUrl}
                                alt="Closing"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}

                        {/* Effects Overlay */}
                        {closing.effect === 'mist' && (
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 pointer-events-none"></div>
                        )}
                        {closing.effect === 'ripple' && (
                            <div className="absolute inset-0 z-10 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/water.png')] pointer-events-none"></div>
                        )}
                        {closing.effect === 'paper' && (
                            <div className="absolute inset-0 z-10 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] mix-blend-multiply pointer-events-none"></div>
                        )}
                    </div>
                )}

                {/* Text Content */}
                {closing.content && (
                    <div
                        className="text-center whitespace-pre-wrap leading-loose text-gray-700 font-serif"
                        style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                    >
                        {closing.content}
                    </div>
                )}
            </div>
        </SectionContainer>
    );
}
