import styles from "../DesignSystem.module.scss";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CardsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Cards</h1>
                <p>관련 콘텐츠를 그룹화하는 컨테이너 컴포넌트입니다.</p>
            </header>

            {/* Basic Card */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Basic Card</h2>
                    <p>기본 카드 구조</p>
                </div>
                <div className={styles.cardGrid}>
                    <Card>
                        <CardHeader>
                            <CardTitle>카드 제목</CardTitle>
                            <CardDescription>카드에 대한 설명이 들어갑니다.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>카드 본문 내용이 여기에 표시됩니다.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm">취소</Button>
                            <Button size="sm">확인</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>구독 플랜</CardTitle>
                            <CardDescription>당신에게 맞는 플랜을 선택하세요.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                                <span style={{ fontSize: "2rem", fontWeight: 700 }}>₩9,900</span>
                                <span style={{ color: "#71717a" }}>/월</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button fullWidth>구독하기</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Card Parts */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Card Parts</h2>
                    <p>카드 구성 요소</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.partsGrid}>
                        <div className={styles.partItem}>
                            <code>CardHeader</code>
                            <span>제목과 설명을 포함하는 헤더 영역</span>
                        </div>
                        <div className={styles.partItem}>
                            <code>CardTitle</code>
                            <span>카드의 주요 제목</span>
                        </div>
                        <div className={styles.partItem}>
                            <code>CardDescription</code>
                            <span>제목 아래 부가 설명</span>
                        </div>
                        <div className={styles.partItem}>
                            <code>CardContent</code>
                            <span>카드의 본문 콘텐츠 영역</span>
                        </div>
                        <div className={styles.partItem}>
                            <code>CardFooter</code>
                            <span>액션 버튼 등이 위치하는 하단 영역</span>
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
                        {`import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/Card";

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    본문 내용
  </CardContent>
  <CardFooter>
    <Button>액션</Button>
  </CardFooter>
</Card>`}
                    </pre>
                </div>
            </section>
        </>
    );
}
