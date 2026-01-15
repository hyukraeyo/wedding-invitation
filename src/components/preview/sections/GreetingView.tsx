'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
import { clsx } from 'clsx';
import styles from './GreetingView.module.scss';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';

interface Person {
    lastName: string;
    firstName: string;
    relation: string;
    parents: {
        father: { name: string; isDeceased: boolean };
        mother: { name: string; isDeceased: boolean };
    };
}

interface GreetingViewProps {
    id?: string | undefined;
    greetingTitle: string;
    greetingSubtitle?: string | null | undefined;
    greetingContent: string;
    greetingImage?: string | null | undefined;
    greetingRatio?: 'fixed' | 'auto';
    showNamesAtBottom: boolean;
    enableFreeformNames: boolean;
    groomNameCustom?: string | undefined;
    brideNameCustom?: string | undefined;
    groom: Person;
    bride: Person;
    accentColor: string;
}

/**
 * Presentational Component for the Greeting / Invitation message.
 */
const GreetingView = memo(({
    id,
    greetingTitle,
    greetingSubtitle = 'GREETING',
    greetingContent,
    greetingImage,
    greetingRatio = 'fixed',
    showNamesAtBottom,
    enableFreeformNames,
    groomNameCustom,
    brideNameCustom,
    groom,
    bride,
    accentColor
}: GreetingViewProps) => {

    const renderFamilyRelation = (person: Person, role: '신랑' | '신부') => {
        if (!person || !person.parents) return null;
        const { parents } = person;

        const fatherName = parents.father.name || '아버지';
        const motherName = parents.mother.name || '어머니';
        const childName = person.firstName || role;

        return (
            <div className={styles.familyGroup}>
                <div className={styles.parentsNames}>
                    <span>
                        {parents.father.isDeceased && <span className={styles.deceased}>故</span>}
                        {fatherName}
                    </span>
                    <span className={styles.dotSeparator}>·</span>
                    <span>
                        {parents.mother.isDeceased && <span className={styles.deceased}>故</span>}
                        {motherName}
                    </span>
                </div>
                <div className={styles.relationSeparator} />
                <div className={styles.relationLabel}>의 {person.relation || (role === '신랑' ? '장남' : '장녀')}</div>
                <div className={styles.childName}>{childName}</div>
            </div>
        );
    };

    return (
        <SectionContainer id={id}>
            <SectionHeader
                title={greetingTitle}
                subtitle={greetingSubtitle || 'INVITATION'}
                accentColor={accentColor}
            />

            <div className={styles.content}>
                <div
                    className={clsx(styles.greetingText, "rich-text-content")}
                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                    dangerouslySetInnerHTML={{ __html: greetingContent }}
                />

                {greetingImage && (
                    <div className={clsx(styles.imageContainer, styles[greetingRatio])}>
                        {greetingRatio === 'fixed' ? (
                            <AspectRatio ratio={800 / 550}>
                                <Image
                                    src={greetingImage}
                                    alt="인사말 이미지"
                                    fill
                                    sizes={IMAGE_SIZES.section}
                                    className={styles.image}
                                    style={{
                                        objectFit: 'cover'
                                    }}
                                    unoptimized={isBlobUrl(greetingImage)}
                                />
                            </AspectRatio>
                        ) : (
                            <Image
                                src={greetingImage}
                                alt="인사말 이미지"
                                width={800}
                                height={550}
                                sizes={IMAGE_SIZES.section}
                                className={styles.image}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                                unoptimized={isBlobUrl(greetingImage)}
                            />
                        )}
                    </div>
                )}

                {enableFreeformNames ? (
                    <div className={styles.freeformArea}>
                        {groomNameCustom && <p>{groomNameCustom}</p>}
                        {brideNameCustom && <p>{brideNameCustom}</p>}
                    </div>
                ) : (
                    showNamesAtBottom && (
                        <div className={styles.relationArea}>
                            {renderFamilyRelation(groom, '신랑')}
                            {renderFamilyRelation(bride, '신부')}
                        </div>
                    )
                )}
            </div>
        </SectionContainer>
    );
});

GreetingView.displayName = 'GreetingView';

export default GreetingView;
