"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import Menu from "@/components/ui/Menu";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/Drawer";

export function DrawersDemo() {
    return (
        <div className={styles.showcaseStack}>
            <div className={styles.showcaseRow}>
                <div className={styles.verticalStackExtraSmall}>
                    <Label className={styles.labelMuted}>Standard Surface</Label>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="secondary">Open Sheet</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Standard Drawer</DrawerTitle>
                                <DrawerDescription>Full-width mobile sheet for standard selection.</DrawerDescription>
                            </DrawerHeader>
                            <div className={styles.verticalStackSmall} style={{ padding: '0 16px 24px' }}>
                                <div className={styles.codePanel}>List Item 1</div>
                                <div className={styles.codePanel}>List Item 2</div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className={styles.verticalStackExtraSmall}>
                    <Label className={styles.labelMuted}>Island (Floating)</Label>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline">Open Island</Button>
                        </DrawerTrigger>
                        <DrawerContent variant="floating">
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Floating Island</DrawerTitle>
                                <DrawerDescription>Premium floating sheet for highlighted content.</DrawerDescription>
                            </DrawerHeader>
                            <div className={styles.verticalStackSmall} style={{ padding: '0 16px 24px' }}>
                                <div className={styles.codePanel} style={{ backgroundColor: 'white' }}>Quick Suggestion 1</div>
                                <div className={styles.codePanel} style={{ backgroundColor: 'white' }}>Quick Suggestion 2</div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>

            <div className={styles.verticalStackExtraSmall} style={{ marginTop: '24px' }}>
                <Label className={styles.labelMuted}>Bottom Sheet Picker (Recommended)</Label>
                <div className={styles.showcaseRow}>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="w-full" style={{ maxWidth: '300px', justifyContent: 'space-between' }}>
                                <span>고양이</span>
                                <span style={{ opacity: 0.5, fontSize: '12px' }}>변경하기</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>좋아하는 동물을 선택해주세요.</DrawerTitle>
                            </DrawerHeader>
                            <div style={{ padding: '0 8px 32px' }}>
                                <Menu>
                                    <Menu.CheckItem checked={false}>강아지</Menu.CheckItem>
                                    <Menu.CheckItem checked={true}>고양이</Menu.CheckItem>
                                    <Menu.CheckItem checked={false}>토끼</Menu.CheckItem>
                                </Menu>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </div>
    );
}
