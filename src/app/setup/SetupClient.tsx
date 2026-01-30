"use client";

import React from 'react';
import { SetupForm } from './SetupForm';
import styles from './SetupPage.module.scss';
import { Flex, Box } from '@/components/ui';

const SetupClient = () => {
    return (
        <Flex direction="column" className={styles.container}>
            <Flex direction="column" className={styles.content}>
                <Box className={styles.formWrapper}>
                    <SetupForm />
                </Box>
            </Flex>
        </Flex>
    );
};

SetupClient.displayName = "SetupClient";

export { SetupClient };
