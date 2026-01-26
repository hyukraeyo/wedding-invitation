import { Metadata } from "next";
import RadioGroupPageClient from "./RadioGroupPageClient";

export const metadata: Metadata = {
  title: "Radio Group | Banana Wedding Design System",
  description: "여러 옵션 중 하나를 선택할 때 사용하는 라디오 그룹과 세그먼트 컨트롤 컴포넌트 가이드입니다. 웹 접근성을 준수하며 다양한 커스터마이징 옵션을 제공합니다.",
};

export default function RadioGroupPage() {
  return <RadioGroupPageClient />;
}
