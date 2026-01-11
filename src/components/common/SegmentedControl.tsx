import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface SegmentedControlProps<T> {
    value?: T | undefined;
    defaultValue?: T | undefined;
    onChange?: ((value: T) => void) | undefined;
    size?: 'small' | 'large' | undefined;
    alignment?: 'fixed' | 'fluid' | undefined;
    children: React.ReactNode;
    className?: string | undefined;
}

interface SegmentedControlItemProps<T> {
    value: T;
    children: React.ReactNode;
    className?: string | undefined;
    // content ref for tabs? Usually TabsTrigger just wraps text/icon
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
    const handleValueChange = (val: string) => {
        // Try to convert back to number if T is number? 
        // Or just pass the value if logic allows. 
        // Since we don't know T at runtime easily, we assume the items provided the value type.
        // We find the original value from props?

        // A simpler way: Find the child with this string value and use its original value prop.
        let originalValue: T | undefined;
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && (child.props as SegmentedControlItemProps<T>).value.toString() === val) {
                originalValue = (child.props as SegmentedControlItemProps<T>).value;
            }
        });

        if (onChange && originalValue !== undefined) {
            onChange(originalValue);
        }
    };

    return (
        <Tabs
            {...(activeValue !== undefined ? { value: activeValue.toString() } : {})}
            onValueChange={handleValueChange}
            className={cn("w-full", className)}
        >
            <TabsList className={cn(
                "w-full h-auto p-1",
                size === 'large' ? "h-10" : "h-8",
                "grid",
                // alignment 'fixed' means equal width cols? 'fluid' means auto?
                // TabsList usually flex. 'grid' works for fixed equal width.
                // We need to count children to set col span or just use flex-1?
                "grid-flow-col auto-cols-fr"
            )}>
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        const props = child.props as SegmentedControlItemProps<T>;
                        return (
                            <TabsTrigger
                                value={props.value.toString()}
                                className={cn(props.className)}
                            >
                                {props.children}
                            </TabsTrigger>
                        );
                    }
                    return null;
                })}
            </TabsList>
        </Tabs>
    );
};

SegmentedControl.Item = SegmentedControlItem;
