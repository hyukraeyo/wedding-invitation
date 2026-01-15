'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerScrollArea,
    DrawerTrigger,
} from '@/components/ui/drawer';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function DatePicker({ value, onChange, className, placeholder = "날짜 선택" }: DatePickerProps) {
    const windowWidth = useWindowSize();
    const isMobile = windowWidth < 768;
    const [isOpen, setIsOpen] = useState(false);

    // Parse string date (YYYY-MM-DD) to Date object
    const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
            setIsOpen(false);
        }
    };

    const TriggerButtonContent = (
        <Button
            variant="outline"
            type="button"
            className={cn(
                "w-full justify-between text-left font-normal h-12 px-3 py-2",
                !value && "text-muted-foreground",
                className
            )}
        >
            {dateValue ? format(dateValue, 'PPP', { locale: ko }) : placeholder}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
    );

    if (!isMobile) {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    {TriggerButtonContent}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={handleSelect}
                        initialFocus
                        locale={ko}
                    />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    {TriggerButtonContent}
                </DrawerTrigger>
                <DrawerContent>

                    <DrawerHeader className="w-full px-6 pb-2 border-b">
                        <DrawerTitle className="text-left text-base font-bold text-foreground/90">
                            날짜를 선택하세요
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerScrollArea className="flex flex-col items-center justify-center p-4">
                        <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={handleSelect}
                            initialFocus
                            locale={ko}
                            className="p-0 border-0 scale-110 md:scale-100" // Scale up slightly on mobile for better touch
                        />
                    </DrawerScrollArea>
                </DrawerContent>
            </Drawer>
        </>
    );
}
