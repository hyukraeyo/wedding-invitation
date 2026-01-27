"use client";

import React, { useState } from "react";
import DesignSystemPage from "../../../DesignSystemPage";
import styles from "../../../DesignSystem.module.scss";
import { DatePicker } from "@/components/common/DatePicker";
import { usePropControls } from "../../../hooks/usePropControls";

export default function DatePickerPage() {
    const [dateString, setDateString] = useState("2026-05-24");

    const { getPropItems } = usePropControls({
        placeholder: {
            type: 'text',
            defaultValue: "날짜를 선택하세요",
            description: "값이 비었을 때 보여줄 플레이스홀더 텍스트",
            componentType: 'string'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 여부",
            componentType: 'boolean'
        }
    });

    const usage = `import { DatePicker } from "@/components/common/DatePicker";

const [date, setDate] = useState("${dateString}");

<DatePicker 
  value={date} 
  onChange={setDate} 
  placeholder="날짜를 선택하세요"
/>`;

    return (
        <DesignSystemPage
            title="Date Picker"
            description="사용자가 날짜를 쉽고 정확하게 선택할 수 있도록 팝오버 캘린더를 제공하는 입력 컴포넌트입니다."
            playground={{
                title: "Playground",
                description: "날짜 선택기를 열어 날짜를 선택해보세요.",
                content: (
                    <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <DatePicker
                            value={dateString}
                            onChange={(newDate) => setDateString(newDate || "")}
                            placeholder="날짜를 선택해주세요"
                        />
                        <div className={styles.codePanel} style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#71717a' }}>Raw Value: </span>
                            <span style={{ fontWeight: 600, color: '#18181b' }}>
                                {dateString || "(undefined)"}
                            </span>
                        </div>
                    </div>
                ),
                usage: usage,
                props: [
                    ...getPropItems(),
                    {
                        name: 'value',
                        type: 'string', // DatePicker expects 'string' (YYYY-MM-DD)
                        description: '선택된 날짜 값 (YYYY-MM-DD 형식)',
                    },
                    {
                        name: 'onChange',
                        type: '(value: string | undefined) => void',
                        description: '날짜 변경 시 호출되는 이벤트 핸들러',
                    }
                ]
            }}
            combinations={{
                title: "Usage Examples",
                description: "다양한 설정에서의 DatePicker 활용 예시입니다.",
                content: (
                    <div className={styles.gridTwoCols}>
                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Empty State</h4>
                            <div className={styles.canvas} style={{ padding: '24px' }}>
                                <DatePicker value="" onChange={() => { }} placeholder="예식일 선택" />
                            </div>
                        </div>

                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Disabled State</h4>
                            <div className={styles.canvas} style={{ padding: '24px' }}>
                                <DatePicker value="2026-12-25" onChange={() => { }} disabled />
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
