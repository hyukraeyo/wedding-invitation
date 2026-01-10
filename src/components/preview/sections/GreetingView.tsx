'use client';

import React, { memo } from 'react';
import SectionContainer from '../SectionContainer';
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
    greetingSubtitle?: string;
    greetingContent: string;
    groom: Person;
    bride: Person;
    accentColor: string;
}

/**
 * Presentational Component for the Greeting / Invitation message.
 * Follows the Container/Presentational pattern and utilizes CSS Modules.
 */
const GreetingView = memo(({
    id,
    greetingTitle,
    greetingSubtitle = 'GREETING',
    greetingContent,
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
            <div className={styles.header}>
                <span className={styles.subtitle} style={{ color: accentColor }}>{greetingSubtitle || 'GREETING'}</span>
                <h2 className={styles.title}>{greetingTitle}</h2>
                <div className={styles.decorationLine} style={{ backgroundColor: accentColor }} />
            </div>

            <div className={styles.content}>
                <div
                    className={styles.greetingText}
                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                    dangerouslySetInnerHTML={{ __html: greetingContent }}
                />

                <div className={styles.relationArea}>
                    {renderFamilyRelation(groom, '신랑')}
                    {renderFamilyRelation(bride, '신부')}
                </div>
            </div>
        </SectionContainer>
    );
});

GreetingView.displayName = 'GreetingView';

export default GreetingView;
