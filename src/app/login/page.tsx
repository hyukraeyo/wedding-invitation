import type { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
    title: "로그인 | 시작하기",
    description: "3초 만에 로그인하고 나만의 특별한 모바일 청첩장을 만들어보세요. 카카오, 네이버 소셜 로그인을 지원합니다.",
    openGraph: {
        title: "로그인 | Wedding Invitation Studio",
        description: "3초 만에 로그인하고 나만의 특별한 모바일 청첩장을 만들어보세요.",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function Page() {
    return <LoginPage />;
}
