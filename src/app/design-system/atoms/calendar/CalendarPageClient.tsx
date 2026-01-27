"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Calendar } from "@/components/ui/Calendar";

import { usePropControls } from "../../hooks/usePropControls";
import styles from "../../DesignSystem.module.scss";

const CalendarPageClient = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const { values, getPropItems } = usePropControls({
        mode: {
            type: 'segmented',
            defaultValue: 'single',
            options: ['single', 'multiple', 'range'],
            description: '캘린더의 선택 모드',
            componentType: '"single" | "multiple" | "range"'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: '비활성화 여부',
            componentType: 'boolean'
        },
        showOutsideDays: {
            type: 'boolean',
            defaultValue: true,
            description: '해당 월 이외의 날짜 표시 여부',
            componentType: 'boolean'
        }
    });

    const calendarUsage = `<Calendar 
  mode="${values.mode}" 
  selected={date} 
  onSelect={setDate}
  ${values.disabled ? 'disabled' : ''}
  ${!values.showOutsideDays ? 'showOutsideDays={false}' : ''}
  style={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
/>`;

    return (
        <DesignSystemPage
            title="Calendar"
            description="날짜 선택을 위한 캘린더 컴포넌트입니다. 직관적인 인터페이스로 날짜를 선택할 수 있습니다."
            playground={{
                title: "Interactive Playground",
                description: "캘린더의 다양한 모드와 설정을 테스트해 보세요.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                        <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <Calendar
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                mode={values.mode as any}
                                selected={date}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onSelect={setDate as any}
                                disabled={values.disabled as boolean}
                                showOutsideDays={values.showOutsideDays as boolean}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>

                    </div>
                ),
                usage: calendarUsage,
                props: [
                    ...getPropItems(),
                    {
                        name: 'selected',
                        type: 'Date | Date[] | DateRange | undefined',
                        description: '선택된 날짜 값 (제어 컴포넌트)',
                    },
                    {
                        name: 'onSelect',
                        type: '(date: any) => void',
                        description: '날짜 선택 시 호출되는 이벤트 핸들러',
                    }
                ]
            }}
            combinations={{
                title: "Usage Examples",
                description: "Calendar 컴포넌트의 다양한 활용 예시입니다.",
                content: (
                    <div className={styles.gridTwoCols}>
                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Single Date Selection</h4>
                            <div className={styles.canvas} style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    style={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
                                />
                            </div>
                        </div>

                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Range Selection</h4>
                            <div className={styles.canvas} style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                                <Calendar
                                    mode="range"
                                    defaultMonth={new Date()}
                                    style={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
};

export default CalendarPageClient;