"use client";

import React from "react";
import dynamic from "next/dynamic";
import styles from "../../DesignSystem.module.scss";
import { Label } from "@/components/ui/Label";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor/RichTextEditor").then(mod => mod.RichTextEditor), {
    ssr: false,
    loading: () => (
        <div className={styles.loadingBox}>Loading editor...</div>
    ),
});

export default function EditorPage() {
    const { values, setValue, getPropItems } = usePropControls({
        content: {
            type: 'text',
            defaultValue: "<p>Hello <strong>Banana</strong> Wedding!</p>",
            description: "에디터 내용 (HTML)",
            componentType: 'string'
        },
        placeholder: {
            type: 'text',
            defaultValue: "내용을 입력하세요",
            description: "Placeholder",
            componentType: 'string'
        },
        minHeight: {
            type: 'text',
            defaultValue: "300",
            description: "최소 높이",
            componentType: 'number | string'
        },
        onChange: {
            description: "내용 변경 콜백",
            componentType: '(content: string) => void'
        }
    });

    const minHeightValue = Number(values.minHeight);
    const resolvedMinHeight = Number.isNaN(minHeightValue) ? 300 : minHeightValue;

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Rich Text Editor</h1>
                <p className={styles.textMuted}>복잡한 서식의 텍스트를 작성하기 위한 Tiptap 기반 에디터입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Rich Text Editor" description="Tiptap rich text editor for complex content">
                    <div className={styles.widthFull}>
                        <RichTextEditor
                            content={values.content as string}
                            onChange={(next) => setValue('content', next)}
                            placeholder={values.placeholder as string}
                            minHeight={resolvedMinHeight}
                        />
                        <div className={styles.previewBox} style={{ marginTop: 24 }}>
                            <Label className={styles.labelMuted}>Preview HTML</Label>
                            <div className={styles.monoText}>{values.content as string}</div>
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={`import { RichTextEditor } from "@/components/ui/RichTextEditor";\n\n<RichTextEditor\n  content={content}\n  onChange={setContent}\n  placeholder="${values.placeholder}"\n/>`}
                    props={getPropItems()}
                />
            </div>
        </>
    );
}
