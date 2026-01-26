"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import { IconButton } from "@/components/ui/IconButton";
import {
    Banana,
    Heart,
    Settings,
    Plus,
    Trash2,
    Share2,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    User
} from "lucide-react";
import Story from "../../../Story";
import DocSection from "../../../DocSection";
import { usePropControls } from "../../../hooks/usePropControls";

export default function IconButtonsPage() {
    const { values, getPropItems } = usePropControls({
        icon: {
            description: "표시할 아이콘 (Lucide React)",
            componentType: 'LucideIcon'
        },
        variant: {
            type: 'segmented',
            defaultValue: 'ghost',
            options: ["default", "secondary", "outline", "ghost", "destructive", "solid", "glass", "line"],
            description: "버튼의 시각적 스타일 변형",
            componentType: '"solid" | "line" | "ghost" | "secondary" | "outline" | "destructive" | "default" | "glass"'
        },
        size: {
            type: 'segmented',
            defaultValue: 'md',
            options: ["sm", "md", "lg"],
            description: "버튼의 크기 (Standard Touch Area 고려)",
            componentType: '"sm" | "md" | "lg"'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 상태",
            componentType: 'boolean'
        },
        rounded: {
            type: 'boolean',
            defaultValue: false,
            description: "완전한 원형 여부",
            componentType: 'boolean'
        },
        loading: {
            type: 'boolean',
            defaultValue: false,
            description: "로딩 상태 표시",
            componentType: 'boolean'
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Icon Button</h1>
                <p>텍스트 없이 아이콘만 사용하는 버튼 컴포넌트입니다. 터치 영역이 확보된 독립적인 컴포넌트로 관리됩니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="playground" title="미리보기">
                    <div className={styles.canvas} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                        <IconButton
                            icon={Banana}
                            variant={values.variant as "default" | "secondary" | "outline" | "ghost" | "destructive" | "solid" | "glass" | "line"}
                            size={values.size as "sm" | "md" | "lg"}
                            disabled={values.disabled as boolean}
                            loading={values.loading as boolean}
                            rounded={values.rounded as boolean}
                            aria-label="banana-button"
                        />
                    </div>
                </Story>

                <DocSection
                    usage={`import { IconButton } from "@/components/ui/IconButton";\nimport { Banana } from "lucide-react";\n\n<IconButton\n  icon={Banana}\n  variant="${values.variant}"\n  size="${values.size}"\n  ${values.disabled ? 'disabled' : ''}\n  ${values.loading ? 'loading' : ''}\n  ${values.rounded ? 'rounded' : ''}\n  aria-label="Banana Button"\n/>`}
                    props={getPropItems()}
                />

                <Story title="Variants" description="다양한 목적에 맞는 스타일을 제공합니다.">
                    <div className={styles.buttonRow}>
                        <IconButton icon={Plus} variant="default" aria-label="Add" />
                        <IconButton icon={Search} variant="secondary" aria-label="Search" />
                        <IconButton icon={Bell} variant="outline" aria-label="Notifications" />
                        <IconButton icon={Settings} variant="ghost" aria-label="Settings" />
                        <IconButton icon={Trash2} variant="destructive" aria-label="Delete" />
                        <IconButton icon={Share2} variant="glass" style={{ background: '#333' }} aria-label="Share" />
                    </div>
                </Story>

                <Story title="Shapes & Sizes" description="기본적인 사각형(Radius 적용) 형태와 완전한 원형(Rounded) 형태를 지원합니다.">
                    <div className={styles.verticalStack}>
                        <div className={styles.buttonRow} style={{ alignItems: 'center' }}>
                            <IconButton icon={Plus} size="sm" />
                            <IconButton icon={Plus} size="md" />
                            <IconButton icon={Plus} size="lg" />
                        </div>
                        <div className={styles.buttonRow} style={{ alignItems: 'center' }}>
                            <IconButton icon={User} size="sm" rounded />
                            <IconButton icon={User} size="md" rounded />
                            <IconButton icon={User} size="lg" rounded />
                        </div>
                    </div>
                </Story>

                <Story title="Common Patterns" description="자주 사용되는 아이콘 버튼 조합입니다.">
                    <div className={styles.showcaseGrid}>
                        <div className={styles.verticalStack}>
                            <h3>Navigation</h3>
                            <div className={styles.buttonRow}>
                                <IconButton icon={ChevronLeft} variant="outline" rounded />
                                <IconButton icon={ChevronRight} variant="outline" rounded />
                            </div>
                        </div>
                        <div className={styles.verticalStack}>
                            <h3>Actions</h3>
                            <div className={styles.buttonRow}>
                                <IconButton icon={Heart} variant="ghost" />
                                <IconButton icon={Share2} variant="ghost" />
                                <IconButton icon={Trash2} variant="ghost" />
                            </div>
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
