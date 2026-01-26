"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import { Skeleton } from "@/components/ui/Skeleton";

export function SkeletonDemo() {
    return (
        <div className={styles.skeletonStack}>
            <div className={styles.skeletonUserRow}>
                <Skeleton className={styles.skeletonAvatar} />
                <div className={styles.verticalStackSmall}>
                    <Skeleton className={styles.skeletonTextLong} />
                    <Skeleton className={styles.skeletonTextShort} />
                </div>
            </div>
            <div className={styles.showcaseStack}>
                <Skeleton className={styles.skeletonCard} />
                <div className={styles.skeletonButtonRow}>
                    <Skeleton className={styles.skeletonButton} />
                    <Skeleton className={styles.skeletonButton} />
                </div>
            </div>
        </div>
    );
}
