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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wedding-invitation-zeta-one.vercel.app';
    const ogTitle = data.kakaoShare?.title || `${groomName} ♥ ${brideName} 결혼식에 초대합니다`;
    const ogDescription = data.kakaoShare?.description || data.greetingTitle || '소중한 분들을 초대합니다.';
    let ogImage = data.kakaoShare?.imageUrl || data.imageUrl || '/logo.png';

    if (ogImage.startsWith('/')) {
        ogImage = `${baseUrl}${ogImage}`;
    }

    return {
        title: `${groomName} ♥ ${brideName} 결혼식에 초대합니다`,
        description: data.greetingTitle || '소중한 분들을 초대합니다.',
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            url: `${baseUrl}/v/${slug}`,
            siteName: 'Wedding Invitation Studio',
            images: [
                {
                    url: ogImage,
                    width: 800,
                    height: 800,
                    alt: 'Wedding Invitation Thumbnail',
                },
            ],
            locale: 'ko_KR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: ogDescription,
            images: [ogImage],
        },
    };
}

export default async function InvitationViewPage({ params }: Props) {
    const { slug } = await params;
    const invitation = await invitationService.getInvitation(slug);

    if (!invitation) {
        notFound();
    }

    const { invitation_data: data } = invitation;

    // JSON-LD for Event (SEO Rule Compliance)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": `${data.groom.firstName} & ${data.bride.firstName}의 결혼식`,
        "startDate": `${data.date.replaceAll('.', '-')}T${data.time}`,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": data.location,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": `${data.address} ${data.detailAddress}`,
                "addressCountry": "KR"
            }
        },
        "image": data.imageUrl ? [data.imageUrl] : undefined,
        "description": data.greetingTitle || '결혼식에 초대합니다.',
        "performer": [
            { "@type": "Person", "name": `${data.groom.lastName}${data.groom.firstName}`, "honorificSuffix": "신랑" },
            { "@type": "Person", "name": `${data.bride.lastName}${data.bride.firstName}`, "honorificSuffix": "신부" }
        ]
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StoreHydrator data={invitation.invitation_data} />
            <InvitationCanvas />
        </div>
    );
}
