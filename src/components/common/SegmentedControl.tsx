'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SegmentedControl.module.scss';
import { clsx } from 'clsx';

interface SegmentedControlProps<T> {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    size?: 'small' | 'large';
    alignment?: 'fixed' | 'fluid';
    children: React.ReactNode;
    className?: string;
}

interface SegmentedControlItemProps<T> {
    value: T;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const SegmentedControlItem = <T extends string | number>({
    value,
    children,
    className,
    onClick,
    ...props
}: SegmentedControlItemProps<T>) => {
    return (
        <div
            className={clsx(styles.item, className)}
            data-value={value}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

// Add displayName for proper type checking
SegmentedControlItem.displayName = 'SegmentedControlItem';

export const SegmentedControl = <T extends string | number>({
    value: controlledValue,
    defaultValue,
    onChange,
    size = 'large',
    alignment = 'fixed',
    children,
    className
}: SegmentedControlProps<T>) => {
    const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const containerRef = useRef<HTMLDivElement>(null);
    const [thumbStyle, setThumbStyle] = useState<React.CSSProperties>({ opacity: 0 });

    const handleSelect = (value: T) => {
        if (!isControlled) {
            setInternalValue(value);
        }
        onChange?.(value);
    };

    const updateThumb = useCallback(() => {
        if (containerRef.current && activeValue !== undefined) {
            const activeElement = containerRef.current.querySelector(`[data-value="${activeValue}"]`) as HTMLElement;
            if (activeElement) {
                setThumbStyle({
                    width: `${activeElement.offsetWidth}px`,
                    transform: `translateX(${activeElement.offsetLeft}px)`,
                    opacity: 1
                });
            }
        }
    }, [activeValue]);

    useEffect(() => {
        updateThumb();
        // ResizeObserver to handle window resizing or dynamic content changes
        if (!containerRef.current) return;

        const observer = new ResizeObserver(updateThumb);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [updateThumb, children]);

    return (
        <div
            ref={containerRef}
            className={clsx(
                styles.container,
                styles[size],
                styles[alignment],
                className
            )}
            role="tablist"
        >
            <div className={styles.thumb} style={thumbStyle} aria-hidden="true" />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // Check displayName safely
                    const type = child.type as React.FunctionComponent | React.ComponentClass;
                    if (type.displayName === 'SegmentedControlItem' || type === SegmentedControlItem) {
                        const props = child.props as SegmentedControlItemProps<T>;
                        const itemValue = props.value;
                        const isActive = activeValue === itemValue;

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return React.cloneElement(child as React.ReactElement<any>, {
                            onClick: () => handleSelect(itemValue),
                            className: clsx(props.className, isActive && styles.active),
                            'aria-selected': isActive,
                            role: 'tab'
                        });
                    }
                }
                return child;
            })}
        </div>
    );
};

// Assign sub-component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SegmentedControl as any).Item = SegmentedControlItem;
