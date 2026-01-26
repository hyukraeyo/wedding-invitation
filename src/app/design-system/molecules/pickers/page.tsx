"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { DatePickerDemo } from "./_components/DatePickerDemo";
import { ColorPickerDemo } from "./_components/ColorPickerDemo";

export default function PickersPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Pickers & Calendars</h1>
                <p className={styles.textMuted}>날짜, 시간, 색상 등을 선택하기 위한 전용 컴포넌트들입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="date" title="Date & Time" description="Calendar, date, and time inputs">
                    <DatePickerDemo />
                </Story>

                <Story id="color" title="Color Selectors" description="Custom color pickers for theme customization">
                    <ColorPickerDemo />
                </Story>

                <DocSection
                    title="Picker Documentation"
                    usage={`import { DatePicker } from "@/components/common/DatePicker";\nimport { ColorPicker } from "@/components/ui/ColorPicker";\n\nconst [date, setDate] = useState<Date>();\nconst [color, setColor] = useState("#FBC02D");\n\n<DatePicker value={date} onChange={setDate} />\n<ColorPicker value={color} onChange={setColor} />`}
                    props={[
                        { name: "DatePicker: value", type: "string", description: "YYYY-MM-DD 형식의 날짜 문자열" },
                        { name: "ColorPicker: colors", type: "string[]", description: "프리셋 컬러 배열" },
                    ]}
                />
            </div>
        </>
    );
}
