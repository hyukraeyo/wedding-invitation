import Image from 'next/image';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GreetingView() {
    const {
        greetingTitle, message, imageUrl,
        showNamesAtBottom, sortNames, enableFreeformNames,
        groom, bride,
        groomNameCustom, brideNameCustom
    } = useInvitationStore();

    if (!message && !showNamesAtBottom) return null;

    const formatParentName = (parent: { name: string; isDeceased: boolean }) => {
        if (!parent.name) return '';
        return parent.isDeceased ? `故 ${parent.name}` : parent.name;
    };

    return (
        <div className="py-20 px-10 text-center mx-4">
            <div className="space-y-12">
                {/* Title */}
                {greetingTitle && (
                    <div className="flex flex-col items-center space-y-4">
                        <h2
                            className="text-forest-green font-light tracking-[0.3em] uppercase opacity-50"
                            style={{ fontSize: 'calc(12px * var(--font-scale))' }}
                        >
                            {greetingTitle}
                        </h2>
                        <div className="w-12 h-[1px] bg-forest-green opacity-20"></div>
                    </div>
                )}

                {/* Message */}
                <div
                    className="leading-[2.2] text-gray-700 whitespace-pre-wrap font-serif tracking-tight"
                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                >
                    {message}
                </div>

                {/* Decorative Element */}
                <div className="flex justify-center py-4 opacity-10">
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <path d="M50 20v60M20 50h60M35 35l30 30M65 35l-30 30" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Signatures */}
                {showNamesAtBottom && (
                    <div className={`mt-10 ${sortNames ? 'space-y-4' : 'space-y-8'}`}>
                        {enableFreeformNames ? (
                            // Freeform Mode
                            <div className="space-y-4">
                                <div
                                    className="leading-relaxed whitespace-pre-wrap text-gray-800 font-serif"
                                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                                >
                                    {groomNameCustom}
                                </div>
                                <div
                                    className="leading-relaxed whitespace-pre-wrap text-gray-800 font-serif"
                                    style={{ fontSize: 'calc(15px * var(--font-scale))' }}
                                >
                                    {brideNameCustom}
                                </div>
                            </div>
                        ) : (
                            // Standard Mode
                            <div className="space-y-4">
                                {/* Groom */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 font-serif text-gray-800">
                                    <div
                                        className="flex items-center gap-2 opacity-80"
                                        style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                                    >
                                        <span>{formatParentName(groom.parents.father)}</span>
                                        <span className="text-gray-300">·</span>
                                        <span>{formatParentName(groom.parents.mother)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-gray-400 font-sans"
                                            style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                                        >의 {groom.relation}</span>
                                        <span
                                            className="font-medium"
                                            style={{ fontSize: 'calc(18px * var(--font-scale))' }}
                                        >{groom.firstName}</span>
                                    </div>
                                </div>
                                {/* Bride */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 font-serif text-gray-800">
                                    <div
                                        className="flex items-center gap-2 opacity-80"
                                        style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                                    >
                                        <span>{formatParentName(bride.parents.father)}</span>
                                        <span className="text-gray-300">·</span>
                                        <span>{formatParentName(bride.parents.mother)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-gray-400 font-sans"
                                            style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                                        >의 {bride.relation}</span>
                                        <span
                                            className="font-medium"
                                            style={{ fontSize: 'calc(18px * var(--font-scale))' }}
                                        >{bride.firstName}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Optional Image (Moved to bottom or adjusted) */}
                {imageUrl && (
                    <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden shadow-inner mx-auto max-w-[240px] mt-12 grayscale-[20%] opacity-90">
                        <Image src={imageUrl} alt="Greeting" fill className="object-cover" />
                    </div>
                )}
            </div>
        </div>
    );
}
