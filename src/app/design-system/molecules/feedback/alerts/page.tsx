"use client";

import React from "react";
import DesignSystemPage from "../../../DesignSystemPage";
import styles from "../../../DesignSystem.module.scss";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { CheckCircle2, TriangleAlert, Info } from "lucide-react";
import { usePropControls } from "../../../hooks/usePropControls";

export default function AlertsPage() {
    const { values, getPropItems } = usePropControls({
        variant: {
            type: 'segmented',
            defaultValue: 'default',
            options: ['default', 'destructive'],
            description: "알림의 시각적 스타일 변형",
            componentType: '"default" | "destructive"'
        },
        title: {
            type: 'text',
            defaultValue: "알림 제목",
            description: "알림의 제목 (AlertTitle)",
            componentType: 'ReactNode'
        },
        description: {
            type: 'text',
            defaultValue: "여기에 알림에 대한 상세 내용을 작성합니다.",
            description: "알림의 상세 내용 (AlertDescription)",
            componentType: 'ReactNode'
        }
    });

    const usage = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Info } from "lucide-react";

<Alert variant="${values.variant}">
  <Info className="h-4 w-4" />
  <AlertTitle>${values.title}</AlertTitle>
  <AlertDescription>
    ${values.description}
  </AlertDescription>
</Alert>`;

    return (
        <DesignSystemPage
            title="Alert Banners"
            description="사용자에게 중요하거나 도움이 되는 정보를 전달하기 위한 인라인 메시지 컴포넌트입니다."
            playground={{
                title: "Playground",
                description: "Alert 컴포넌트의 스타일과 내용을 실시간으로 테스트해보세요.",
                content: (
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <Alert variant={values.variant as "default" | "destructive"}>
                            {values.variant === 'destructive' ? (
                                <TriangleAlert className="h-4 w-4" />
                            ) : (
                                <Info className="h-4 w-4" />
                            )}
                            <AlertTitle>{values.title}</AlertTitle>
                            <AlertDescription>
                                {values.description}
                            </AlertDescription>
                        </Alert>
                    </div>
                ),
                usage: usage,
                props: getPropItems()
            }}
            combinations={{
                title: "Usage Examples",
                description: "다양한 상황에서의 Alert 활용 예시입니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '500px' }}>
                        <Alert variant="default" className={styles.bgZinc50}>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-700">성공적으로 저장되었습니다</AlertTitle>
                            <AlertDescription className="text-green-600">
                                모든 변경 사항이 클라우드에 백업되었습니다.
                            </AlertDescription>
                        </Alert>

                        <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>결제 실패</AlertTitle>
                            <AlertDescription>
                                카드의 유효기간이 만료되었습니다. 결제 정보를 업데이트해주세요.
                            </AlertDescription>
                        </Alert>
                    </div>
                )
            }}
        />
    );
}
