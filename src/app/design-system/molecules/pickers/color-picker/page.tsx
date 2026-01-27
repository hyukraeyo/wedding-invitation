"use client";

import React, { useState } from "react";
import DesignSystemPage from "../../../DesignSystemPage";
import styles from "../../../DesignSystem.module.scss";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { usePropControls } from "../../../hooks/usePropControls";

export default function ColorPickerPage() {
    const [color, setColor] = useState("#FBC02D");

    const { getPropItems } = usePropControls({
        value: {
            type: 'text',
            defaultValue: "#FBC02D",
            description: "현재 선택된 색상 값 (Hex)",
            componentType: 'string'
        },
        colors: {
            type: 'text',
            defaultValue: "[]",
            description: "사전 정의된 추천 색상 팔레트",
            componentType: 'string[]'
        }
    });

    const usage = `import { ColorPicker } from "@/components/ui/ColorPicker";

const [color, setColor] = useState("${color}");

<ColorPicker 
  value={color} 
  onChange={setColor}
  colors={["#FBC02D", "#E53935", "#1E88E5", ...]} 
/>`;

    return (
        <DesignSystemPage
            title="Color Picker"
            description="사용자가 테마 색상을 쉽고 직관적으로 선택할 수 있도록 돕는 컴포넌트입니다. 미리 정의된 팔레트와 커스텀 선택 모두 지원합니다."
            playground={{
                title: "Playground",
                description: "색상을 선택하고 변경되는 값을 확인해보세요.",
                content: (
                    <div className={styles.showcaseStack} style={{ width: '100%', maxWidth: '320px', padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#3f3f46' }}>Selected Color</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '12px', padding: '4px 8px', background: '#f4f4f5', borderRadius: '6px' }}>
                                {color}
                            </span>
                        </div>
                        <ColorPicker
                            value={color}
                            onChange={setColor}
                            colors={["#FBC02D", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5"]}
                        />
                    </div>
                ),
                usage: usage,
                props: getPropItems()
            }}
        />
    );
}
