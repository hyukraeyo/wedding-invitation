"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Calendar } from "@/components/ui/Calendar";
import { format } from 'date-fns';

const calendarUsage = `<Calendar 
  mode="single" 
  selected={date} 
  onSelect={setDate}
  style={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
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
                    <div style={{ padding: '16px', maxWidth: '384px', margin: '0 auto' }}>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            style={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
                        />
                        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'center', fontSize: '14px' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>단일 날짜 선택</h3>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                style={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
                            />
                        </div>

                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>범위 선택</h3>
                            <Calendar
                                mode="range"
                                style={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
                            />
                        </div>
                    </div>
                )
            }}
        />
    );
};

export default CalendarPageClient;