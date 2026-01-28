import { Metadata } from 'next';
import { SetupClient } from './SetupClient';

export const metadata: Metadata = {
    title: '정보 입력 | 바나나웨딩',
    description: '청첩장 제작을 위한 기본 정보를 입력해주세요.',
};

export default function SetupPage() {
    return <SetupClient />;
}
