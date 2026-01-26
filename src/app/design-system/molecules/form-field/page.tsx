import { Metadata } from "next";
import FormFieldPageClient from "./FormFieldPageClient";

export const metadata: Metadata = {
    title: "Form Field | Banana Wedding Design System",
    description: "모든 입력 요소의 레이블, 설명, 에러 메시지를 일관되게 관리하는 FormField 공통 래퍼 컴포넌트입니다.",
};

export default function FormFieldPage() {
    return <FormFieldPageClient />;
}
