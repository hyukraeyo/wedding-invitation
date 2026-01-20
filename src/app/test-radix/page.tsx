"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

// 글로벌 스타일 영향을 최소화하기 위해 인라인 스타일만 사용
export default function TestRadixPage() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 글로벌 스타일 리셋 - body의 display: flex 등을 무력화 */}
            <style>{`
        /* 이 페이지에서만 글로벌 스타일 오버라이드 */
        body {
          display: block !important;
          overflow: auto !important;
          min-height: auto !important;
        }
        html {
          overflow: auto !important;
        }
      `}</style>

            <div
                style={{
                    minHeight: "200vh", // 스크롤 강제 생성
                    padding: "2rem",
                    background: "#f5f5f5",
                }}
            >
                <h1 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "bold" }}>
                    Radix Dialog 순수 테스트 페이지
                </h1>
                <p style={{ marginBottom: "1rem", color: "#666" }}>
                    이 페이지는 글로벌 스타일을 오버라이드하고, 순수한 Radix Dialog의 동작을 테스트합니다.
                </p>
                <p style={{ marginBottom: "2rem", color: "#999" }}>
                    스크롤바가 있는 상태에서 모달을 열어, 레이아웃 시프트가 발생하는지 확인하세요.
                </p>

                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger asChild>
                        <button
                            style={{
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#000",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "1rem",
                            }}
                        >
                            Open Pure Radix Dialog
                        </button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                        <Dialog.Overlay
                            style={{
                                position: "fixed",
                                inset: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                zIndex: 9998,
                            }}
                        />
                        <Dialog.Content
                            style={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: "#fff",
                                borderRadius: "16px",
                                padding: "2rem",
                                width: "90%",
                                maxWidth: "400px",
                                zIndex: 9999,
                                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            <Dialog.Title style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                                Pure Radix Dialog
                            </Dialog.Title>
                            <Dialog.Description style={{ color: "#666", marginBottom: "1rem" }}>
                                이것은 커스텀 스타일 없이 순수한 Radix Dialog입니다.
                                <br />
                                배경 콘텐츠가 왼쪽으로 밀리는지 확인하세요.
                            </Dialog.Description>

                            <div style={{ marginTop: "1rem" }}>
                                <p style={{ fontSize: "0.875rem", color: "#999" }}>
                                    body에 data-scroll-locked 속성이 있는지,
                                    <br />
                                    margin-right가 추가되는지 개발자 도구에서 확인하세요.
                                </p>
                            </div>

                            <Dialog.Close asChild>
                                <button
                                    style={{
                                        marginTop: "1.5rem",
                                        width: "100%",
                                        padding: "0.75rem",
                                        backgroundColor: "#FBC02D",
                                        color: "#000",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    닫기
                                </button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                {/* 레이아웃 시프트 감지용 고정 요소 */}
                <div
                    style={{
                        position: "fixed",
                        top: "1rem",
                        right: "1rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        zIndex: 1,
                    }}
                >
                    ← 이 박스가 움직이면 시프트 발생
                </div>

                {/* 스크롤 콘텐츠 */}
                <div style={{ marginTop: "3rem" }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "1rem",
                                marginBottom: "1rem",
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            }}
                        >
                            스크롤 테스트 아이템 #{i + 1}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
