"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { IconButton } from "@/components/ui/IconButton";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Switch } from "@/components/ui/Switch";
import { Toggle } from "@/components/ui/Toggle";
import {
    Banana,
    Bell,
    Bold,
    Heart,
    Italic,
    LogOut,
    MessageSquare,
    MoreVertical,
    Settings,
    Share2,
    Underline,
    User,
} from "lucide-react";
import styles from "../DesignSystem.module.scss";
import Story from "../Story";

interface FoundationsTabProps {
    radius: number;
    shadowIntensity: number;
    onRadiusChange: (value: number) => void;
    onShadowIntensityChange: (value: number) => void;
}

export default function FoundationsTab({
    radius,
    shadowIntensity,
    onRadiusChange,
    onShadowIntensityChange,
}: FoundationsTabProps) {
    const [toggleState, setToggleState] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    const applyPreset = (presetRadius: number, presetShadow: number) => {
        onRadiusChange(presetRadius);
        onShadowIntensityChange(presetShadow);
    };

    return (
        <div className={styles.storySection}>
            <div className={styles.controls}>
                <h2>Theme Controls (Real-time)</h2>
                <div className={styles.controlItem}>
                    <label>
                        <span>Border Radius</span>
                        <span>{radius}px</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        value={radius}
                        onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                    />
                </div>

                <div className={styles.controlItem}>
                    <label>
                        <span>Shadow Depth</span>
                        <span>{shadowIntensity}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        value={shadowIntensity}
                        onChange={(e) => onShadowIntensityChange(parseInt(e.target.value))}
                    />
                </div>

                <div className={styles.controlItem}>
                    <div className={styles.presetGrid}>
                        <Button variant="outline" size="sm" onClick={() => applyPreset(4, 4)}>Edge</Button>
                        <Button variant="outline" size="sm" onClick={() => applyPreset(16, 8)}>Soft</Button>
                        <Button variant="outline" size="sm" onClick={() => applyPreset(32, 12)}>Round</Button>
                    </div>
                </div>
            </div>

            <Story title="Iconography (Lucide)" description="紐낇솗???섎? ?꾨떖???꾪븳 ?꾩씠肄??쒖뒪??">
                <div className="flex gap-6 text-zinc-600">
                    <Banana size={24} />
                    <Heart size={24} />
                    <User size={24} />
                    <Settings size={24} />
                    <MessageSquare size={24} />
                    <Bell size={24} />
                    <Share2 size={24} />
                </div>
            </Story>

            <Story title="Action Buttons" description="?ъ슜?먯쓽 二쇱슂 ?됰룞???좊룄?섎뒗 踰꾪듉 而댄룷?뚰듃">
                <div className={styles.specTable}>
                    <div className={styles.specRow}>
                        <h4>Variants</h4>
                        <div className={styles.specGrid}>
                            <Button>Default</Button>
                            <Button variant="solid">Solid (Primary)</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link Style</Button>
                        </div>
                    </div>
                    <div className={styles.specRow}>
                        <h4>Sizes</h4>
                        <div className={styles.specGrid}>
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large Action</Button>
                            <Button size="icon"><Settings size={18} /></Button>
                        </div>
                    </div>
                    <div className={styles.specRow}>
                        <h4>States</h4>
                        <div className={styles.specGrid}>
                            <Button disabled>Disabled</Button>
                            <Button loading>Loading</Button>
                        </div>
                    </div>
                </div>
            </Story>

            <Story title="Icon Controls" description="?쒓컖??紐낇솗?깆쓣 ?꾪븳 ?꾩씠肄?以묒떖???≪뀡">
                <div className={styles.specTable}>
                    <div className={styles.specRow}>
                        <h4>Icon Button Variants</h4>
                        <div className={styles.specGrid}>
                            <div className="flex flex-col gap-2 items-center"><span className={styles.labelChip}>Solid</span><IconButton icon={Settings} variant="solid" /></div>
                            <div className="flex flex-col gap-2 items-center"><span className={styles.labelChip}>Outline</span><IconButton icon={User} variant="outline" /></div>
                            <div className="flex flex-col gap-2 items-center"><span className={styles.labelChip}>Ghost</span><IconButton icon={LogOut} variant="ghost" /></div>
                            <div className="flex flex-col gap-2 items-center"><span className={styles.labelChip}>Secondary</span><IconButton icon={Bell} variant="secondary" /></div>
                            <div className="flex flex-col gap-2 items-center"><span className={styles.labelChip}>Glass</span><IconButton icon={MoreVertical} variant="glass" className="bg-zinc-900 text-white" /></div>
                        </div>
                    </div>

                    <div className={styles.specRow}>
                        <h4>Icon Button Sizes</h4>
                        <div className={styles.specGrid}>
                            <div className="flex flex-col gap-2">
                                <span className={styles.labelChip}>XS (28px)</span>
                                <IconButton icon={Settings} size="xs" variant="outline" aria-label="Settings" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={styles.labelChip}>SM (40px)</span>
                                <IconButton icon={Settings} size="sm" variant="outline" aria-label="Settings" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={styles.labelChip}>MD (48px)</span>
                                <IconButton icon={Settings} size="md" variant="outline" aria-label="Settings" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={styles.labelChip}>LG (56px)</span>
                                <IconButton icon={Settings} size="lg" variant="outline" aria-label="Settings" />
                            </div>
                        </div>
                    </div>
                </div>
            </Story>

            <Story title="Selection & Toggles" description="?낅┰?곸씤 ?띿꽦 ?쒖뼱瑜??꾪븳 ?ㅼ쐞移?諛??명꽣?숉떚釉?移?">
                <div className={styles.specTable}>
                    <div className={styles.specRow}>
                        <h4>Toggle Components</h4>
                        <div className={styles.specGrid}>
                            <div className="flex flex-col gap-2">
                                <span className={styles.labelChip}>Switch</span>
                                <div className="flex items-center gap-3">
                                    <Switch id="sw-ds-1" />
                                    <Label htmlFor="sw-ds-1" className="text-sm">Enable notifications</Label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={styles.labelChip}>Checkbox</span>
                                <div className="flex items-center gap-3">
                                    <Checkbox id="cb-ds-1" />
                                    <Label htmlFor="cb-ds-1" className="text-sm">Accept terms of use</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.specRow}>
                        <h4>Toggle Group (Rich Text Example)</h4>
                        <div className={styles.specGrid}>
                            <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
                                <Toggle
                                    aria-label="Bold"
                                    pressed={toggleState.bold}
                                    onPressedChange={(v) => setToggleState((s) => ({ ...s, bold: v }))}
                                >
                                    <Bold size={16} />
                                </Toggle>
                                <Toggle
                                    aria-label="Italic"
                                    pressed={toggleState.italic}
                                    onPressedChange={(v) => setToggleState((s) => ({ ...s, italic: v }))}
                                >
                                    <Italic size={16} />
                                </Toggle>
                                <Toggle
                                    aria-label="Underline"
                                    pressed={toggleState.underline}
                                    onPressedChange={(v) => setToggleState((s) => ({ ...s, underline: v }))}
                                >
                                    <Underline size={16} />
                                </Toggle>
                            </div>
                        </div>
                    </div>
                </div>
            </Story>

            <Story title="Separators" description="肄섑뀗痢??곸뿭 援щ텇???꾪븳 ?쒓컖???쇱씤">
                <div className={styles.specTable}>
                    <div className={styles.specRow}>
                        <h4>Horizontal</h4>
                        <div className="w-full max-w-md p-4 rounded-xl border bg-zinc-50/50">
                            <div className="text-sm font-bold mb-2">Section Alpha</div>
                            <Separator className="my-4" />
                            <div className="text-sm font-bold mt-2">Section Beta</div>
                        </div>
                    </div>
                    <div className={styles.specRow}>
                        <h4>Vertical</h4>
                        <div className="flex h-5 items-center space-x-4 text-sm font-medium">
                            <div>Home</div>
                            <Separator orientation="vertical" />
                            <div>Dashboard</div>
                            <Separator orientation="vertical" />
                            <div>Settings</div>
                        </div>
                    </div>
                </div>
            </Story>
        </div>
    );
}
