"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Calendar } from "@/components/ui/Calendar";
import { format } from 'date-fns';

const calendarUsage = `<Calendar 
  mode="single" 
  selected={date} 
  onSelect={setDate}
  className="rounded-md border"
/>`;

const CalendarPageClient = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <DesignSystemPage
            title="Calendar"
            description="날짜 선택을 위한 캘린더 컴포넌트입니다."
            playground={{
                title: "Playground",
                content: (
                    <div className="p-4 max-w-sm mx-auto">
                        <Calendar 
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                        <div className="mt-4 p-3 bg-gray-50 rounded-md text-center">
                            선택된 날짜: {date ? format(date, 'yyyy-MM-dd') : '선택되지 않음'}
                        </div>
                    </div>
                ),
                usage: calendarUsage,
                props: [
                    {
                        name: 'mode',
                        type: '"single" | "multiple" | "range"',
                        defaultValue: 'single',
                        description: '캘린더의 선택 모드',
                    },
                    {
                        name: 'selected',
                        type: 'Date',
                        defaultValue: 'undefined',
                        description: '선택된 날짜',
                    },
                    {
                        name: 'onSelect',
                        type: '(date: Date | undefined) => void',
                        defaultValue: 'undefined',
                        description: '날짜 선택 시 호출되는 콜백',
                    },
                    {
                        name: 'disabled',
                        type: 'boolean',
                        defaultValue: 'false',
                        description: '비활성화 여부',
                    },
                ]
            }}
            combinations={{
                title: "조합 예시",
                description: "Calendar 컴포넌트의 다양한 사용 예시입니다.",
                canvasStyle: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '40px' },
                content: (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">단일 날짜 선택</h3>
                            <Calendar 
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">범위 선택</h3>
                            <Calendar 
                                mode="range"
                                className="rounded-md border"
                            />
                        </div>
                    </div>
                )
            }}
        />
    );
};

export default CalendarPageClient;