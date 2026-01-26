"use client";

import React, { useState } from "react";
import styles from "../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { ResponsiveModal } from "@/components/common/ResponsiveModal";
import { InfoMessage } from "@/components/ui/InfoMessage";
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
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/Drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Edit2, MoreVertical, Share2, Trash2 } from "lucide-react";

export default function OverlaysPage() {
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Modals & Overlays</h1>
                <p>사용자 인터렉션 위에 레이어로 표시되는 컴포넌트입니다.</p>
            </header>

            {/* Responsive Modal */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Responsive Modal</h2>
                    <p>화면 크기에 따라 다이얼로그(PC) 또는 바텀 시트(모바일)로 자동 전환됩니다.</p>
                </div>
                <div className={styles.card}>
                    <div className="flex flex-wrap gap-4">
                        <Button onClick={() => setIsRespModalOpen(true)} variant="solid">
                            표준 모달 실행하기
                        </Button>
                        <ResponsiveModal
                            open={isRespModalOpen}
                            onOpenChange={setIsRespModalOpen}
                            title="표준 모달 가이드"
                            description="PC에서는 중앙 팝업으로, 모바일에서는 하단 드로어로 표시됩니다."
                            onConfirm={() => setIsRespModalOpen(false)}
                            confirmText="이해했습니다"
                            showCancel={true}
                            cancelText="닫기"
                        >
                            <div className="py-4 space-y-4">
                                <InfoMessage>
                                    바나나웨딩의 주요 설정이나 안내는 이 모달을 표준으로 사용합니다.
                                </InfoMessage>
                                <div className="h-[120px] bg-zinc-50 rounded-2xl border border-dashed flex items-center justify-center text-zinc-400 text-sm">
                                    스크롤 가능한 콘텐츠 영역
                                </div>
                            </div>
                        </ResponsiveModal>
                    </div>
                </div>
            </section>

            {/* Alert & Confirmation */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Alert & Confirmation</h2>
                    <p>사용자의 확인이나 치명적인 액션을 승인받을 때 사용합니다.</p>
                </div>
                <div className={styles.card}>
                    <div className="flex flex-wrap gap-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">위험 구역 데이터 삭제</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>정말 데이터를 삭제할까요?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        삭제된 정보는 복구할 수 없으며, 모든 연결된 페이지가 비활성화됩니다.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                    <AlertDialogAction>네, 삭제하겠습니다</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </section>

            {/* Dropdown Menus */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Dropdown Menu</h2>
                    <p>공간을 절약하기 위해 숨겨진 액션 목록을 표시할 때 사용합니다.</p>
                </div>
                <div className={styles.card}>
                    <div className="flex flex-wrap gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    액션 관리 <MoreVertical size={16} className="ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>내 청첩장 메인</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><Edit2 size={14} className="mr-2" /> 정보 수정</DropdownMenuItem>
                                <DropdownMenuItem><Share2 size={14} className="mr-2" /> 링크 공유</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 font-medium font-semibold">
                                    <Trash2 size={14} className="mr-2" /> 관리자 삭제
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </section>

            {/* Side Surfaces */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Side Surfaces (Drawer)</h2>
                    <p>바텀시트는 화면의 최대 50% 높이로 제한되며, 두 가지 시각적 스타일을 제공합니다.</p>
                </div>
                <div className={styles.card}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex flex-col gap-1 mr-4">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Standard Style</span>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="secondary" className="w-[180px] justify-between">
                                            하단 밀착형 <span className="text-[10px] opacity-50 font-normal">Standard</span>
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>하단 밀착형 시트</DrawerTitle>
                                            <DrawerDescription>기기 너비에 꽉 차는 기본 바텀시트 스타일입니다.</DrawerDescription>
                                        </DrawerHeader>
                                        <div className="p-6 h-[260px] flex flex-col gap-3">
                                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 font-medium text-sm">기본 설정 관리</div>
                                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 font-medium text-sm">데이터 덤프</div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-tight">Island Style (New)</span>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="outline" className="w-[180px] justify-between border-yellow-200 bg-yellow-50/30 hover:bg-yellow-50">
                                            플로팅 아일랜드 <span className="text-[10px] text-yellow-600 font-normal">Floating</span>
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent variant="floating">
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>플로팅 아일랜드</DrawerTitle>
                                            <DrawerDescription>하단과 좌우 여백이 있는 프리미엄 스타일입니다.</DrawerDescription>
                                        </DrawerHeader>
                                        <div className="p-6 h-[260px] flex flex-col gap-3">
                                            <div className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm font-medium text-sm">마무리 추천 문구 1</div>
                                            <div className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm font-medium text-sm">마무리 추천 문구 2</div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>

                        <InfoMessage>
                            🍌 <strong>Design Tip:</strong> 중요한 추천 기능이나 감성적인 안내 시에는 <b>플로팅 아일랜드</b> 타입을, 일반적인 설정이나 리스트 선택 시에는 <b>하단 밀착형</b>을 권장합니다.
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
                        {`// 1. ResponsiveModal (추천: PC/모바일 대응)
import { ResponsiveModal } from "@/components/common/ResponsiveModal";

<ResponsiveModal
  title="제목"
  description="상세 설명"
  open={isOpen}
  onOpenChange={setIsOpen}
  onConfirm={handleConfirm}
>
  여기에 메인 콘텐츠를 입력하세요.
</ResponsiveModal>

// 2. AlertDialog (치명적 액션)
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent 
} from "@/components/ui/AlertDialog";

// 3. DropdownMenu
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/DropdownMenu";`}
                    </pre>
                </div>
            </section>
        </>
    );
}
