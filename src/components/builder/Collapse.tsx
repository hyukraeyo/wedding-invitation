import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Collapse.module.scss';
import { clsx } from 'clsx';

interface CollapseProps {
    label: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
    rightElement?: React.ReactNode;
}

export const Collapse = ({ label, children, isOpen, onToggle, className, rightElement }: CollapseProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setHeight(contentRef.current?.scrollHeight);
            }, 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setHeight(0), 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, children]);

    return (
        <div className={clsx(styles.container, className, isOpen && styles.open)}>
            <button type="button" className={styles.trigger} onClick={onToggle}>
                <div className={styles.headerContent}>
                    <span className={clsx(styles.label, isOpen && styles.open)}>{label}</span>
                    {rightElement}
                </div>
                <ChevronDown size={18} className={clsx(styles.icon, isOpen && styles.open)} />
            </button>
            <div
                className={clsx(styles.collapseWrapper, isOpen && styles.open)}
                style={{ height: isOpen ? height : 0 }}
            >
                <div ref={contentRef} className={styles.collapseInner}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

