"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Calendar } from "@/components/ui/Calendar";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Textarea } from "@/components/ui/Textarea";
import { DatePicker } from "@/components/common/DatePicker";
import { PhoneField } from "@/components/common/PhoneField";
import { SwitchField } from "@/components/common/SwitchField";
import { TextField } from "@/components/common/TextField";
import { TimePicker } from "@/components/common/TimePicker";
import styles from "../DesignSystem.module.scss";
import Story from "../Story";

const RichTextEditor = dynamic(() => import("@/components/common/RichTextEditor/RichTextEditor"), {
    ssr: false,
    loading: () => (
        <div className="h-[200px] flex items-center justify-center border rounded-xl bg-zinc-50 text-zinc-400">Loading editor...</div>
    ),
});

export default function InputsTab() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [color, setColor] = useState("#FBC02D");
    const [richText, setRichText] = useState("<p>Hello <strong>Banana</strong> Wedding!</p>");
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [dateString, setDateString] = useState("2024-12-24");
    const [timeString, setTimeString] = useState("12:30");

    return (
        <div className={styles.storySection}>
            <Story title="Text Fields" description="Basic text inputs and textarea variants">
                <div className="flex flex-col gap-4 w-full">
                    <TextField label="Display Name" placeholder="Your name" />
                    <TextField label="Multiline Field" placeholder="Tell us your story..." helpText="Auto-expanding textarea" multiline rows={4} />
                    <div className="space-y-1.5">
                        <Label>Raw Textarea</Label>
                        <Textarea placeholder="Directly using the ui/Textarea component" />
                    </div>
                </div>
            </Story>

            <Story title="Special Fields" description="Phone, radio, and switch controls">
                <div className="flex flex-col gap-4 w-full">
                    <PhoneField label="Phone" placeholder="010-0000-0000" />
                    <div className="space-y-3">
                        <Label>Selection Group</Label>
                        <RadioGroup defaultValue="1" className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="r1" />
                                <Label htmlFor="r1">Option One</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id="r2" />
                                <Label htmlFor="r2">Option Two</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <SwitchField
                        label="Notifications"
                        checked={isNotificationsEnabled}
                        onChange={setIsNotificationsEnabled}
                    />
                </div>
            </Story>

            <Story title="Common Selectors" description="Selects and color pickers">
                <div className="space-y-4 w-full">
                    <Label>Theme Selection</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minimal">Minimal White</SelectItem>
                            <SelectItem value="floral">Sweet Floral</SelectItem>
                            <SelectItem value="modern">Modern Dark</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="pt-2">
                        <Label className="mb-2 block">Brand Colors</Label>
                        <ColorPicker
                            value={color}
                            onChange={setColor}
                            colors={["#FBC02D", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5"]}
                        />
                    </div>
                </div>
            </Story>

            <Story title="Date & Time Controls" description="Calendar, date, and time inputs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="space-y-4">
                        <Label>Standard Calendar</Label>
                        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-2xl border bg-white p-4 shadow-sm" />
                    </div>
                    <div className="space-y-6">
                        <DatePicker value={dateString} onChange={setDateString} />
                        <div className="space-y-1.5">
                            <Label>Event Time</Label>
                            <TimePicker value={timeString} onChange={setTimeString} />
                        </div>
                        <SegmentedControl defaultValue="s">
                            <SegmentedControl.Item value="s">Small</SegmentedControl.Item>
                            <SegmentedControl.Item value="m">Medium</SegmentedControl.Item>
                            <SegmentedControl.Item value="l">Large</SegmentedControl.Item>
                        </SegmentedControl>
                    </div>
                </div>
            </Story>

            <Story title="Rich Text Editor" description="Tiptap rich text editor">
                <div className="w-full">
                    <RichTextEditor
                        content={richText}
                        onChange={setRichText}
                        placeholder="Write a short message..."
                        minHeight={200}
                    />
                    <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-dashed">
                        <Label className="mb-2 block text-xs text-zinc-400">Preview HTML</Label>
                        <div className="text-sm font-mono text-zinc-600 truncate">{richText}</div>
                    </div>
                </div>
            </Story>
        </div>
    );
}
