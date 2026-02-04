import type { Metadata } from "next";
import LoginPage from "./LoginPage";
import { getProfileForSession } from "./actions";
import { getSession } from "@/lib/auth/getSession";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "로그인 | 바나나웨딩",
    description: "3초 만에 로그인하고 나만의 달콤한 모바일 청첩장을 만들어보세요. 카카오, 네이버 소셜 로그인을 지원해요.",
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
import { BananaLoader } from "@/components/ui/Loader";

export default async function Page({
    searchParams,
}: {
    searchParams?: Record<string, string | string[] | undefined>;
}) {
    const callbackParam = searchParams?.callbackUrl ?? searchParams?.returnTo;
    const callbackUrl = Array.isArray(callbackParam)
        ? callbackParam[0] ?? "/builder"
        : callbackParam ?? "/builder";

    const session = await getSession();
    const initialProfileState = await getProfileForSession();
    if (session?.user && initialProfileState?.isComplete) {
        redirect(callbackUrl);
    }
    return (
        <Suspense fallback={<BananaLoader />}>
            <LoginPage
                initialProfileState={initialProfileState}
                initialUser={session?.user ?? null}
            />
        </Suspense>
    );
}
