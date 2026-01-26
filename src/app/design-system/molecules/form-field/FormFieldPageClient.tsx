"use client";

import React, { useState } from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { FormField } from "@/components/common/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";

export default function FormFieldPageClient() {
    const [label, setLabel] = useState("필드 레이블");
    const [description, setDescription] = useState("성함을 입력해주세요.");
    const [error, setError] = useState("");
    const [required, setRequired] = useState(true);
    const [layout, setLayout] = useState<"vertical" | "horizontal">("vertical");

    const usage = `import { FormField } from "@/components/common/FormField";
import { Input } from "@/components/ui/Input";

<FormField
  label="${label}"
  description="${description}"
  ${error ? `error="${error}"` : ""}
  ${required ? "required" : ""}
  layout="${layout}"
>
  <Input placeholder="내용을 입력하세요" />
</FormField>`;

    return (
        <DesignSystemPage
            title="Form Field (공통 래퍼)"
            description="모든 입력 요소의 레이아웃(레이블, 설명, 에러 메시지)을 일관되게 관리하는 공통 래퍼 컴포넌트입니다. ID 자동 매핑을 통해 웹 접근성(A11y)을 완벽하게 지원합니다."
            playground={{
                title: "인터랙티브 플레이그라운드",
                description: "다양한 속성을 조절하며 공통 레이아웃 시스템을 테스트해보세요.",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
                content: (
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <FormField
                            label={label || undefined}
                            description={description || undefined}
                            error={error || undefined}
                            required={required}
                            layout={layout}
                        >
                            <Input placeholder="자동으로 레이블과 연결됩니다" />
                        </FormField>
                    </div>
                ),
                usage: usage,
                props: [
                    {
                        name: "label",
                        type: "ReactNode",
                        description: "필드 레이블 (id가 정의된 경우 자동으로 htmlFor 매핑됨)",
                        control: { type: 'text', value: label, onChange: (val) => setLabel(val as string) }
                    },
                    {
                        name: "description",
                        type: "ReactNode",
                        description: "하단 보조 설명",
                        control: { type: 'text', value: description, onChange: (val) => setDescription(val as string) }
                    },
                    {
                        name: "error",
                        type: "ReactNode",
                        description: "에러 메시지 (값이 있으면 description 대신 노출되며 스타일이 변경됨)",
                        control: { type: 'text', value: error, onChange: (val) => setError(val as string) }
                    },
                    {
                        name: "required",
                        type: "boolean",
                        description: "필수 여부 (레이블 옆 별표 표시)",
                        control: { type: 'boolean', value: required, onChange: (val) => setRequired(val as boolean) }
                    },
                    {
                        name: "layout",
                        type: '"vertical" | "horizontal"',
                        description: "레이블과 입력 요소의 배치 방향",
                        control: {
                            type: 'segmented',
                            value: layout,
                            onChange: (val) => setLayout(val as "vertical" | "horizontal"),
                            options: ["vertical", "horizontal"]
                        }
                    },
                ]
            }}
            combinations={{
                title: "조합 예시",
                description: "FormField는 모든 종류의 입력 컴포넌트와 작동합니다.",
                canvasStyle: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '40px' },
                content: (
                    <>
                        <FormField label="자기소개" description="간략한 소개를 남겨주세요." layout="vertical">
                            <Textarea placeholder="안녕하세요..." />
                        </FormField>

                        <FormField label="알림 설정" description="푸시 알림을 받습니다." layout="horizontal">
                            <Switch />
                        </FormField>

                        <FormField label="선호 과일" description="하나를 선택해주세요." layout="vertical">
                            <RadioGroup
                                options={[
                                    { label: "사과", value: "apple" },
                                    { label: "오렌지", value: "orange" }
                                ]}
                            />
                        </FormField>

                        <FormField label="지역 선택" layout="vertical">
                            <Select
                                placeholder="서울/경기"
                                options={[
                                    { label: "서울", value: "seoul" },
                                    { label: "경기", value: "gyeonggi" }
                                ]}
                            />
                        </FormField>
                    </>
                )
            }}
        />
    );
}
