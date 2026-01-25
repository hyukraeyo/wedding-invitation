"use client";

import React from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { InfoMessage } from "@/components/ui/InfoMessage";
import { InvitationCard } from "@/components/ui/InvitationCard";
import { SampleList } from "@/components/ui/SampleList";
import { Banana, CalendarDays, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import styles from "../DesignSystem.module.scss";
import Story from "../Story";

const DUMMY_INVITATION = {
    id: "inv-1",
    slug: "demo-wedding",
    userId: "user-1",
    title: "Emma & Noah Wedding",
    invitation_data: {
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        isApproved: true,
        mainScreen: { title: "You are invited" },
        date: "2024.12.24",
        location: "Banana Wedding Hall",
        updated_at: new Date().toISOString()
    },
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
};

const DUMMY_PHRASES = [
    { title: "Warm Welcome", content: "We are thrilled to celebrate with you.<br/>Please join our special day.", badge: "Recommended" },
    { title: "Simple Invite", content: "Please come celebrate with us.<br/>We look forward to seeing you.", badge: "Popular" }
];

export default function PatternsTab() {
    return (
        <div className={styles.storySection}>
            <Story title="Business Patterns" description="Composite components and business flows">
                <div className="max-w-[400px] w-full">
                    <InvitationCard
                        invitation={DUMMY_INVITATION as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                        onEdit={() => { }}
                        onDelete={() => { }}
                        onRequestApproval={() => { }}
                        onCancelRequest={() => { }}
                        onRevokeApproval={() => { }}
                        layout="grid"
                    />
                </div>
            </Story>

            <Story title="Content Choice List" description="Prebuilt copy options">
                <div className="w-full">
                    <SampleList
                        items={DUMMY_PHRASES}
                        onSelect={(item) => toast.info(`${item.title} selected`)}
                    />
                </div>
            </Story>

            <Story title="Visual Overlays" description="Message banners and placeholders">
                <div className="space-y-6 w-full">
                    <InfoMessage>
                        <div className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            <span>Invitations are reviewed within 24 hours by our team.</span>
                        </div>
                    </InfoMessage>
                    <div className="h-[200px] w-full bg-zinc-50 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-4 text-zinc-300">
                        <ImageIcon size={48} />
                        <p className="text-sm font-medium">Image Upload Area Placeholder</p>
                    </div>
                </div>
            </Story>

            <Story title="Empty States" description="No data placeholders">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <EmptyState
                        icon={<ImageIcon size={48} className="text-zinc-200" />}
                        title="Upload your first photo"
                        description="Start by adding a memory to the gallery."
                    />
                    <EmptyState
                        variant="banana"
                        icon={<Banana size={48} />}
                        title="No invitations yet"
                        description="Create your first invitation to get started."
                    />
                </div>
            </Story>
        </div>
    );
}
