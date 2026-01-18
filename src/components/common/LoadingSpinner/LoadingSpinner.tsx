import React from 'react';
import { Banana } from 'lucide-react';
import styles from './styles.module.scss';

export default function LoadingSpinner() {
    return (
        <div className={styles.overlay}>
            <div className={styles.iconWrapper}>
                {/* Rotating Banana Icon */}
                <Banana className={styles.icon} />
            </div>

            {/* Subtle floating background elements */}
            <div className={styles.backgroundDecoration1} />
            <div className={styles.backgroundDecoration2} />
        </div>
    );
}
