"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { TextField } from "@/components/common/TextField";
import { PhoneField } from "@/components/common/PhoneField";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function InputsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Inputs & Text Fields</h1>
                <p className={styles.textMuted}>기본 텍스트 입력과 멀티라인 필드, 특수 목적용 텍스트 필드들입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Text Fields" description="Basic text inputs and textarea variants">
                    <div className={styles.showcaseStack}>
                        <TextField label="Display Name" placeholder="Your name" />
                        <TextField label="Multiline Field" placeholder="Tell us your story..." helpText="Auto-expanding textarea" multiline rows={4} />
                        <div className={styles.verticalStackExtraSmall}>
                            <Label>Raw Textarea</Label>
                            <Textarea placeholder="Directly using the ui/Textarea component" />
                        </div>
                    </div>
                </Story>

                <DocSection
                    title="TextField Documentation"
                    usage={`import { TextField } from "@/components/common/TextField";\n\n<TextField\n  label="Username"\n  placeholder="Enter your name"\n  helpText="Minimum 3 characters"\n/>`}
                    props={[
                        { name: "label", type: "string", description: "입력 필드 레이블" },
                        { name: "placeholder", type: "string", description: "입력 필드 placeholder" },
                        { name: "helpText", type: "ReactNode", description: "도움말 또는 에러 메시지 텍스트" },
                        { name: "hasError", type: "boolean", defaultValue: "false", description: "에러 상태 여부 (helpText가 에러 색상으로 표시됨)" },
                        { name: "multiline", type: "boolean", defaultValue: "false", description: "textarea로 렌더링 여부" },
                        { name: "rows", type: "number", description: "multiline일 경우 행 수" },
                        { name: "right", type: "ReactNode", description: "우측에 표시될 아이콘이나 컴포넌트" },
                    ]}
                />

                <Story title="Special Purpose Inputs" description="Phone numbers, formatted inputs, etc.">
                    <div className={styles.showcaseStack}>
                        <PhoneField label="Phone Number" placeholder="010-0000-0000" />
                    </div>
                </Story>
            </div>
        </>
    );
}
