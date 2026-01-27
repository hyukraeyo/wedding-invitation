"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import Menu from "@/components/ui/Menu";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerScrollArea } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Settings, CreditCard, User, LogOut } from "lucide-react";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

export default function MenuPage() {
    const [selectedAnimal, setSelectedAnimal] = useState<string>("cat");
    const [isOpen, setIsOpen] = useState(false);

    const { getPropItems } = usePropControls({
        "Menu.Item props": {
            description: "아이콘 위치, 설명, 선택 상태 등을 제어",
            componentType: "left, right, description, selected"
        },
        "Menu.CheckItem props": {
            description: "체크박스 로직을 포함하는 아이템",
            componentType: "checked, onCheckedChange"
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Menu (TDS)</h1>
                <p className={styles.textMuted}>TDS(Toss Design System) 스타일의 익숙한 메뉴입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story
                    id="selection"
                    title="Menu.CheckItem in Drawer"
                    description="바텀시트 내에서 선택 상태를 갖는 메뉴 예시입니다."
                >
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall} style={{ maxWidth: 400 }}>
                            <Label className={styles.labelMuted}>동물 선택</Label>
                            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                                <DrawerTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        현재 선택: {selectedAnimal === 'dog' ? '강아지' : selectedAnimal === 'cat' ? '고양이' : '토끼'}
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>좋아하는 동물을 선택해주세요.</DrawerTitle>
                                    </DrawerHeader>
                                    <DrawerScrollArea className="px-2 pb-8">
                                        <Menu>
                                            <Menu.CheckItem
                                                checked={selectedAnimal === "dog"}
                                                onCheckedChange={() => { setSelectedAnimal("dog"); setIsOpen(false); }}
                                            >
                                                강아지
                                            </Menu.CheckItem>
                                            <Menu.CheckItem
                                                checked={selectedAnimal === "cat"}
                                                onCheckedChange={() => { setSelectedAnimal("cat"); setIsOpen(false); }}
                                            >
                                                고양이
                                            </Menu.CheckItem>
                                            <Menu.CheckItem
                                                checked={selectedAnimal === "rabbit"}
                                                onCheckedChange={() => { setSelectedAnimal("rabbit"); setIsOpen(false); }}
                                            >
                                                토끼
                                            </Menu.CheckItem>
                                        </Menu>
                                    </DrawerScrollArea>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                </Story>

                <Story
                    id="action"
                    title="Composite Menu"
                    description="헤더, 구분선, 아이콘이 포함된 복합 메뉴 구성입니다."
                >
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall} style={{ maxWidth: 400, backgroundColor: 'white', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden' }}>
                            <Menu>
                                <Menu.Header>계정 설정</Menu.Header>
                                <Menu.Item left={<User size={18} />}>프로필 설정</Menu.Item>
                                <Menu.Item left={<CreditCard size={18} />} description="결제 수단 및 내역 관리">결제 관리</Menu.Item>
                                <Menu.Separator />
                                <Menu.Header>애플리케이션</Menu.Header>
                                <Menu.Item left={<Settings size={18} />}>환경 설정</Menu.Item>
                                <Menu.Separator />
                                <Menu.Item left={<LogOut size={18} />} className="text-red-500">로그아웃</Menu.Item>
                            </Menu>
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={`import Menu from "@/components/ui/Menu";\n\n<Menu>\n  <Menu.Header>Title</Menu.Header>\n  <Menu.Item onClick={...}>Item</Menu.Item>\n  <Menu.CheckItem checked={...} onCheckedChange={...}>Checkable</Menu.CheckItem>\n  <Menu.Separator />\n</Menu>`}
                    props={getPropItems()}
                />
            </div>
        </>
    );
}
