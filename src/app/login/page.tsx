import type { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
    title: "로그인 | 바나나웨딩",
    description: "3초 만에 로그인하고 나만의 달콤한 모바일 청첩장을 만들어보세요. 카카오, 네이버 소셜 로그인을 지원합니다.",
    openGraph: {
        title: "로그인 | 바나나웨딩",
        description: "3초 만에 로그인하고 나만의 달콤한 모바일 청첩장을 만들어보세요.",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};

import { Suspense } from "react";
import { Loader } from "@/components/ui";

export default function Page() {
    return (
        <Suspense fallback={<Loader.Banana />}>
            <LoginPage />
        </Suspense>
    );
}
