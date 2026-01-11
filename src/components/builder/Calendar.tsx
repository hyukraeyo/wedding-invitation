import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface CalendarProps {
    value: string | null;
    onChange: (date: string) => void;
    className?: string;
    placeholder?: string;
}

export const Calendar = ({ value, onChange, className, placeholder = '날짜를 선택해주세요' }: CalendarProps) => {
    const date = value ? new Date(value) : undefined;

    const handleSelect = (newDate: Date | undefined) => {
        if (newDate) {
            // Format to YYYY-MM-DD
            const formatted = format(newDate, 'yyyy-MM-dd');
            onChange(formatted);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'yyyy. MM. dd.', { locale: ko }) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <ShadcnCalendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    locale={ko}
                />
            </PopoverContent>
        </Popover>
    );
};
