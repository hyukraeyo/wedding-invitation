"use client";

import styles from "../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { Banana, Check, ArrowRight, Download, Heart } from "lucide-react";

export default function ButtonsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Buttons</h1>
                <p>사용자 인터랙션을 위한 버튼 컴포넌트입니다. 다양한 변형과 상태를 제공합니다.</p>
            </header>

            {/* Variants */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Variants</h2>
                    <p>용도에 따른 버튼 스타일 변형</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.componentGrid}>
                        <div className={styles.componentItem}>
                            <Button>Default</Button>
                            <span className={styles.componentLabel}>default</span>
                        </div>
                        <div className={styles.componentItem}>
                            <Button variant="secondary">Secondary</Button>
                            <span className={styles.componentLabel}>secondary</span>
                        </div>
                        <div className={styles.componentItem}>
                            <Button variant="destructive">Destructive</Button>
                            <span className={styles.componentLabel}>destructive</span>
                        </div>
                        <div className={styles.componentItem}>
                            <Button variant="outline">Outline</Button>
                            <span className={styles.componentLabel}>outline</span>
                        </div>
                        <div className={styles.componentItem}>
                            <Button variant="ghost">Ghost</Button>
                            <span className={styles.componentLabel}>ghost</span>
                        </div>
                        <div className={styles.componentItem}>
                            <Button variant="link">Link</Button>
                            <span className={styles.componentLabel}>link</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sizes */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Sizes</h2>
                    <p>다양한 크기의 버튼</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.componentRow}>
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon"><Banana size={18} /></Button>
                    </div>
                </div>
            </section>

            {/* States */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>States</h2>
                    <p>버튼의 다양한 상태</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.componentRow}>
                        <Button>Normal</Button>
                        <Button disabled>Disabled</Button>
                        <Button loading>Loading</Button>
                    </div>
                </div>
            </section>

            {/* With Icons */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>With Icons</h2>
                    <p>아이콘과 함께 사용하는 버튼</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.componentRow}>
                        <Button><Check size={16} style={{ marginRight: 8 }} />승인하기</Button>
                        <Button variant="secondary">다음 <ArrowRight size={16} style={{ marginLeft: 8 }} /></Button>
                        <Button variant="outline"><Download size={16} style={{ marginRight: 8 }} />다운로드</Button>
                        <Button variant="ghost"><Heart size={16} /></Button>
                    </div>
                </div>
            </section>

            {/* Full Width */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Full Width</h2>
                    <p>전체 너비를 차지하는 버튼</p>
                </div>
                <div className={styles.card}>
                    <Button fullWidth>전체 너비 버튼</Button>
                </div>
            </section>

            {/* Usage */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용법</h2>
                </div>
                <div className={styles.card}>
                    <pre className={styles.codeBlock}>
                        {`import { Button } from "@/components/ui/Button";

// 기본 사용
<Button>Click me</Button>

// Props
<Button 
  variant="secondary"  // default | secondary | destructive | outline | ghost | link
  size="lg"            // sm | default | lg | icon
  disabled             // 비활성화
  loading              // 로딩 상태
  fullWidth            // 전체 너비
>
  Button Text
</Button>`}
                    </pre>
                </div>
            </section>
        </>
    );
}
