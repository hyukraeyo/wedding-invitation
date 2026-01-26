"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";

const typographyItems = [
    { label: "Heading 1", size: "2.5rem (40px)", weight: "800", example: "결혼식에 초대합니다" },
    { label: "Heading 2", size: "1.875rem (30px)", weight: "700", example: "신랑 김철수 & 신부 이영희" },
    { label: "Heading 3", size: "1.5rem (24px)", weight: "600", example: "오시는 길 안내" },
    { label: "Heading 4", size: "1.25rem (20px)", weight: "600", example: "마음 전하실 곳" },
    { label: "Body Large", size: "1.125rem (18px)", weight: "400", example: "소중한 분들을 초대합니다. 저희의 시작을 축하해 주세요." },
    { label: "Body Base", size: "1rem (16px)", weight: "400", example: "두 사람이 사랑으로 만나 하나의 가정을 이루게 되었습니다." },
    { label: "Body Small", size: "0.875rem (14px)", weight: "400", example: "자세한 일정과 장소를 지도로 확인하실 수 있습니다." },
    { label: "Caption", size: "0.75rem (12px)", weight: "500", example: "2026년 3월 21일 토요일 오후 2시 바나나홀" },
];

export default function TypographyPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Typography</h1>
                <p>일관된 타이포그래피 시스템으로 가독성과 정보 계층 구조를 보장합니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Text Scales" description="Hierarchy for headings and body content across the application">
                    <div className={styles.verticalStack}>
                        {typographyItems.map((item) => (
                            <div key={item.label} className={styles.typographyRow}>
                                <div className={styles.typographyMeta}>
                                    <span className={styles.label}>{item.label}</span>
                                    <span className={styles.typographySpec}>{item.size} • {item.weight}</span>
                                </div>
                                <p
                                    style={{
                                        fontSize: item.size.split(" ")[0],
                                        fontWeight: parseInt(item.weight),
                                        marginTop: 8
                                    }}
                                >
                                    {item.example}
                                </p>
                            </div>
                        ))}
                    </div>
                </Story>

                <DocSection
                    
                    usage={`.myText {\n  font-family: v.$font-sans;\n  font-size: 1.5rem;\n  font-weight: 600;\n  line-height: v.$line-height-base;\n}`}
                />

                <Story title="Font Families" description="Typefaces optimized for readability and aesthetic appeal">
                    <div className={styles.gridTwoCols}>
                        <div className={styles.codePanel}>
                            <span className={styles.labelUppercase}>Sans-Serif (Standard)</span>
                            <p style={{ fontFamily: "var(--font-pretendard), sans-serif", fontSize: '1.25rem', marginTop: 12 }}>
                                Pretendard 프리텐다드<br />
                                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                                abcdefghijklmnopqrstuvwxyz<br />
                                1234567890 !@#$%^&*
                            </p>
                        </div>
                        <div className={styles.codePanel} style={{ borderStyle: 'solid', borderColor: '#e1e1e1' }}>
                            <span className={styles.labelUppercase}>Serif (Elegant)</span>
                            <p style={{ fontFamily: "var(--font-nanum-myeongjo), serif", fontSize: '1.25rem', marginTop: 12 }}>
                                나눔명조 NanumMyeongjo<br />
                                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                                abcdefghijklmnopqrstuvwxyz<br />
                                1234567890 !@#$%^&*
                            </p>
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
