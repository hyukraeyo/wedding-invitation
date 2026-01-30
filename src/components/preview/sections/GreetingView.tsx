'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
import { clsx } from 'clsx';
import styles from './GreetingView.module.scss';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';

interface Person {
    lastName: string;
    firstName: string;
    relation: string;
    parents: {
        father: { name: string; isDeceased: boolean; isHidden: boolean };
        mother: { name: string; isDeceased: boolean; isHidden: boolean };
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
    animateEntrance?: boolean;
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
    accentColor,
    animateEntrance
}: GreetingViewProps) => {

    const renderFamilyRelation = (person: Person, role: '신랑' | '신부') => {
        if (!person || !person.parents) return null;
        const { parents } = person;

        const showFather = !parents.father.isHidden;
        const showMother = !parents.mother.isHidden;

        // 둘 다 숨김인 경우 아예 노출하지 않음
        if (!showFather && !showMother) {
            return (
                <div className={styles.familyGroup}>
                    <div className={styles.relationLabel}>{role}</div>
                    <div className={styles.childName}>{person.firstName || role}</div>
                </div>
            );
        }

        const fatherName = parents.father.name || '아버지';
        const motherName = parents.mother.name || '어머니';
        const childName = person.firstName || role;

        return (
            <div className={styles.familyGroup}>
                <div className={styles.parentsNames}>
                    {showFather && (
                        <span>
                            {parents.father.isDeceased ? <span className={styles.deceased}>故</span> : null}
                            {fatherName}
                        </span>
                    )}
                    {showFather && showMother && <span className={styles.dotSeparator}>·</span>}
                    {showMother && (
                        <span>
                            {parents.mother.isDeceased ? <span className={styles.deceased}>故</span> : null}
                            {motherName}
                        </span>
                    )}
                </div>
                <div className={styles.relationSeparator} />
                <div className={styles.relationLabel}>의 {person.relation || (role === '신랑' ? '장남' : '장녀')}</div>
                <div className={styles.childName}>{childName}</div>
            </div>
        );
    };

    return (
        <SectionContainer id={id} animateEntrance={animateEntrance}>
            <SectionHeader
                title={greetingTitle}
                subtitle={greetingSubtitle || 'INVITATION'}
                accentColor={accentColor}
            />

            <div className={styles.content}>
                <div
                    className={clsx(styles.greetingText, "rich-text-content")}
                    dangerouslySetInnerHTML={{ __html: greetingContent }}
                />

                {greetingImage ? (
                    <div className={clsx(styles.imageContainer, styles[greetingRatio])}>
                        {greetingRatio === 'fixed' ? (
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '800 / 550' }}>
                                <Image
                                    src={greetingImage}
                                    alt="인사말 이미지"
                                    fill
                                    sizes={IMAGE_SIZES.section}
                                    className={styles.image}
                                    style={{
                                        objectFit: 'cover'
                                    }}
                                    priority
                                    loading="eager"
                                    unoptimized={isBlobUrl(greetingImage)}
                                />
                            </div>
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
                                priority
                                loading="eager"
                                unoptimized={isBlobUrl(greetingImage)}
                            />
                        )}
                    </div>
                ) : null}

                {enableFreeformNames ? (
                    <div className={styles.freeformArea}>
                        {groomNameCustom ? <p>{groomNameCustom}</p> : null}
                        {brideNameCustom ? <p>{brideNameCustom}</p> : null}
                    </div>
                ) : (
                    showNamesAtBottom ? (
                        <div className={styles.relationArea}>
                            {renderFamilyRelation(groom, '신랑')}
                            {renderFamilyRelation(bride, '신부')}
                        </div>
                    ) : null
                )}
            </div>
        </SectionContainer>
    );
});

GreetingView.displayName = 'GreetingView';

export default GreetingView;
