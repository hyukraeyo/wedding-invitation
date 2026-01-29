"use client";

import React, { useState } from "react";
import DesignSystemPage from "../../../DesignSystemPage";
import { ResponsiveModal } from "@/components/common/ResponsiveModal";
import { Button } from "@/components/ui/Button";
import { usePropControls } from "../../../hooks/usePropControls";
import { InfoMessage } from "@/components/ui/InfoMessage";
import { TextField } from "@/components/common/TextField";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/AlertDialog";

export default function ModalsPageClient() {
    const [open, setOpen] = useState(false);

    const { values, getPropItems } = usePropControls({
        title: {
            type: 'text',
            defaultValue: "정보 수정",
            description: "모달 상단에 표시될 제목",
        },
        description: {
            type: 'text',
            defaultValue: "변경사항을 확인하고 저장 버튼을 눌러주세요.",
            description: "모달 상단에 표시될 설명",
        },
        confirmText: {
            type: 'text',
            defaultValue: "저장하기",
            description: "확인 버튼 텍스트",
        },
        cancelText: {
            type: 'text',
            defaultValue: "취소",
            description: "취소 버튼 텍스트",
        },
        showCancel: {
            type: 'boolean',
            defaultValue: true,
            description: "취소 버튼 표시 여부",
        },
        padding: {
            type: 'segmented',
            defaultValue: 'default',
            options: ['default', 'none'],
            description: "컨텐츠 영역 패딩 설정",
        }
    });

    return (
        <DesignSystemPage
            title="Modals & Dialogs"
            description="데스크탑에서는 중앙 모달로, 모바일에서는 바텀시트(Drawer)로 자동 전환되는 반응형 오버레이 컴포넌트입니다. 사용자에게 중요한 확인을 받거나 입력을 유도할 때 사용합니다."
            playground={{
                title: "Playground",
                description: "반응형 모달의 다양한 설정을 실시간으로 테스트해보세요. (브라우저 너비를 줄여 모바일 환경에서의 바텀시트 전환을 확인하실 수 있습니다.)",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
                content: (
                    <>
                        <Button onClick={() => setOpen(true)} variant="solid" size="lg">모달 열기</Button>
                        <ResponsiveModal
                            open={open}
                            onOpenChange={setOpen}
                            title={values.title as string}
                            description={values.description as string}
                            confirmText={values.confirmText as string}
                            cancelText={values.cancelText as string}
                            showCancel={values.showCancel as boolean}
                            padding={values.padding as any}
                            onConfirm={() => {
                                alert('저장되었습니다.');
                                setOpen(false);
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <InfoMessage>
                                    이 영역은 모달의 컨텐츠 영역입니다. 텍스트, 폼, 목록 등 다양한 요소를 배치할 수 있습니다.
                                </InfoMessage>
                                <div style={{
                                    height: '100px',
                                    backgroundColor: '#f9f9fb',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px dashed #e4e4e7',
                                    color: '#71717a',
                                    fontSize: '0.875rem'
                                }}>
                                    컨텐츠 샘플 영역
                                </div>
                            </div>
                        </ResponsiveModal>
                    </>
                ),
                usage: `import { ResponsiveModal } from "@/components/common/ResponsiveModal";

const [open, setOpen] = useState(false);

<ResponsiveModal
  open={open}
  onOpenChange={setOpen}
  title="${values.title}"
  description="${values.description}"
  confirmText="${values.confirmText}"
  cancelText="${values.cancelText}"
  showCancel={${values.showCancel}}
  padding="${values.padding}"
  onConfirm={() => setOpen(false)}
>
  {/* 모달 컨텐츠 */}
  <div>내용이 여기에 들어갑니다.</div>
</ResponsiveModal>`,
                props: getPropItems()
            }}
            combinations={{
                title: "Usage Examples",
                description: "실제 서비스에서 자주 활용되는 모달 구성 패턴입니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        {/* 1. 입력 폼 모달 */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ borderLeft: '4px solid #FBC02D', paddingLeft: '16px' }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>1. 정보 입력 폼 (Form Modal)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#71717a', marginTop: '4px' }}>사용자로부터 텍스트 입력을 받아야 하는 상황에서 사용합니다.</p>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <FormModalExample />
                            </div>
                        </section>

                        {/* 2. 패딩 없는 전체 너비 목록 */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ borderLeft: '4px solid #FBC02D', paddingLeft: '16px' }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>2. 전체 너비 리스트 (Full-width List)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#71717a', marginTop: '4px' }}>`padding="none"` 설정을 통해 리스트 형태의 옵션을 꽉 차게 표시할 수 있습니다.</p>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <ListModalExample />
                            </div>
                        </section>

                        {/* 3. 중요 액션 확인 (AlertDialog) */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ borderLeft: '4px solid #FBC02D', paddingLeft: '16px' }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>3. 중요 액션 확인 (Destructive Action)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#71717a', marginTop: '4px' }}>삭제 등 되돌릴 수 없는 작업을 수행하기 전 최종 확인을 받을 때 사용합니다.</p>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" style={{ borderRadius: '12px' }}>데이터 영구 삭제</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                이 작업은 되돌릴 수 없습니다. 삭제된 데이터는 서버에서 영구적으로 제거됩니다.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>취소</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">삭제하기</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </section>
                    </div>
                )
            }}
        />
    );
}

function FormModalExample() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)} variant="outline" style={{ borderRadius: '12px' }}>프로필 수정</Button>
            <ResponsiveModal
                open={open}
                onOpenChange={setOpen}
                title="프로필 정보 수정"
                description="청첩장에 표시될 이름을 입력해주세요."
                confirmText="수정 완료"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <TextField label="신랑 성함" placeholder="홍길동" />
                    <TextField label="신부 성함" placeholder="김철수" />
                </div>
            </ResponsiveModal>
        </>
    );
}

function ListModalExample() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)} variant="outline" style={{ borderRadius: '12px' }}>계좌 번호 복사</Button>
            <ResponsiveModal
                open={open}
                onOpenChange={setOpen}
                title="축의금 송금"
                description="계좌번호를 선택하면 복사됩니다."
                padding="none"
                confirmText="닫기"
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {[
                        { bank: '신한은행', account: '110-123-456789', owner: '홍길동' },
                        { bank: '국민은행', account: '010-98765-43210', owner: '김철수' },
                        { bank: '우리은행', account: '1002-123-456789', owner: '이영희' },
                    ].map((item, i) => (
                        <button
                            key={i}
                            style={{
                                padding: '16px 20px',
                                textAlign: 'left',
                                borderBottom: i === 2 ? 'none' : '1px solid #f0f0f0',
                                backgroundColor: 'transparent',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9fb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => {
                                alert(`${item.account} 복사되었습니다.`);
                                setOpen(false);
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '2px' }}>{item.bank}</div>
                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.account}</div>
                            <div style={{ fontSize: '0.875rem', color: '#3f3f46' }}>예금주: {item.owner}</div>
                        </button>
                    ))}
                </div>
            </ResponsiveModal>
        </>
    );
}
