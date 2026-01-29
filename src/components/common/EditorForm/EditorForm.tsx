"use client";

import React, { useState, useCallback, memo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { useShallow } from 'zustand/react/shallow';
import styles from './EditorForm.module.scss';

// Dynamic imports for optimized initial bundle
const ThemeSection = dynamic(() => import('@/components/builder/sections/ThemeSection'));
const MainScreenSection = dynamic(() => import('@/components/builder/sections/MainScreenSection'));
const BasicInfoSection = dynamic(() => import('@/components/builder/sections/BasicInfoSection'));
const DateTimeSection = dynamic(() => import('@/components/builder/sections/DateTimeSection'));
const LocationSection = dynamic(() => import('@/components/builder/sections/LocationSection'));
const GreetingSection = dynamic(() => import('@/components/builder/sections/GreetingSection'));
const GallerySection = dynamic(() => import('@/components/builder/sections/GallerySection'));
const AccountsSection = dynamic(() => import('@/components/builder/sections/AccountsSection'));
const KakaoShareSection = dynamic(() => import('@/components/builder/sections/KakaoShareSection'));
const ClosingSection = dynamic(() => import('@/components/builder/sections/ClosingSection'));

const SECTIONS = [
    { key: 'basic', Component: BasicInfoSection },
    { key: 'theme', Component: ThemeSection },
    { key: 'mainScreen', Component: MainScreenSection },
    { key: 'message', Component: GreetingSection },
    { key: 'gallery', Component: GallerySection },
    { key: 'date', Component: DateTimeSection },
    { key: 'location', Component: LocationSection },
    { key: 'account', Component: AccountsSection },
    { key: 'closing', Component: ClosingSection },
    { key: 'kakao', Component: KakaoShareSection },
] as const;

const EditorForm = memo(function EditorForm() {
    const [openSections, setOpenSections] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);
    const { editingSection, setEditingSection } = useInvitationStore(useShallow((state) => ({
        editingSection: state.editingSection,
        setEditingSection: state.setEditingSection,
    })));

    // When sections change, identify if a new section was opened to update the preview
    const handleValueChange = useCallback((value: string[]) => {
        // Find if a new section was added
        const added = value.find(v => !openSections.includes(v));

        if (added) {
            setEditingSection(added);
        } else if (value.length === 0) {
            // If all sections are closed, clear the editing section
            setEditingSection(null);
        } else if (editingSection && !value.includes(editingSection)) {
            // If the current editing section was closed, set it to the last remaining open one or null
            setEditingSection(value[value.length - 1] ?? null);
        }

        setOpenSections(value);
    }, [openSections, editingSection, setEditingSection]);

    // Delay rendering to ensure all icons are loaded for smooth appearance
    useEffect(() => {
        const timer = requestAnimationFrame(() => setIsReady(true));
        return () => cancelAnimationFrame(timer);
    }, []);

    const handleToggle = useCallback((key: string, isOpen: boolean) => {
        const nextOpenSections = isOpen
            ? [...openSections, key]
            : openSections.filter(s => s !== key);

        handleValueChange(nextOpenSections);
    }, [openSections, handleValueChange]);

    if (!isReady) {
        return (
            <div className={styles.loadingContainer}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={styles.skeletonItem}>
                        <div className={styles.skeletonLeft}>
                            <Skeleton className={styles.skeletonIcon} />
                            <div className={styles.skeletonText}>
                                <Skeleton className={styles.skeletonTitle} />
                                <Skeleton className={styles.skeletonSubtitle} />
                            </div>
                        </div>
                        <Skeleton className={styles.skeletonChevron} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {SECTIONS.map(({ key, Component }) => (
                    <Component
                        key={key}
                        value={key}
                        isOpen={openSections.includes(key)}
                        onToggle={(isOpen) => handleToggle(key, isOpen)}
                    />
                ))}
            </div>
        </div>
    );
});

EditorForm.displayName = 'EditorForm';

export default EditorForm;
