import { HomeClient } from "./HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "바나나웨딩 | 나만의 모바일 청첩장",
  description: "유통기한 없는 우리만의 달콤한 이야기, 바나나웨딩에서 특별하게 전하세요.",
  openGraph: {
    title: "바나나웨딩 | 나만의 모바일 청첩장",
    description: "쉽고 빠른 모바일 청첩장 만들기",
    type: "website",
    locale: "ko_KR",
  },
};

export default function Home() {
  return (
    <>
      <HomeClient />
    </>
  );
}
