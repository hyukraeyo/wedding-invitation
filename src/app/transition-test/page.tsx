import styles from "./TransitionTest.module.scss";
import TransitionTestLink from "./TransitionTestLink";

async function getPageData(id: string) {
  // 데이터 패칭 시뮬레이션 (1초 지연)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id,
    author: "조혁래",
    date: new Date().toLocaleTimeString(),
    message: "이 데이터는 서버에서 패칭되었습니다."
  };
}

export default async function TransitionTestPage() {
  const data = await getPageData("A");

  return (
    <div className={styles.stage}>
      <div className={`${styles.panel} ${styles.toneA}`}>
        <div className={styles.eyebrow}>View Transition + Fetching</div>
        <h1 className={styles.title}>Test Screen {data.id}</h1>
        <p className={styles.subtitle}>
          작성자: {data.author} | 패칭 시간: {data.date}
        </p>
        <p className={styles.message}>"{data.message}"</p>
        <div className={styles.actions}>
          <TransitionTestLink href="/transition-test/b">
            Go to Screen B (1s Delay)
          </TransitionTestLink>
        </div>
        <p className={styles.hint}>
          지연 시간 동안 브라우저가 어떻게 반응하는지 확인해보세요.
        </p>
      </div>
    </div>
  );
}
