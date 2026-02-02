import { invitationService } from '@/services/invitationService';
import InvitationCanvas from '@/components/preview/InvitationCanvas';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import styles from './page.module.scss';

interface Props {
    params: Promise<{ slug: string }>;
}

const getInvitation = cache(async (slug: string) => {
    const supabase = await createSupabaseServerClient(null);

    // Prepare all possible slug variations upfront
    const possibleSlugs = new Set<string>([slug]);

    try {
        const decodedSlug = decodeURIComponent(slug);
        if (decodedSlug !== slug) possibleSlugs.add(decodedSlug);

        const nfcSlug = decodedSlug.normalize('NFC');
        if (nfcSlug !== decodedSlug) possibleSlugs.add(nfcSlug);

        const nfdSlug = decodedSlug.normalize('NFD');
        if (nfdSlug !== decodedSlug && nfdSlug !== nfcSlug) {
            possibleSlugs.add(nfdSlug);
        }
    } catch (e) {
        console.error('Slug decoding error:', e);
    }

    // Try all variations in a single batch query for better performance
    const invitations = await invitationService.getInvitationsBySlugs(Array.from(possibleSlugs), supabase);

    if (invitations.length === 0) return null;

    // If multiple matches found (rare case of slug collisions across encodings), 
    // prioritize exact match or first one found
    const exactMatch = invitations.find(inv => inv.slug === slug);
    return exactMatch || invitations[0];
});

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const invitation = await getInvitation(slug);

    if (!invitation) return { title: 'Invitation Not Found' };

    const data = invitation.invitation_data;
    const groomName = `${data.groom.lastName}${data.groom.firstName}`;
    const brideName = `${data.bride.lastName}${data.bride.firstName}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wedding-invitation-zeta-one.vercel.app';
    const ogTitle = data.kakaoShare?.title || `${groomName} ♥ ${brideName} 결혼식에 초대해요`;
    const ogDescription = data.kakaoShare?.description || data.greetingTitle || '소중한 분들을 초대해요.';
    let ogImage = data.kakaoShare?.imageUrl || data.imageUrl || '/logo.png';

    if (ogImage.startsWith('/')) {
        ogImage = `${baseUrl}${ogImage}`;
    }

    return {
        title: `${groomName} ♥ ${brideName} 결혼식에 초대해요`,
        description: data.greetingTitle || '소중한 분들을 초대해요.',
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
    const invitation = await getInvitation(slug);

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
        "description": data.greetingTitle || '결혼식에 초대해요.',
        "performer": [
            { "@type": "Person", "name": `${data.groom.lastName}${data.groom.firstName}`, "honorificSuffix": "신랑" },
            { "@type": "Person", "name": `${data.bride.lastName}${data.bride.firstName}`, "honorificSuffix": "신부" }
        ]
    };

    return (
        <div className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <InvitationCanvas data={invitation.invitation_data} />
        </div>
    );
}
