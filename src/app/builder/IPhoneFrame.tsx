"use client";

import React from 'react';
import { clsx } from 'clsx';
import styles from './BuilderPage.module.scss';

interface IPhoneFrameProps {
    children: React.ReactNode;
}

export const IPhoneFrame = React.memo(({ children }: IPhoneFrameProps) => {
    return (
        <div className={styles.iphoneFrame}>
            <div className={clsx(styles.button, styles.action)} />
            <div className={clsx(styles.button, styles.volUp)} />
            <div className={clsx(styles.button, styles.volDown)} />
            <div className={clsx(styles.button, styles.power)} />

            <div className={styles.chassis}>
                <div className={styles.bezel}>
                    <div className={styles.dynamicIsland}>
                        <div className={styles.island}>
                            <div className={styles.camera} />
                        </div>
                    </div>

                    <div className={styles.statusBar}>
                        <div className={styles.time}>9:41</div>
                        <div className={styles.icons}>
                            <div className={styles.signal}>
                                <div style={{ height: '4px' }} />
                                <div style={{ height: '6px' }} />
                                <div style={{ height: '9px' }} />
                                <div style={{ height: '12px', opacity: 0.3 }} />
                            </div>
                            <div className={styles.battery}>
                                <div className={styles.level} />
                                <div className={styles.tip} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.screen}>
                        {children}
                    </div>

                    <div className={styles.homeIndicator} />
                </div>
            </div>
        </div>
    );
});

IPhoneFrame.displayName = 'IPhoneFrame';
