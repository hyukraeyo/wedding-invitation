import Image from 'next/image';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GreetingView() {
    const {
        greetingTitle, greetingSubtitle, message, imageUrl,
        showNamesAtBottom, enableFreeformNames,
        groom, bride,
        groomNameCustom
    } = useInvitationStore();
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    if (!message && !showNamesAtBottom) return null;

    const formatParentName = (parent: { name: string; isDeceased: boolean }) => {
        if (!parent.name) return '';
        return parent.isDeceased ? `故 ${parent.name}` : parent.name;
    };

    return (
        <div className="py-14 px-10 text-center mx-4 relative overflow-hidden">
            <div className="space-y-6">
                {/* Section Header */}
                <div className="flex flex-col items-center space-y-1">
                    {greetingSubtitle && (
                        <div
                            className="font-serif uppercase tracking-[0.3em]"
                            style={{
                                fontSize: 'calc(13px * var(--font-scale))',
                                color: accentColor,
                                opacity: 0.6
                            }}
                        >
                            {greetingSubtitle}
                        </div>
                    )}
                    {greetingTitle && (
                        <div className="flex flex-col items-center space-y-3">
                            <h2
                                className="font-serif tracking-[0.15em] font-medium leading-relaxed"
                                style={{
                                    fontSize: 'calc(21px * var(--font-scale))',
                                    color: accentColor
                                }}
                            >
                                {greetingTitle}
                            </h2>
                            <div className="w-12 h-[1px] bg-gray-100"></div>
                        </div>
                    )}
                </div>

                {/* Message */}
                <div
                    className="leading-[1.8] text-gray-700 font-serif tracking-tight px-2 rich-text-content"
                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                    dangerouslySetInnerHTML={{ __html: message }}
                />

                {/* Optional Photo */}
                {imageUrl && (
                    <div className="relative -mx-10 w-[calc(100%+5rem)] aspect-[3/2] overflow-hidden mt-8 mb-0 animate-in fade-in zoom-in duration-700">
                        <Image src={imageUrl} alt="Greeting" fill className="object-cover" />
                    </div>
                )}

                {/* Signatures */}
                {showNamesAtBottom && (
                    <div className="mt-10 pt-10 border-t border-gray-50">
                        {enableFreeformNames ? (
                            // Freeform Mode
                            <div
                                className="leading-[2.2] text-gray-700 font-serif rich-text-content"
                                style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                                dangerouslySetInnerHTML={{ __html: groomNameCustom }}
                            />
                        ) : (
                            // Standard Mode
                            <div className="space-y-6">
                                {/* Groom */}
                                <div className="flex flex-col items-center justify-center gap-2 font-serif text-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex items-center gap-2 opacity-70 text-gray-600"
                                            style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                                        >
                                            <span>{formatParentName(groom.parents.father)}</span>
                                            <span className="text-gray-300">·</span>
                                            <span>{formatParentName(groom.parents.mother)}</span>
                                        </div>
                                        <span
                                            className="text-gray-400 font-sans mt-0.5"
                                            style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                                        >의 {groom.relation}</span>
                                        <span
                                            className="font-medium text-gray-900"
                                            style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                                        >{groom.firstName}</span>
                                    </div>
                                </div>
                                {/* Bride */}
                                <div className="flex flex-col items-center justify-center gap-2 font-serif text-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex items-center gap-2 opacity-70 text-gray-600"
                                            style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                                        >
                                            <span>{formatParentName(bride.parents.father)}</span>
                                            <span className="text-gray-300">·</span>
                                            <span>{formatParentName(bride.parents.mother)}</span>
                                        </div>
                                        <span
                                            className="text-gray-400 font-sans mt-0.5"
                                            style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                                        >의 {bride.relation}</span>
                                        <span
                                            className="font-medium text-gray-900"
                                            style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                                        >{bride.firstName}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
