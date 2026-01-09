'use client';

import React, { memo } from 'react';
import SectionContainer from '../SectionContainer';
import styles from './GreetingView.module.scss';

interface Person {
    lastName: string;
    firstName: string;
    father?: string;
    mother?: string;
    fatherIsDeceased?: boolean;
    motherIsDeceased?: boolean;
    relation?: string;
}

interface GreetingViewProps {
    id?: string | undefined;
    greetingTitle: string;
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
    greetingContent,
    groom,
    bride,
    accentColor
}: GreetingViewProps) => {

    const renderFamilyRelation = (person: Person, role: '신랑' | '신부') => {
        const hasParents = person.father || person.mother;
        if (!hasParents) return null;

        return (
            <div className={styles.familyGroup}>
                <div className={styles.parentsNames}>
                    {person.father && (
                        <span>
                            {person.fatherIsDeceased && <span className={styles.deceased}>故</span>}
                            {person.father}
                        </span>
                    )}
                    {person.father && person.mother && <span className={styles.dotSeparator}>·</span>}
                    {person.mother && (
                        <span>
                            {person.motherIsDeceased && <span className={styles.deceased}>故</span>}
                            {person.mother}
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
                <span className={styles.subtitle} style={{ color: accentColor }}>GREETING</span>
                <h2 className={styles.title}>{greetingTitle}</h2>
                <div className={styles.decorationLine} style={{ backgroundColor: accentColor }} />
            </div>

            <div className={styles.content}>
                <div
                    className={styles.greetingText}
                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                >
                    {greetingContent}
                </div>

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
