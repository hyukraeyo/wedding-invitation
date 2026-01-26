"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DesignSystem.module.scss";
import { clsx } from "clsx";
import {
    Palette,
    Type,
    MousePointer2,
    BadgeCheck,
    FormInput,
    MessageSquare,
    Navigation,
    LayoutGrid,
    Loader,
    Layers,
    Circle,
    Ruler,
    ChevronDown,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Sidebar Navigation Items
const navSections = [
    {
        title: "Foundation",
        items: [
            { id: "colors", label: "Colors", icon: Palette, href: "/design-system/colors" },
            { id: "typography", label: "Typography", icon: Type, href: "/design-system/typography" },
            { id: "spacing", label: "Spacing", icon: Ruler, href: "/design-system/spacing" },
            { id: "radius", label: "Border Radius", icon: Circle, href: "/design-system/radius" },
        ],
    },
    {
        title: "Components",
        items: [
            { id: "buttons", label: "Buttons", icon: MousePointer2, href: "/design-system/buttons" },
            { id: "badges", label: "Badges", icon: BadgeCheck, href: "/design-system/badges" },
            { id: "forms", label: "Forms & Inputs", icon: FormInput, href: "/design-system/forms" },
            { id: "feedback", label: "Feedback", icon: MessageSquare, href: "/design-system/feedback" },
            { id: "accordions", label: "Accordions", icon: ChevronDown, href: "/design-system/accordions" },
            { id: "navigation", label: "Navigation", icon: Navigation, href: "/design-system/navigation" },
            { id: "overlays", label: "Modals & Overlays", icon: Layers, href: "/design-system/overlays" },
            { id: "cards", label: "Cards", icon: LayoutGrid, href: "/design-system/cards" },
            { id: "skeleton", label: "Skeleton", icon: Loader, href: "/design-system/skeleton" },
        ],
    },
];

export default function DesignSystemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
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
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <Link href="/design-system" className={styles.sidebarHeader}>
                    <h1>🍌 Design System</h1>
                    <p>Banana Wedding UI Kit</p>
                </Link>

                <nav className={styles.sidebarNav}>
                    {navSections.map((section) => (
                        <div key={section.title} className={styles.sidebarSection}>
                            <div className={styles.sidebarSectionTitle}>{section.title}</div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={clsx(
                                        styles.sidebarLink,
                                        pathname === item.href && styles["sidebarLink--active"]
                                    )}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarControls}>
                    <div className={styles.sidebarSectionTitle}>
                        <Settings size={14} style={{ marginRight: 6 }} />
                        Theme Playground
                    </div>
                    <div className={styles.sidebarControlItem}>
                        <label>
                            <span>Radius</span>
                            <span>{radius}px</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="32"
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.sidebarControlItem}>
                        <label>
                            <span>Shadow</span>
                            <span>{shadowIntensity}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            value={shadowIntensity}
                            onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={styles.sidebarControlReset}
                        onClick={() => { setRadius(16); setShadowIntensity(8); }}
                    >
                        Reset Defaults
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.container}>
                    {children}
                </div>
            </main>
        </div>
    );
}
