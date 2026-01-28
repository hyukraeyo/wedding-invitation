"use client"

import React from "react"
import { ScrollArea } from "@/components/ui/ScrollArea"
import DesignSystemPage from "../../DesignSystemPage"
import Story from "../../Story"
import { PropItem } from "../../DocSection"

export function ScrollAreaPageClient() {
    const usage = `import { ScrollArea } from "@/components/ui/ScrollArea"

<ScrollArea className="h-[200px] w-full rounded-md border p-4">
  <div className="p-4">
    <h4>Scroll Me</h4>
    <p>Content goes here...</p>
  </div>
</ScrollArea>`

    const props: PropItem[] = [
        {
            name: "useScrollFade",
            type: "boolean",
            description: "상하단 페이드(그라데이션) 효과 활성화 여부",
            defaultValue: "false"
        },
        {
            name: "orientation",
            type: '"vertical" | "horizontal"',
            description: "스크롤 방향 설정",
            defaultValue: '"vertical"'
        },
        {
            name: "className",
            type: "string",
            description: "추가적인 CSS 클래스",
            defaultValue: "-"
        }
    ]

    return (
        <DesignSystemPage
            title="ScrollArea"
            description="Radix UI 기반의 프리미엄 커스텀 스크롤 영역입니다. 부드러운 스크롤바와 상하단 페이드 효과를 제공합니다."
            playground={{
                title: "Default ScrollArea",
                description: "기본적인 커스텀 스크롤 영역입니다. 마우스 호버 시 스크롤바가 나타납니다.",
                content: (
                    <div style={{ height: "200px", border: "1px solid #e4e4e7", borderRadius: "8px", width: "100%" }}>
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4">
                                <h4 className="font-bold">Scroll Me</h4>
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <p key={i} className="text-sm text-zinc-500">
                                        이 문장은 스크롤을 테스트하기 위한 긴 텍스트의 {i + 1}번째 줄입니다.
                                        부드러운 커스텀 스크롤바를 지원합니다.
                                    </p>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ),
                usage: usage,
                props: props
            }}
        >
            <Story
                title="With Scroll Fade"
                description="useScrollFade 옵션을 활성화하면 상하단에 부드러운 그라데이션 페이드 효과가 적용됩니다."
            >
                <div style={{ height: "200px", border: "1px solid #e4e4e7", borderRadius: "8px", background: "white", width: "100%" }}>
                    <ScrollArea className="h-full" useScrollFade={true}>
                        <div className="p-4 space-y-4">
                            <h4 className="font-bold" style={{ color: "#FBC02D" }}>Premium Fade Effect</h4>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <p key={i} className="text-sm text-zinc-500">
                                    스크롤을 내리면 상단에, 올리면 하단에 페이드 효과가 나타나 시각적으로 부드러운 느낌을 줍니다.
                                </p>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </Story>

            <Story
                title="Horizontal Scroll"
                description="가로 스크롤도 동일한 스타일로 지원합니다."
            >
                <div style={{ border: "1px solid #e4e4e7", borderRadius: "8px", width: "100%" }}>
                    <ScrollArea orientation="horizontal" className="w-full">
                        <div className="p-4 flex gap-4 w-[800px]">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-32 h-32 bg-zinc-100 rounded-lg flex items-center justify-center font-bold text-zinc-400"
                                >
                                    Card {i + 1}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </Story>
        </DesignSystemPage>
    )
}
