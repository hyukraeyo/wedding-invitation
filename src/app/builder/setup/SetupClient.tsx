"use client";

import React from 'react';
import { SetupForm } from './SetupForm';
import styles from './SetupPage.module.scss';

const SetupClient = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.formWrapper}>
                    <SetupForm />
                </div>
            </div>
        </div>
    );
};

SetupClient.displayName = "SetupClient";

export { SetupClient };
