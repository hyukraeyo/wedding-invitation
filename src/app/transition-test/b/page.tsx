import styles from "../TransitionTest.module.scss";
import TransitionTestLink from "../TransitionTestLink";

async function getPageData(id: string) {
  // 데이터 패칭 시뮬레이션 (1.5초 지연)
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    id,
    author: "바나나웨딩",
    date: new Date().toLocaleTimeString(),
    message: "서버로부터 실시간 데이터를 가져왔습니다."
  };
}

export default async function TransitionTestBPage() {
  const data = await getPageData("B");

  return (
    <div className={styles.stage}>
      <div className={`${styles.panel} ${styles.toneB}`}>
        <div className={styles.eyebrow}>View Transition + Fetching</div>
        <h1 className={styles.title}>Test Screen {data.id}</h1>
        <p className={styles.subtitle}>
          시스템: {data.author} | 패칭 시간: {data.date}
        </p>
        <p className={styles.message}>"{data.message}"</p>
        <div className={styles.actions}>
          <TransitionTestLink href="/transition-test">
            Back to Screen A (1.5s Delay)
          </TransitionTestLink>
        </div>
        <p className={styles.hint}>
          데이터가 로드될 때까지 트랜지션이 대기하는지 확인해보세요.
        </p>
      </div>
    </div>
  );
}
