"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function SelectPage() {
    const [selectedRole, setSelectedRole] = useState("guest");

    const roleOptions = [
        { label: "Guest (하객)", value: "guest" },
        { label: "Family (혼주)", value: "family" },
        { label: "Staff (스태프)", value: "staff" },
    ];

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Select</h1>
                <p className={styles.textMuted}>데스크톱과 모바일 환경을 모두 고려한 반응형 셀렉트 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="fields" title="Basic Select" description="Standard dropdown selection component">
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall} style={{ maxWidth: 400 }}>
                            <Label className={styles.labelMuted}>Basic Select</Label>
                            <Select
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                                options={roleOptions}
                                placeholder="Select role"
                            />
                        </div>
                    </div>
                </Story>

                <DocSection
                    title="Select Documentation"
                    usage={`import { Select } from "@/components/ui/Select";\n\n<Select\n  value={value}\n  onValueChange={setValue}\n  options={[\n    { label: "Option 1", value: "1" },\n    { label: "Option 2", value: "2" }\n  ]}\n  placeholder="선택해주세요"\n/>`}
                    props={[
                        { name: "options", type: "SelectOption[]", description: "선택 항목 배열 ({ label, value, disabled })" },
                        { name: "value", type: "T", description: "현재 선택된 값" },
                        { name: "onValueChange", type: "(value: T) => void", description: "값 변경 시 콜백 함수" },
                        { name: "placeholder", type: "string", defaultValue: '"선택해주세요"', description: "값 미선택 시 노출될 텍스트" },
                        { name: "modalTitle", type: "string", description: "모바일 드로어 사용 시 상단 타이틀" },
                        { name: "mobileOnly", type: "boolean", defaultValue: "false", description: "데스크톱에서도 항상 모바일 드로어로 표시" },
                        { name: "desktopOnly", type: "boolean", defaultValue: "false", description: "모바일에서도 항상 팝오버로 표시" },
                    ]}
                />
            </div>
        </>
    );
}
