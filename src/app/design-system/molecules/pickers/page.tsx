"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { DatePickerDemo } from "./_components/DatePickerDemo";
import { ColorPickerDemo } from "./_components/ColorPickerDemo";
import { usePropControls } from "../../hooks/usePropControls";

export default function PickersPage() {
    const { getPropItems } = usePropControls({
        "DatePicker: value": {
            description: "YYYY-MM-DD 형식의 날짜 문자열",
            componentType: 'string'
        },
        "ColorPicker: colors": {
            description: "프리셋 컬러 배열",
            componentType: 'string[]'
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Pickers</h1>
                <p className={styles.textMuted}>날짜, 시간, 컬러 값을 선택하기 위한 전용 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="date" title="Date & Time" description="Calendar, date, and time inputs">
                    <DatePickerDemo />
                </Story>

                <Story id="color" title="Color Selectors" description="Custom color pickers for theme customization">
                    <ColorPickerDemo />
                </Story>

                <DocSection
                    usage={`import { DatePicker } from "@/components/common/DatePicker";\nimport { ColorPicker } from "@/components/ui/ColorPicker";\n\nconst [date, setDate] = useState<Date>();\nconst [color, setColor] = useState("#FBC02D");\n\n<DatePicker value={date} onChange={setDate} />\n<ColorPicker value={color} onChange={setColor} />`}
                    props={getPropItems()}
                />
            </div>
        </>
    );
}
