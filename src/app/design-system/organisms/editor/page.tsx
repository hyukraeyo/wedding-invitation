"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../DesignSystem.module.scss";
import { Label } from "@/components/ui/Label";
import Story from "../../Story";
import DocSection from "../../DocSection";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor/RichTextEditor").then(mod => mod.RichTextEditor), {
    ssr: false,
    loading: () => (
        <div className={styles.loadingBox}>Loading editor...</div>
    ),
});

export default function EditorPage() {
    const [richText, setRichText] = useState("<p>Hello <strong>Banana</strong> Wedding!</p>");

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
                            content={richText}
                            onChange={setRichText}
                            placeholder="Write a short message..."
                            minHeight={300}
                        />
                        <div className={styles.previewBox} style={{ marginTop: 24 }}>
                            <Label className={styles.labelMuted}>Preview HTML</Label>
                            <div className={styles.monoText}>{richText}</div>
                        </div>
                    </div>
                </Story>

                <DocSection
                    title="RichTextEditor Documentation"
                    usage={`import { RichTextEditor } from "@/components/ui/RichTextEditor";\n\n<RichTextEditor\n  content={content}\n  onChange={setContent}\n  placeholder="내용을 입력하세요"\n/>`}
                    props={[
                        { name: "content", type: "string", description: "에디터 내용 (HTML)" },
                        { name: "onChange", type: "(content: string) => void", description: "내용 변경 콜백" },
                        { name: "placeholder", type: "string", description: "Placeholder" },
                        { name: "minHeight", type: "number | string", defaultValue: "200", description: "최소 높이" },
                    ]}
                />
            </div>
        </>
    );
}
