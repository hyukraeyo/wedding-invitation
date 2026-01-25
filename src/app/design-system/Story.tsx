"use client";

import React from "react";
import { cn } from "@/lib/utils";
import styles from "./DesignSystem.module.scss";

interface StoryProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
}

export default function Story({
    title,
    description,
    children,
    className,
    containerClassName,
}: StoryProps) {
    return (
        <article className={cn(styles.story, className)}>
            <div className={styles.storyHeader}>
                <h3>{title}</h3>
                {description && <p>{description}</p>}
            </div>
            <div className={cn(styles.canvas, containerClassName)}>
                {children}
            </div>
        </article>
    );
}
