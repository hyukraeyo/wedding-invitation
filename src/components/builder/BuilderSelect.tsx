import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './BuilderSelect.module.scss';
import { clsx } from 'clsx';

interface Option<T> {
    label: string;
    value: T;
}

interface BuilderSelectProps<T> {
    value: T;
    options: readonly Option<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
}

// Convert hex to rgb string 'r, g, b' for CSS variables
const hexToRgbString = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export const BuilderSelect = <T extends string | number>({
    value,
    options,
    onChange,
    placeholder,
    className = "",
    labelClassName = ""
}: BuilderSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleScroll = (event: Event) => {
            if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Active item scroll into view logic
    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isOpen && listRef.current) {
            const activeItem = listRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest', behavior: 'instant' });
            }
        }
    }, [isOpen]);

    const cssVars = {
        '--accent-color': accentColor,
        '--accent-rgb': hexToRgbString(accentColor)
    } as React.CSSProperties;

    return (
        <div className={clsx(styles.container, className)} ref={containerRef} style={cssVars}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(styles.button, isOpen && styles.open)}
            >
                <span className={clsx(styles.label, selectedOption && styles.hasValue, labelClassName)}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={14}
                    className={clsx(styles.icon, isOpen && styles.open)}
                />
            </button>

            {isOpen && (
                <div
                    ref={listRef}
                    className={styles.dropdown}
                >
                    <div className={styles.optionsList}>
                        {options.map((option, index) => {
                            const isActive = value === option.value;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    data-active={isActive}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(styles.optionItem, isActive && styles.active)}
                                >
                                    <span>{option.label}</span>
                                    {isActive && (
                                        <div className={styles.activeDot} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
