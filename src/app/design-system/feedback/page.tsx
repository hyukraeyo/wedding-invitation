import styles from "../DesignSystem.module.scss";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { InfoMessage } from "@/components/ui/InfoMessage";
import { Banana, AlertCircle } from "lucide-react";

export default function FeedbackPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Feedback</h1>
                <p>사용자에게 상태나 정보를 전달하는 피드백 컴포넌트입니다.</p>
            </header>

            {/* Alerts */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Alert</h2>
                    <p>중요한 메시지를 강조하여 표시</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.feedbackStack}>
                        <Alert>
                            <Banana size={16} />
                            <AlertTitle>알림</AlertTitle>
                            <AlertDescription>
                                청첩장이 성공적으로 저장되었습니다.
                            </AlertDescription>
                        </Alert>

                        <Alert variant="destructive">
                            <AlertCircle size={16} />
                            <AlertTitle>오류</AlertTitle>
                            <AlertDescription>
                                세션이 만료되었습니다. 다시 로그인해 주세요.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </section>

            {/* Info Message */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Info Message</h2>
                    <p>도움말이나 안내 메시지</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.feedbackStack}>
                        <InfoMessage>
                            청첩장 수정 후 다시 승인 신청을 해주셔야 공유가 가능합니다.
                        </InfoMessage>
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
                        {`// Alert
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";

<Alert>
  <AlertTitle>제목</AlertTitle>
  <AlertDescription>설명 내용</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>오류</AlertTitle>
  <AlertDescription>오류 메시지</AlertDescription>
</Alert>

// Info Message
import { InfoMessage } from "@/components/ui/InfoMessage";

<InfoMessage>도움말 내용</InfoMessage>`}
                    </pre>
                </div>
            </section>
        </>
    );
}
