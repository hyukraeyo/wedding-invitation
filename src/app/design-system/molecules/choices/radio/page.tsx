"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import DocSection from "../../../DocSection";
import { RadioGroupDemo } from "../_components/RadioGroupDemo";
import { SegmentedControlDemo } from "../_components/SegmentedControlDemo";

export default function RadioGroupPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <h1>Radio Group</h1>
        <p className={styles.textMuted}>Standard selection pattern for mutually exclusive options</p>
      </header>

      <div className={styles.storySection}>
        <Story id="radio" title="Radio Group Usage">
          <RadioGroupDemo />
        </Story>

        <Story id="segmented" title="Segmented Usage">
          <p className={styles.textMuted} style={{ marginBottom: "16px" }}>
            Use <code>variant=&quot;segmented&quot;</code> to display options as a segmented control.
          </p>
          <SegmentedControlDemo />
        </Story>

        <DocSection
          title="Documentation"
          usage={`import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Label } from "@/components/ui/Label";
import { LayoutGrid, List } from "lucide-react";

export function RadioGroupExample() {
  const [value, setValue] = useState("a");
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* 1. Standard Radio Group (Compound) */}
      <RadioGroup defaultValue="otp1">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <RadioGroupItem value="otp1" id="r1" />
          <Label htmlFor="r1">Standard Option</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <RadioGroupItem value="otp2" id="r2" />
          <Label htmlFor="r2">Another Option</Label>
        </div>
      </RadioGroup>

      {/* 2. Data-Driven Radio Group */}
      <RadioGroup 
        value={value} 
        onValueChange={setValue} 
        options={[
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" }
        ]} 
      />

      {/* 3. Segmented Control */}
      <RadioGroup 
        variant="segmented"
        value={viewMode}
        onValueChange={setViewMode}
        options={[
          { label: "Grid", value: "grid", icon: <LayoutGrid size={16} /> },
          { label: "List", value: "list", icon: <List size={16} /> }
        ]}
      />
    </div>
  );
}`}
          props={[
            { name: "value", type: "string", description: "Selected value (controlled state)" },
            { name: "onValueChange", type: "(value: string) => void", description: "Callback when value changes" },
            { name: "variant", type: '"default" | "segmented"', defaultValue: '"default"', description: "Visual style variant" },
            { name: "options", type: "RadioOption[]", description: "Array of options to render data-driven" },
            { name: "size", type: '"small" | "medium" | "large"', defaultValue: '"medium"', description: "Size of the segmented control" },
            { name: "fullWidth", type: "boolean", defaultValue: "false", description: "Whether to take up full width (segmented only)" },
          ]}
        />
      </div>
    </>
  );
}
