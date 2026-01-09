import { invitationService } from '@/services/invitationService';
import InvitationCanvas from '@/components/preview/InvitationCanvas';
import StoreHydrator from '@/components/preview/StoreHydrator';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
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
