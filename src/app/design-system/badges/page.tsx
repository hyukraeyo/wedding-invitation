import styles from "../DesignSystem.module.scss";
import { Badge } from "@/components/ui/Badge";

export default function BadgesPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Badges</h1>
                <p>상태나 카테고리를 표시하는 작은 라벨 컴포넌트입니다.</p>
            </header>

            {/* Variants */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Variants</h2>
                    <p>용도에 따른 배지 스타일</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.componentRow}>
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="success">Success</Badge>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용 예시</h2>
                </div>
                <div className={styles.card}>
                    <div className={styles.useCaseGrid}>
                        <div className={styles.useCase}>
                            <Badge variant="success">승인 완료</Badge>
                            <span>청첩장 승인 상태</span>
                        </div>
                        <div className={styles.useCase}>
                            <Badge>승인 대기</Badge>
                            <span>승인 요청 중</span>
                        </div>
                        <div className={styles.useCase}>
                            <Badge variant="destructive">거절됨</Badge>
                            <span>승인 거절 상태</span>
                        </div>
                        <div className={styles.useCase}>
                            <Badge variant="secondary">샘플</Badge>
                            <span>미신청 상태</span>
                        </div>
                        <div className={styles.useCase}>
                            <Badge variant="outline">New</Badge>
                            <span>새로운 기능</span>
                        </div>
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
                        {`import { Badge } from "@/components/ui/Badge";

// 기본 사용
<Badge>Default</Badge>

// Variants
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Success</Badge>`}
                    </pre>
                </div>
            </section>
        </>
    );
}
