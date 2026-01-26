"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InvitationCard } from "@/components/ui/InvitationCard/InvitationCard";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

// DUMMY Data
const DUMMY_INVITATION_IMG = {
    id: "inv-img",
    title: "Hyuk & Mi's Wedding",
    invitation_data: {
        husband_name: "Kim Hyuk",
        wife_name: "Lee Mi",
        wedding_date: "2026-10-24",
        wedding_time: "12:30",
        wedding_venue: "Banana Hall",
        imageUrl: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=800&auto=format&fit=crop"
    }
};

const DUMMY_INVITATION_FALLBACK = {
    id: "inv-no-img",
    title: "Classic Ceremony",
    invitation_data: {
        husband_name: "Park Jun",
        wife_name: "Choi Ha",
        wedding_date: "2026-11-15",
        wedding_time: "14:00",
        wedding_venue: "Classic Wedding Hall",
        imageUrl: null
    }
};

export default function CardsPage() {
    const { getPropItems } = usePropControls({
        className: {
            description: "컴포넌트 스타일 확장",
            componentType: 'string'
        },
        children: {
            description: "하위 요소",
            componentType: 'ReactNode'
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Cards & Displays</h1>
                <p className={styles.textMuted}>디자인 컨테이너부터 비즈니스 로직을 포함한 복합 카드까지의 모음입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Generic UI Cards" description="Basic layout containers for grouping content">
                    <div className={styles.gridTwoCols}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Simple Project</CardTitle>
                                <CardDescription>Basic description for this generic card.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className={styles.textSmall}>Main content area for data display.</p>
                            </CardContent>
                            <CardFooter>
                                <div className={styles.buttonRow}>
                                    <Button variant="outline" size="sm">Cancel</Button>
                                    <Button size="sm">Save</Button>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing Model</CardTitle>
                                <CardDescription>Premium plan subscription.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={styles.iconTextRow} style={{ alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 900 }}>49,900</span>
                                    <span className={styles.textMuted}>/mo</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button fullWidth>Upgrade Now</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </Story>

                <DocSection
                    usage={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";\n\n<Card>\n  <CardHeader>\n    <CardTitle>Title</CardTitle>\n    <CardDescription>Description</CardDescription>\n  </CardHeader>\n  <CardContent>\n    Content\n  </CardContent>\n  <CardFooter>\n    Footer\n  </CardFooter>\n</Card>`}
                    props={getPropItems()}
                />

                <Story title="Business Patterns: Invitations" description="Complex components integrated with business data">
                    <div className={styles.showcaseRow}>
                        <div className={styles.cardWrapper}>
                            <InvitationCard
                                invitation={DUMMY_INVITATION_IMG as any}
                                onEdit={() => { }}
                                onDelete={() => { }}
                                onRequestApproval={() => { }}
                                onCancelRequest={() => { }}
                                onRevokeApproval={() => { }}
                                layout="grid"
                            />
                            <p className={styles.labelCenterMuted}>With Cover Image</p>
                        </div>

                        <div className={styles.cardWrapper}>
                            <InvitationCard
                                invitation={DUMMY_INVITATION_FALLBACK as any}
                                onEdit={() => { }}
                                onDelete={() => { }}
                                onRequestApproval={() => { }}
                                onCancelRequest={() => { }}
                                onRevokeApproval={() => { }}
                                layout="grid"
                            />
                            <p className={styles.labelCenterMuted}>Fallback (Minimalist)</p>
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
