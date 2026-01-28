"use client";

import React, { useState } from "react";
import DesignSystemPage from "../../../DesignSystemPage";
import styles from "../../../DesignSystem.module.scss";
import { TimePicker } from "@/components/common/TimePicker";
import { usePropControls } from "../../../hooks/usePropControls";

export default function TimePickerPage() {
    const [timeString, setTimeString] = useState("12:00");

    const { getPropItems } = usePropControls({
        placeholder: {
            type: 'text',
            defaultValue: "시간을 선택하세요",
            description: "값이 비었을 때 보여줄 플레이스홀더 텍스트",
            componentType: 'string'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 여부",
            componentType: 'boolean'
        },
        variant: {
            type: 'select',
            defaultValue: 'unified',
            options: ['default', 'unified'],
            description: "표시 스타일 (통합형 또는 개별형)",
            componentType: 'string'
        }
    });

    const usage = `import { TimePicker } from "@/components/common/TimePicker";

const [time, setTime] = useState("${timeString}");

<TimePicker 
  value={time} 
  onChange={setTime} 
  variant="unified"
/>`;

    return (
        <DesignSystemPage
            title="Time Picker"
            description="사용자가 예식 시간을 쉽고 직관적으로 선택할 수 있도록 통합된 모달 인터페이스를 제공하는 컴포넌트입니다."
            playground={{
                title: "Playground",
                description: "시간 선택기를 열어 예식 시간을 설정해보세요. 이제 시계(Clock) 아이콘이 적용되어 있습니다.",
                content: (
                    <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TimePicker
                            value={timeString}
                            onChange={setTimeString}
                            placeholder="시간을 선택해주세요"
                            variant="unified"
                        />
                        <div className={styles.codePanel} style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#71717a' }}>Raw Value: </span>
                            <span style={{ fontWeight: 600, color: '#18181b' }}>
                                {timeString || "(undefined)"}
                            </span>
                        </div>
                    </div>
                ),
                usage: usage,
                props: [
                    ...getPropItems(),
                    {
                        name: 'value',
                        type: 'string',
                        description: '선택된 시간 값 (HH:mm 형식)',
                    },
                    {
                        name: 'onChange',
                        type: '(value: string) => void',
                        description: '시간 변경 시 호출되는 이벤트 핸들러',
                    }
                ]
            }}
            combinations={{
                title: "Usage Examples",
                description: "다양한 형식의 시간 선택기 활용 예시입니다.",
                content: (
                    <div className={styles.gridTwoCols}>
                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Unified (Default for Builder)</h4>
                            <p className={styles.textSmall} style={{ color: '#71717a', marginBottom: '8px' }}>
                                모달을 통해 오전/오후, 시, 분을 한 번에 선택합니다.
                            </p>
                            <div className={styles.canvas} style={{ padding: '24px' }}>
                                <TimePicker value="14:30" onChange={() => { }} variant="unified" />
                            </div>
                        </div>

                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Disabled State</h4>
                            <div className={styles.canvas} style={{ padding: '24px' }}>
                                <TimePicker value="11:00" onChange={() => { }} disabled variant="unified" />
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
