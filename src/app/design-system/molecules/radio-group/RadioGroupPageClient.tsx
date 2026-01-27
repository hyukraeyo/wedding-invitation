"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { LayoutGrid, List, Layers } from "lucide-react";
import { usePropControls } from "../../hooks/usePropControls";

export default function RadioGroupPageClient() {
  const { values, setValue, getPropItems } = usePropControls({
    variant: {
      type: 'segmented',
      defaultValue: 'segmented',
      options: ['segmented', 'basic'],
      description: "시각적 스타일 변형",
      componentType: '"segmented" | "basic"'
    },
    size: {
      type: 'segmented',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
      description: "크기 (segmented 전용)",
      componentType: '"sm" | "md" | "lg"'
    },
    fullWidth: {
      type: 'boolean',
      defaultValue: false,
      description: "전체 너비 차지 여부 (segmented 전용)",
      componentType: 'boolean'
    },
    value: {
      type: 'segmented',
      defaultValue: 'apple',
      options: ['apple', 'orange', 'grape'],
      description: "현재 선택된 값",
      componentType: 'string'
    }
  });

  const options = [
    { label: "사과", value: "apple", icon: <Layers size={16} />, description: "달콤하고 아삭한 사과" },
    { label: "오렌지", value: "orange", icon: <LayoutGrid size={16} />, description: "상큼한 비타민 오렌지" },
    { label: "포도", value: "grape", icon: <List size={16} />, description: "달콤한 포도 송이" },
  ];

  const radioUsage = values.variant === "segmented"
    ? `import { RadioGroup } from "@/components/ui/RadioGroup";

<RadioGroup
  variant="segmented"
  size="${values.size}"
  ${values.fullWidth ? "fullWidth" : ""}
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

  const propItems = getPropItems((key, currentValues) => {
    if (currentValues.variant !== "segmented") {
      if (key === "size" || key === "fullWidth") return false;
    }
    return true;
  });

  return (
    <DesignSystemPage
      title="Radio Groups"
      description="여러 옵션 중 하나를 선택할 때 사용하는 라디오 그룹과 세그먼트 컨트롤입니다. 웹 접근성(WAI-ARIA)을 준수합니다."
      playground={{
        title: "Playground",
        description: "라디오 그룹의 다양한 속성을 실시간으로 테스트해보세요.",
        canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
        content: (
          <div style={{ width: (values.fullWidth as boolean) ? '100%' : 'auto', maxWidth: '400px' }}>
            {values.variant === "segmented" ? (
              <RadioGroup
                variant="segmented"
                size={values.size as "sm" | "md" | "lg"}
                fullWidth={values.fullWidth as boolean}
                value={values.value as string}
                onValueChange={(val) => setValue('value', val)}
                options={options}
              />
            ) : (
              <RadioGroup
                variant="basic"
                value={values.value as string}
                onValueChange={(val) => setValue('value', val)}
                options={options.map(({ label, value }) => ({ label, value }))}
              />
            )}
          </div>
        ),
        usage: radioUsage,
        props: propItems
      }}
    />
  );
}
