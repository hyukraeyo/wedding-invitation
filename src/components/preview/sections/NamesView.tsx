import React from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './NamesView.module.scss';

export default function NamesView() {
    const { groom, bride, theme } = useInvitationStore();

    return (
        <div className={styles.container}>
            <div className={styles.namesContainer}>
                {/* Groom */}
                <div className={styles.person}>
                    <span className={styles.relation}>{groom.relation}</span>
                    <span className={styles.name}>
                        <span className={styles.lastName}>{groom.lastName}</span>
                        {groom.firstName}
                    </span>
                </div>

                {/* Elegant Ampersand Divider */}
                <div className={styles.divider} style={{ color: theme.accentColor }}>&</div>

                {/* Bride */}
                <div className={styles.person}>
                    <span className={styles.relation}>{bride.relation}</span>
                    <span className={styles.name}>
                        <span className={styles.lastName}>{bride.lastName}</span>
                        {bride.firstName}
                    </span>
                </div>
            </div>

        </div>
    );
}
