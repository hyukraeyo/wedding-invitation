import { Metadata } from "next";
import CalendarPageClient from "./CalendarPageClient";

export const metadata: Metadata = {
    title: "Calendar | Banana Wedding Design System",
    description: "날짜 선택을 위한 Calendar 컴포넌트입니다.",
};

export default function CalendarPage() {
    return <CalendarPageClient />;
}