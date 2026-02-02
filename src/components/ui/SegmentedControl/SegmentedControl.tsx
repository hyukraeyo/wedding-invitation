'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './SegmentedControl.module.scss';

export interface SegmentedControlProps {
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    children: React.ReactNode;
    alignment?: 'auto' | 'fluid' | undefined;
    size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
    className?: string | undefined;
}

const SegmentedControlContext = React.createContext<{
    value?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
}>({});

const SegmentedControlMain = ({
    value: propsValue,
    defaultValue,
    onChange,
    children,
    alignment = 'auto',
    size = 'md',
    className
}: SegmentedControlProps) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0, opacity: 0 });

    const value = propsValue !== undefined ? propsValue : internalValue;

    const handleChange = (val: string) => {
        if (propsValue === undefined) {
            setInternalValue(val);
        }
        onChange?.(val);
    };

    const updateIndicator = React.useCallback(() => {
        if (!rootRef.current) return;
        const activeElement = rootRef.current.querySelector('[data-active="true"]') as HTMLElement;
        if (activeElement) {
            setIndicatorStyle({
                left: activeElement.offsetLeft,
                width: activeElement.offsetWidth,
                opacity: 1,
            });
        } else {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, []);

    React.useLayoutEffect(() => {
        updateIndicator();
        // 폰트 로딩이나 레이아웃 변경에 대비해 짧은 지연 후 한 번 더 실행
        const timer = setTimeout(updateIndicator, 100);
        return () => clearTimeout(timer);
    }, [value, updateIndicator]);

    React.useEffect(() => {
        const observer = new ResizeObserver(updateIndicator);
        if (rootRef.current) {
            observer.observe(rootRef.current);
        }
        return () => observer.disconnect();
    }, [updateIndicator]);

    return (
        <SegmentedControlContext.Provider value={{ value, onChange: handleChange }}>
            <div
                ref={rootRef}
                className={clsx(
                    s.root,
                    alignment === 'fluid' && s.fluid,
                    s[size],
                    className
                )}
                role="tablist"
            >
                <div
                    className={s.indicator}
                    aria-hidden="true"
                    style={{
                        transform: `translateX(${indicatorStyle.left}px)`,
                        width: `${indicatorStyle.width}px`,
                        opacity: indicatorStyle.opacity
                    }}
                />
                {children}
            </div>
        </SegmentedControlContext.Provider>
    );
};

export interface SegmentedControlItemProps {
    value: string;
    children: React.ReactNode;
    className?: string | undefined;
}

const Item = ({ value: itemValue, children, className }: SegmentedControlItemProps) => {
    const context = React.useContext(SegmentedControlContext);
    const isActive = context.value === itemValue;

    return (
        <button
            type="button"
            className={clsx(s.item, isActive && s.active, className)}
            onClick={() => context.onChange?.(itemValue)}
            data-active={isActive ? "true" : "false"}
            role="tab"
            aria-selected={isActive}
        >
            {children}
        </button>
    );
};

export const SegmentedControl = Object.assign(SegmentedControlMain, {
    Item,
});
