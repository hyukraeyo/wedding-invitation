import { Metadata } from "next";
import SwitchPageClient from "./SwitchPageClient";

export const metadata: Metadata = {
    title: "Switch | Banana Wedding Design System",
    description: "두 가지 상태 중 하나를 선택할 때 사용하는 스위치(토글) 컴포넌트 가이드입니다. 키보드와 스크린 리더 접근성을 완벽하게 지원합니다.",
};

export default function SwitchPage() {
    return <SwitchPageClient />;
}
