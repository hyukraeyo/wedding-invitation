"use client";

import React from "react";
import DesignSystemPage from "../../../DesignSystemPage";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerScrollArea
} from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { usePropControls } from "../../../hooks/usePropControls";
import Menu from "@/components/ui/Menu";

export default function DrawersPageClient() {
    const { values, getPropItems } = usePropControls({
        variant: {
            type: 'segmented',
            defaultValue: 'island',
            options: ['island', 'full'],
            description: "바텀시트 스타일 타입",
            componentType: '"island" | "full"'
        },
        title: {
            type: 'text',
            defaultValue: "바텀시트 제목",
            description: "바텀시트 상단에 표시될 제목",
        },
        description: {
            type: 'text',
            defaultValue: "여기에 설명을 입력할 수 있습니다.",
            description: "바텀시트 상단에 표시될 설명",
        },
        shouldScaleBackground: {
            type: 'boolean',
            defaultValue: false,
            description: "배경이 축소되는 애니메이션 효과 여부 (iOS 스타일)",
        },
        showFooter: {
            type: 'boolean',
            defaultValue: true,
            description: "하단 푸터 버튼 표시 여부",
        }
    });

    return (
        <DesignSystemPage
            title="Drawers (Bottom Sheets)"
            description="화면 하단에서 올라오는 슬라이드 패널입니다. 모바일 환경에서 추가 정보나 선택 옵션을 제공할 때 최적인 UI 요소입니다. 🍌 바나나웨딩에서는 현대적인 '아일랜드(Island)' 타입과 전통적인 'Full' 타입을 모두 지원합니다."
            playground={{
                title: "Playground",
                description: "바텀시트의 두 가지 스타일 타입을 실시간으로 확인해보세요.",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
                content: (
                    <Drawer shouldScaleBackground={values.shouldScaleBackground as boolean}>
                        <DrawerTrigger asChild>
                            <Button variant="secondary" size="lg">바텀시트 미리보기</Button>
                        </DrawerTrigger>
                        <DrawerContent variant={values.variant as any}>
                            <DrawerHeader>
                                <DrawerTitle>{values.title as string}</DrawerTitle>
                                <DrawerDescription>{values.description as string}</DrawerDescription>
                            </DrawerHeader>
                            <div style={{ padding: '0 20px 24px' }}>
                                <div style={{
                                    padding: '48px 20px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '16px',
                                    border: '1px dashed #e4e4e7',
                                    textAlign: 'center',
                                    color: '#71717a',
                                    fontSize: '0.875rem'
                                }}>
                                    {values.variant === 'island' ? '아일랜드 타입 컨텐츠' : 'Full 타입 컨텐츠'}
                                </div>
                            </div>
                            {values.showFooter && (
                                <DrawerFooter>
                                    <Button className="w-full" size="lg">확인</Button>
                                </DrawerFooter>
                            )}
                        </DrawerContent>
                    </Drawer>
                ),
                usage: `import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";

<Drawer${values.shouldScaleBackground ? ' shouldScaleBackground' : ''}>
  <DrawerTrigger asChild>
    <Button>바텀시트 열기</Button>
  </DrawerTrigger>
  <DrawerContent variant="${values.variant}">
    <DrawerHeader>
      <DrawerTitle>${values.title}</DrawerTitle>
      <DrawerDescription>${values.description}</DrawerDescription>
    </DrawerHeader>
    
    <div className="p-5">
      {/* 컨텐츠 영역 */}
    </div>
    ${values.showFooter ? `
    <DrawerFooter>
      <Button className="w-full">확인</Button>
    </DrawerFooter>` : ''}
  </DrawerContent>
</Drawer>`,
                props: getPropItems()
            }}
            combinations={{
                title: "Usage Examples",
                description: "실제 서비스에서 자주 활용되는 바텀시트 구성 패턴입니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        {/* 1. 메뉴 선택형 */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ borderLeft: '4px solid #FBC02D', paddingLeft: '16px' }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>1. 메뉴 선택형 (Menu & Selection)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#71717a', marginTop: '4px' }}>단일 또는 다중 선택 옵션을 제공할 때 가장 많이 사용되는 형태입니다.</p>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="outline" style={{ minWidth: '240px', justifyContent: 'space-between', height: '48px', borderRadius: '12px' }}>
                                            <span>선택된 반려동물: 고양이</span>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#FBC02D' }}>변경</span>
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>반려동물 선택</DrawerTitle>
                                            <DrawerDescription>청첩장에 표시될 아이콘을 선택해주세요.</DrawerDescription>
                                        </DrawerHeader>
                                        <div style={{ padding: '0 8px 32px' }}>
                                            <Menu>
                                                <Menu.CheckItem checked={false}>강아지 (Puppy)</Menu.CheckItem>
                                                <Menu.CheckItem checked={true}>고양이 (Cat)</Menu.CheckItem>
                                                <Menu.CheckItem checked={false}>토끼 (Rabbit)</Menu.CheckItem>
                                                <Menu.CheckItem checked={false}>햄스터 (Hamster)</Menu.CheckItem>
                                            </Menu>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </section>

                        {/* 2. 대량 컨텐츠형 */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ borderLeft: '4px solid #FBC02D', paddingLeft: '16px' }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>2. 스크롤 가능한 컨텐츠 (ScrollArea)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#71717a', marginTop: '4px' }}>약관이나 안내 사항 등 내용이 길어지는 경우 사용합니다.</p>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="outline" style={{ height: '48px', borderRadius: '12px' }}>이용약관 상세보기</Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>개인정보 처리방침</DrawerTitle>
                                            <DrawerDescription>수집되는 항목 및 이용 목적에 대해 안내해 드립니다.</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerScrollArea style={{ maxHeight: '380px' }}>
                                            <div style={{ padding: '0 20px 24px', fontSize: '0.875rem', lineHeight: 1.7, color: '#3f3f46' }}>
                                                <p style={{ fontWeight: 600, marginBottom: '8px' }}>제1조 (개인정보의 처리 목적)</p>
                                                <p>바나나웨딩은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                                                <br />
                                                <p style={{ fontWeight: 600, marginBottom: '8px' }}>제2조 (개인정보의 처리 및 보유 기간)</p>
                                                <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                                                <br />
                                                {[...Array(15)].map((_, i) => (
                                                    <p key={i} style={{ marginBottom: '12px' }}>추가적인 정책 내용 및 세부 사항이 여기에 기재됩니다. 이 텍스트는 스크롤 동작을 확인하기 위한 자리표시자입니다. ({i + 3}조)</p>
                                                ))}
                                            </div>
                                        </DrawerScrollArea>
                                        <DrawerFooter>
                                            <Button className="w-full" size="lg">내용을 확인했습니다</Button>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </section>

                        {/* 3. 액션 확인형 */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ borderLeft: '4px solid #FBC02D', paddingLeft: '16px' }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>3. 중요 액션 확인 (Destructive Action)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#71717a', marginTop: '4px' }}>주의가 필요한 작업이나 삭제 확인 시 사용합니다.</p>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="destructive" style={{ height: '48px', borderRadius: '12px' }}>전체 초기화</Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>모든 설정을 초기화하시겠습니까?</DrawerTitle>
                                            <DrawerDescription>작성 중인 모든 내용이 사라지며, 이 작업은 되돌릴 수 없습니다.</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter style={{ flexDirection: 'row', gap: '12px', padding: '16px 20px 24px' }}>
                                            <DrawerClose asChild>
                                                <Button variant="secondary" className="flex-1" size="lg">취소</Button>
                                            </DrawerClose>
                                            <Button variant="destructive" className="flex-1" size="lg">초기화하기</Button>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </section>

                        {/* 4. Full Width 스타일 */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ borderLeft: '4px solid #FBC02D', paddingLeft: '16px' }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>4. 하단 고착 스타일 (Full Type)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#71717a', marginTop: '4px' }}>화면 하단에 여백 없이 밀착된 전통적인 바텀시트 형태입니다.</p>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="outline" style={{ height: '48px', borderRadius: '12px' }}>Full 타입 바텀시트 열기</Button>
                                    </DrawerTrigger>
                                    <DrawerContent variant="full">
                                        <DrawerHeader>
                                            <DrawerTitle>Full Width 바텀시트</DrawerTitle>
                                            <DrawerDescription>하단 여백 없이 화면 너비에 맞게 표시됩니다.</DrawerDescription>
                                        </DrawerHeader>
                                        <div style={{ padding: '0 20px 40px', textAlign: 'center', color: '#71717a', fontSize: '0.875rem' }}>
                                            <div style={{ padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
                                                하단 여백이 없는 레이아웃이 필요할 때 적합합니다.
                                            </div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </section>
                    </div>
                )
            }}
        />
    );
}
