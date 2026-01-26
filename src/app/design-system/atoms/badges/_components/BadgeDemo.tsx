import React from 'react';
import { Badge } from "@/components/ui/Badge";
import Story from "../../../Story";
import styles from "../../../DesignSystem.module.scss";

export function BadgeDemo() {
    return (
        <>
            <Story title="기본 라이브러리" description="의미 전달을 위한 핵심 배지 스타일">
                <div className={styles.buttonRow}>
                    <Badge>기본형</Badge>
                    <Badge variant="secondary">보조형 (Muted)</Badge>
                    <Badge variant="outline">고스트 (Outline)</Badge>
                    <Badge variant="destructive">긴급 / 에러</Badge>
                    <Badge variant="success">확인 / 활성</Badge>
                </div>
            </Story>

            <Story title="실제 활용 사례" description="바나나웨딩 서비스 내 배지 사용 예시">
                <div className={styles.showcaseGrid}>
                    <div className={styles.iconTextRow}>
                        <Badge variant="success">APPROVED</Badge>
                        <span className={styles.textSmall}>청첩장이 공개된 상태</span>
                    </div>
                    <div className={styles.iconTextRow}>
                        <Badge>PENDING</Badge>
                        <span className={styles.textSmall}>관리자 승인 대기 중</span>
                    </div>
                    <div className={styles.iconTextRow}>
                        <Badge variant="destructive">REJECTED</Badge>
                        <span className={styles.textSmall}>승인을 위해 수정 필요</span>
                    </div>
                    <div className={styles.iconTextRow}>
                        <Badge variant="secondary">DRAFT</Badge>
                        <span className={styles.textSmall}>작성 중인 비공개 상태</span>
                    </div>
                    <div className={styles.iconTextRow}>
                        <Badge variant="outline">SYSTEM</Badge>
                        <span className={styles.textSmall}>서버에서 자동 생성된 태그</span>
                    </div>
                </div>
            </Story>
        </>
    );
}
