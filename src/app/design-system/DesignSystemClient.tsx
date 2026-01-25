"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./DesignSystem.module.scss";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
    Banana,
    Layers,
    Layout,
    LucideIcon,
    MessageSquare,
    Monitor,
    MousePointer2,
    Palette,
    Smartphone,
    Sparkles,
} from "lucide-react";

type Category = "Foundations" | "Inputs" | "Data Display" | "Overlays" | "Patterns" | "Feedback";

const FoundationsTab = dynamic(() => import("./tabs/FoundationsTab"), { ssr: false });
const InputsTab = dynamic(() => import("./tabs/InputsTab"), { ssr: false });
const DataDisplayTab = dynamic(() => import("./tabs/DataDisplayTab"), { ssr: false });
const OverlaysTab = dynamic(() => import("./tabs/OverlaysTab"), { ssr: false });
const PatternsTab = dynamic(() => import("./tabs/PatternsTab"), { ssr: false });
const FeedbackTab = dynamic(() => import("./tabs/FeedbackTab"), { ssr: false });

const CATEGORIES: { id: Category; icon: LucideIcon; label: string; desc: string }[] = [
    { id: "Foundations", icon: Palette, label: "Foundations", desc: "Colors, Typography, Icons & Primitives" },
    { id: "Inputs", icon: MousePointer2, label: "Inputs", desc: "Form Controls & Interactive Elements" },
    { id: "Data Display", icon: Layout, label: "Data Display", desc: "Cards, Layouts & Structures" },
    { id: "Overlays", icon: Layers, label: "Overlays", desc: "Modals, Dialogs & Floating UI" },
    { id: "Feedback", icon: MessageSquare, label: "Feedback", desc: "Alerts, Toasts & States" },
    { id: "Patterns", icon: Sparkles, label: "Patterns", desc: "Composite UI & Business Logic" },
];

export default function DesignSystemClient() {
    const [activeTab, setActiveTab] = useState<Category>("Foundations");
    const [radius, setRadius] = useState(16);
    const [shadowIntensity, setShadowIntensity] = useState(8);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--radius-sm", `${radius * 0.5}px`);
        root.style.setProperty("--radius-md", `${radius}px`);
        root.style.setProperty("--radius-lg", `${radius}px`);
        root.style.setProperty("--radius-xl", `${radius * 1.25}px`);
        root.style.setProperty("--radius-2xl", `${radius * 1.5}px`);
        root.style.setProperty("--radius-3xl", `${radius * 2.5}px`);

        const alpha = (shadowIntensity / 100).toFixed(2);
        root.style.setProperty("--shadow-card", `0 4px 12px rgba(0, 0, 0, ${alpha})`);
        root.style.setProperty("--shadow-hover-card", `0 12px 24px rgba(0, 0, 0, ${(shadowIntensity * 2) / 100})`);
        root.style.setProperty("--shadow-hover-sm", `0 2px 6px rgba(0, 0, 0, ${alpha})`);
        root.style.setProperty("--shadow-hover-md", `0 6px 14px rgba(0, 0, 0, ${alpha})`);
    }, [radius, shadowIntensity]);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Banana size={20} />
                    </div>
                    <h1>Banana System</h1>
                </div>

                <nav className={styles.nav}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={cn(styles.navItem, activeTab === cat.id && styles.active)}
                            onClick={() => setActiveTab(cat.id)}
                        >
                            <cat.icon size={18} />
                            {cat.label}
                        </button>
                    ))}
                </nav>

                <div className={styles.controls}>
                    <h2>Global Theme</h2>
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
                            onChange={(e) => setRadius(parseInt(e.target.value))}
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
                            onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                        />
                    </div>

                    <div className={styles.controlItem}>
                        <div className={styles.presetGrid}>
                            <Button variant="outline" size="sm" onClick={() => { setRadius(4); setShadowIntensity(4); }}>Edge</Button>
                            <Button variant="outline" size="sm" onClick={() => { setRadius(16); setShadowIntensity(8); }}>Soft</Button>
                            <Button variant="outline" size="sm" onClick={() => { setRadius(32); setShadowIntensity(12); }}>Round</Button>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.viewport}>
                <header className={styles.pageHeader}>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-yellow-400 text-white text-[10px] font-black rounded uppercase">v1.2.0</span>
                        <div className="flex gap-2 text-zinc-300">
                            <Monitor size={14} />
                            <Smartphone size={14} />
                        </div>
                    </div>
                    <h2>{CATEGORIES.find(c => c.id === activeTab)?.label}</h2>
                    <p className="text-muted-foreground">{CATEGORIES.find(c => c.id === activeTab)?.desc}</p>
                </header>

                <div className={styles.contentArea}>
                    {activeTab === "Foundations" && (
                        <FoundationsTab
                            radius={radius}
                            shadowIntensity={shadowIntensity}
                            onRadiusChange={setRadius}
                            onShadowIntensityChange={setShadowIntensity}
                        />
                    )}

                    {activeTab === "Inputs" && (
                        <InputsTab />
                    )}

                    {activeTab === "Data Display" && (
                        <DataDisplayTab />
                    )}

                    {activeTab === "Overlays" && (
                        <OverlaysTab />
                    )}

                    {activeTab === "Patterns" && (
                        <PatternsTab />
                    )}

                    {activeTab === "Feedback" && (
                        <FeedbackTab />
                    )}
                </div>
            </main>
        </div>
    );
}
