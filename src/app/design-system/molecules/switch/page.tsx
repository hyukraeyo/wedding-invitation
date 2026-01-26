"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import { Switch } from "@/components/ui/Switch";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function SwitchPage() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Switch</h1>
                <p className={styles.textMuted}>
                    즉각적으로 설정 상태를 켜고 끄는 토글 스위치입니다.
                </p>
            </header>

            <div className={styles.storySection}>
                <Story title="Basic Switch" description="Simple toggle switch">
                    <div className={styles.showcaseStack}>
                        <div className={styles.rowGap2}>
                            <Switch
                                checked={isChecked}
                                onCheckedChange={setIsChecked}
                                aria-label="Toggle demo"
                            />
                            <span>{isChecked ? 'On' : 'Off'}</span>
                        </div>
                    </div>
                </Story>

                <Story title="States" description="Disabled states">
                    <div className={styles.showcaseStack}>
                        <div className={styles.rowGap2}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Switch disabled checked={false} />
                                <span className={styles.textMuted}>Disabled Off</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Switch disabled checked={true} />
                                <span className={styles.textMuted}>Disabled On</span>
                            </div>
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={`import { Switch } from "@/components/ui/Switch";\n\n<Switch\n  checked={enabled}\n  onCheckedChange={setEnabled}\n/>`}
                    props={[
                        { name: "checked", type: "boolean", description: "활성화 여부" },
                        { name: "onCheckedChange", type: "(checked: boolean) => void", description: "상태 변경 콜백" },
                        { name: "disabled", type: "boolean", description: "비활성화 여부" },
                    ]}
                />
            </div>
        </>
    );
}
