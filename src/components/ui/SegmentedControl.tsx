import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

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
            className={cn("w-full", className)}
        >
            <TabsList className={cn(
                "relative w-full bg-[#f2f4f6] rounded-lg p-1",
                size === 'large' ? "h-12" : "h-10",
                "grid grid-flow-col auto-cols-fr isolate"
            )}>
                <span
                    className={cn(
                        "absolute top-1 bottom-1 left-1",
                        "bg-white rounded-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.04]",
                        "transition-transform duration-300 ease-ios",
                        "pointer-events-none -z-10"
                    )}
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
                                "z-10 bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                                "rounded-md font-semibold transition-colors duration-200",
                                "text-[#8b95a1] data-[state=active]:text-primary",
                                size === 'large' ? "text-[15px]" : "text-[13px]",
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
