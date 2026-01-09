import { invitationService } from '@/services/invitationService';
import InvitationCanvas from '@/components/preview/InvitationCanvas';
import StoreHydrator from '@/components/preview/StoreHydrator';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const invitation = await invitationService.getInvitation(slug);

    if (!invitation) return { title: 'Invitation Not Found' };

    const data = invitation.invitation_data;
    const groomName = `${data.groom.lastName}${data.groom.firstName}`;
    const brideName = `${data.bride.lastName}${data.bride.firstName}`;

    return {
        title: `${groomName} ♥ ${brideName} 결혼식에 초대합니다`,
        description: data.greetingTitle || '소중한 분들을 초대합니다.',
        openGraph: {
            title: `${groomName} ♥ ${brideName} 모바일 청첩장`,
            description: data.greetingTitle,
            images: [data.imageUrl || '/next.svg'],
        },
    };
}

export default async function InvitationViewPage({ params }: Props) {
    const { slug } = await params;
    const invitation = await invitationService.getInvitation(slug);

    if (!invitation) {
        notFound();
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <StoreHydrator data={invitation.invitation_data} />
            <InvitationCanvas />
        </div>
    );
}
