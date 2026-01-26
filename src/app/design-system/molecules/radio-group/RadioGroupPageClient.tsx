"use client";

import React, { useState } from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { LayoutGrid, List, Layers } from "lucide-react";

export default function RadioGroupPageClient() {
  const [variant, setVariant] = useState<"segmented" | "basic">("segmented");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [fullWidth, setFullWidth] = useState(false);
  const [value, setValue] = useState("apple");

  const options = [
    { label: "사과", value: "apple", icon: <Layers size={16} />, description: "달콤하고 아삭한 사과" },
    { label: "오렌지", value: "orange", icon: <LayoutGrid size={16} />, description: "상큼한 비타민 오렌지" },
    { label: "포도", value: "grape", icon: <List size={16} />, description: "달콤한 포도 송이" },
  ];

  const radioUsage = variant === "segmented"
    ? `import { RadioGroup } from "@/components/ui/RadioGroup";

<RadioGroup
  variant="segmented"
  size="${size}"
  ${fullWidth ? "fullWidth" : ""}
  value={value}
  onValueChange={setValue}
  options={[
    { label: "사과", value: "apple" },
    { label: "오렌지", value: "orange" },
    { label: "포도", value: "grape" }
  ]}
/>`
    : `import { RadioGroup } from "@/components/ui/RadioGroup";

<RadioGroup
  value={value}
  onValueChange={setValue}
  options={[
    { label: "사과", value: "apple" },
    { label: "오렌지", value: "orange" },
    { label: "포도", value: "grape" }
  ]}
/>`;

  return (
    <DesignSystemPage
      title="Radio Group (라디오 그룹)"
      description="여러 옵션 중 하나를 선택할 때 사용하는 라디오 그룹과 세그먼트 컨트롤입니다. 웹 접근성(WAI-ARIA)을 준수합니다."
      playground={{
        title: "미리보기",
        description: "라디오 그룹의 다양한 속성을 실시간으로 테스트해보세요.",
        canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
        content: (
          <div style={{ width: fullWidth ? '100%' : 'auto', maxWidth: '400px' }}>
            {variant === "segmented" ? (
              <RadioGroup
                variant="segmented"
                size={size}
                fullWidth={fullWidth}
                value={value}
                onValueChange={setValue}
                options={options}
              />
            ) : (
              <RadioGroup
                variant="basic"
                value={value}
                onValueChange={setValue}
                options={options.map(({ label, value }) => ({ label, value }))}
              />
            )}
          </div>
        ),
        usage: radioUsage,
        props: [
          {
            name: "variant",
            type: '"segmented" | "basic"',
            description: "시각적 스타일 변형",
            control: {
              type: 'segmented',
              value: variant,
              onChange: (val) => setVariant(val as "segmented" | "basic"),
              options: ["segmented", "basic"]
            }
          },
          {
            name: "size",
            type: '"sm" | "md" | "lg"',
            description: "크기 (segmented 전용)",
            control: {
              type: 'select',
              value: size,
              onChange: (val) => setSize(val as "sm" | "md" | "lg"),
              options: ["sm", "md", "lg"]
            }
          },
          {
            name: "fullWidth",
            type: "boolean",
            description: "전체 너비 차지 여부 (segmented 전용)",
            control: { type: 'boolean', value: fullWidth, onChange: (val) => setFullWidth(val as boolean) }
          },
          {
            name: "value",
            type: "string",
            description: "현재 선택된 값",
          }
        ]
      }}
    />
  );
}
