import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import styles from './styles.module.scss';

interface SegmentedControlProps<T> {
    value?: T | undefined;
    defaultValue?: T | undefined;
    onChange?: ((value: T) => void) | undefined;
    size?: 'small' | 'large' | undefined;
    children: React.ReactNode;
    className?: string | undefined;
}

interface SegmentedControlItemProps<T> {
    value: T;
    children: React.ReactNode;
    className?: string | undefined;
}

export const SegmentedControlItem = <T extends string | number>({
    children,
}: SegmentedControlItemProps<T>) => {
    return <>{children}</>;
};

SegmentedControlItem.displayName = 'SegmentedControlItem';

export const SegmentedControl = <T extends string | number>({
    value,
    defaultValue,
    onChange,
    size = 'large',
    children,
    className
}: SegmentedControlProps<T>) => {
    const activeValue = value !== undefined ? value : defaultValue;

    const items = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<SegmentedControlItemProps<T>> => React.isValidElement(child)
    );

    const selectedIndex = items.findIndex(item => item.props.value.toString() === activeValue?.toString());
    const validIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const itemCount = items.length;

    const handleValueChange = (val: string) => {
        const selectedItem = items.find(item => item.props.value.toString() === val);
        if (onChange && selectedItem) {
            onChange(selectedItem.props.value);
        }
    };

    return (
        <Tabs
            {...(activeValue !== undefined ? { value: activeValue.toString() } : {})}
            onValueChange={handleValueChange}
            className={cn(styles.tabs, className)}
        >
            <TabsList className={cn(
                styles.tabsList,
                size === 'large' ? styles.large : styles.small
            )}>
                <span
                    className={styles.indicator}
                    style={{
                        width: `calc((100% - 8px) / ${itemCount})`,
                        transform: `translateX(calc(100% * ${validIndex}))`
                    }}
                />

                {items.map((child) => {
                    const props = child.props;
                    return (
                        <TabsTrigger
                            key={props.value.toString()}
                            value={props.value.toString()}
                            className={cn(
                                styles.trigger,
                                size === 'large' ? styles.large : styles.small,
                                props.className
                            )}
                        >
                            {props.children}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
};

SegmentedControl.Item = SegmentedControlItem;
