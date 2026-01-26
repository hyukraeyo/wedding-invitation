"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { RadioGroupField } from "@/components/common/RadioGroupField";
import { LayoutGrid, List, Layers } from "lucide-react";

export default function RadioGroupPageClient() {
  const [variant, setVariant] = useState<"default" | "segmented">("default");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [fullWidth, setFullWidth] = useState(false);
  const [value, setValue] = useState("apple");

  //Exposure Controls
  const [showLabel, setShowLabel] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  const [labelText, setLabelText] = useState("과일 선택");
  const [descriptionText, setDescriptionText] = useState("원하시는 과일을 하나 선택해주세요.");

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
    : `import { RadioGroupField } from "@/components/common/RadioGroupField";

<RadioGroupField
  ${showLabel ? `label="${labelText}"` : ""}
  ${showDescription ? `description="${descriptionText}"` : ""}
  value={value}
  onValueChange={setValue}
  options={[
    { label: "사과", value: "apple", description: "달콤하고 아삭한 사과" },
    { label: "오렌지", value: "orange", description: "상큼한 비타민 오렌지" },
    { label: "포도", value: "grape", description: "달콤한 포도 송이" }
  ]}
/>`;

  return (
    <>
      <header className={styles.pageHeader}>
        <h1>Radio Group (라디오 그룹)</h1>
        <p className={styles.textMuted}>여러 옵션 중 하나를 선택할 때 사용하는 라디오 그룹과 세그먼트 컨트롤입니다. 웹 접근성(WAI-ARIA)을 준수합니다.</p>
      </header>

      <div className={styles.storySection}>
        <Story id="playground" title="미리보기" description="라디오 그룹의 다양한 속성을 실시간으로 테스트해보세요.">
          <div
            className={styles.canvas}
            role="region"
            aria-label="Radio Group Preview Canvas"
            style={{ alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}
          >
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
                <RadioGroupField
                  label={labelText}
                  description={descriptionText}
                  hideLabel={!showLabel}
                  hideDescription={!showDescription}
                  value={value}
                  onValueChange={setValue}
                  options={options.map(({ label, value, description }) => ({ label, value, description }))}
                />
              )}
            </div>
          </div>
        </Story>

        <DocSection
          usage={radioUsage}
          props={[
            {
              name: "variant",
              type: '"default" | "segmented"',
              description: "시각적 스타일 변형",
              control: {
                type: 'radio',
                value: variant,
                onChange: (val) => setVariant(val as "default" | "segmented"),
                options: ["default", "segmented"]
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
              name: "showLabel",
              type: "boolean",
              description: "레이블 노출 여부 (default 전용)",
              control: { type: 'boolean', value: showLabel, onChange: (val) => setShowLabel(val as boolean) }
            },
            {
              name: "label",
              type: "string",
              description: "필드 레이블 (default 전용)",
              control: { type: 'text', value: labelText, onChange: (val) => setLabelText(val as string) }
            },
            {
              name: "showDescription",
              type: "boolean",
              description: "설명 노출 여부 (default 전용)",
              control: { type: 'boolean', value: showDescription, onChange: (val) => setShowDescription(val as boolean) }
            },
            {
              name: "description",
              type: "string",
              description: "필드 상세 설명 (default 전용)",
              control: { type: 'text', value: descriptionText, onChange: (val) => setDescriptionText(val as string) }
            },
            {
              name: "value",
              type: "string",
              description: "현재 선택된 값",
            }
          ]}
        />
      </div>
    </>
  );
}
