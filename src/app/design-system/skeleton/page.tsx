import styles from "../DesignSystem.module.scss";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SkeletonPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Skeleton</h1>
                <p>콘텐츠 로딩 중 표시되는 플레이스홀더 컴포넌트입니다.</p>
            </header>

            {/* Basic */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Basic Shapes</h2>
                    <p>기본 스켈레톤 형태</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.skeletonShowcase}>
                        <div className={styles.skeletonItem}>
                            <Skeleton style={{ width: 200, height: 20 }} />
                            <span>Text Line</span>
                        </div>
                        <div className={styles.skeletonItem}>
                            <Skeleton style={{ width: 48, height: 48, borderRadius: "50%" }} />
                            <span>Avatar</span>
                        </div>
                        <div className={styles.skeletonItem}>
                            <Skeleton style={{ width: 100, height: 32, borderRadius: 8 }} />
                            <span>Button</span>
                        </div>
                        <div className={styles.skeletonItem}>
                            <Skeleton style={{ width: 200, height: 120, borderRadius: 12 }} />
                            <span>Card</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Case: User Card */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용 예시: 유저 카드</h2>
                    <p>실제 사용 사례</p>
                </div>
                <div className={styles.card}>
                    <div style={{ display: "flex", gap: 32 }}>
                        {/* Loading State */}
                        <div style={{ padding: 20, border: "1px solid #e4e4e7", borderRadius: 12 }}>
                            <p style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: 12 }}>Loading</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <Skeleton style={{ width: 48, height: 48, borderRadius: "50%" }} />
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <Skeleton style={{ width: 120, height: 14 }} />
                                    <Skeleton style={{ width: 80, height: 12 }} />
                                </div>
                            </div>
                        </div>

                        {/* Loaded State */}
                        <div style={{ padding: 20, border: "1px solid #e4e4e7", borderRadius: 12 }}>
                            <p style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: 12 }}>Loaded</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #FBC02D 0%, #F9A825 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: 700
                                }}>
                                    김
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: "0.9375rem" }}>김바나나</p>
                                    <p style={{ fontSize: "0.8125rem", color: "#71717a" }}>banana@wedding.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* List Skeleton */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용 예시: 리스트</h2>
                </div>
                <div className={styles.card}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <Skeleton style={{ width: 40, height: 40, borderRadius: 8 }} />
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                                    <Skeleton style={{ width: "60%", height: 14 }} />
                                    <Skeleton style={{ width: "40%", height: 12 }} />
                                </div>
                                <Skeleton style={{ width: 60, height: 28, borderRadius: 6 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Usage */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용법</h2>
                </div>
                <div className={styles.card}>
                    <pre className={styles.codeBlock}>
                        {`import { Skeleton } from "@/components/ui/Skeleton";

// 기본 사용
<Skeleton style={{ width: 200, height: 20 }} />

// 원형 (아바타)
<Skeleton style={{ width: 48, height: 48, borderRadius: "50%" }} />

// 카드
<Skeleton style={{ width: "100%", height: 120, borderRadius: 12 }} />`}
                    </pre>
                </div>
            </section>
        </>
    );
}
