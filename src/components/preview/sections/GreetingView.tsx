'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
import styles from './GreetingView.module.scss';

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
    showNamesAtBottom: boolean;
    enableFreeformNames: boolean;
    freeformNames?: string | null | undefined;
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
    showNamesAtBottom,
    enableFreeformNames,
    freeformNames,
    groom,
    bride,
    accentColor
}: GreetingViewProps) => {

    const renderFamilyRelation = (person: Person, role: '신랑' | '신부') => {
        const { parents } = person;
        const hasParents = parents.father.name || parents.mother.name;
        if (!hasParents) return null;

        return (
            <div className={styles.familyGroup}>
                <div className={styles.parentsNames}>
                    {parents.father.name && (
                        <span>
                            {parents.father.isDeceased && <span className={styles.deceased}>故</span>}
                            {parents.father.name}
                        </span>
                    )}
                    {parents.father.name && parents.mother.name && <span className={styles.dotSeparator}>·</span>}
                    {parents.mother.name && (
                        <span>
                            {parents.mother.isDeceased && <span className={styles.deceased}>故</span>}
                            {parents.mother.name}
                        </span>
                    )}
                </div>
                <div className={styles.relationSeparator} />
                <div className={styles.relationLabel}>의 {person.relation || (role === '신랑' ? '장남' : '장녀')}</div>
                <div className={styles.childName}>{person.firstName}</div>
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
                    className={styles.greetingText}
                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                    dangerouslySetInnerHTML={{ __html: greetingContent }}
                />

                {greetingImage && (
                    <div className={styles.imageContainer}>
                        <Image
                            src={greetingImage}
                            alt="인사말 이미지"
                            width={600}
                            height={400}
                            className={styles.image}
                            unoptimized
                        />
                    </div>
                )}

                {enableFreeformNames ? (
                    <div className={styles.freeformArea} dangerouslySetInnerHTML={{ __html: freeformNames || '' }} />
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
