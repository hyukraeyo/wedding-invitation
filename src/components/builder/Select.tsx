import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './Select.module.scss';
import { clsx } from 'clsx';

interface Option<T> {
    label: string;
    value: T;
}

interface SelectProps<T> {
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

export const Select = <T extends string | number>({
    value,
    options,
    onChange,
    placeholder,
    className = "",
    labelClassName = ""
}: SelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    const selectedOption = options.find(opt => opt.value === value);

    // 드롭다운 위치 계산
    useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'fixed',
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
                zIndex: 9999,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInsideContainer = containerRef.current?.contains(target);
            const isInsideDropdown = dropdownRef.current?.contains(target);

            if (!isInsideContainer && !isInsideDropdown) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };

        if (!isOpen) return;

        // setTimeout을 사용하여 현재 클릭 이벤트가 완료된 후 리스너 등록
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Active item scroll into view logic
    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const activeItem = dropdownRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest', behavior: 'instant' });
            }
        }
    }, [isOpen]);

    const cssVars = {
        '--accent-color': accentColor,
        '--accent-rgb': hexToRgbString(accentColor)
    } as React.CSSProperties;

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className={clsx(styles.container, className)} ref={containerRef} style={cssVars}>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleButtonClick}
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

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className={styles.dropdown}
                    style={{ ...dropdownStyle, ...cssVars }}
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
                </div>,
                document.body
            )}
        </div>
    );
};
