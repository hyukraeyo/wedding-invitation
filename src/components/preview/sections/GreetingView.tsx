import Image from 'next/image';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GreetingView() {
    const {
        greetingTitle, message, imageUrl,
        showNamesAtBottom, sortNames, enableFreeformNames,
        groom, bride,
        groomNameCustom, brideNameCustom
    } = useInvitationStore();

    if (!message) return null;

    const formatParentSearch = (parent: { name: string; isDeceased: boolean }) => {
        return parent.isDeceased ? `故 ${parent.name}` : parent.name;
    };

    return (
        <div className="py-16 px-8 text-center bg-white/30 backdrop-blur-sm mx-4 rounded-3xl shadow-sm border border-white/50">
            <div className="space-y-8">
                {/* Title */}
                {greetingTitle && (
                    <h2 className="text-forest-green font-medium text-lg tracking-widest uppercase opacity-80">
                        {greetingTitle}
                    </h2>
                )}

                {/* Optional Image */}
                {imageUrl && (
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-sm mx-auto max-w-[200px]">
                        <Image src={imageUrl} alt="Greeting" fill className="object-cover" />
                    </div>
                )}

                {/* Message */}
                <div className="text-sm leading-8 text-gray-700 whitespace-pre-wrap font-serif">
                    {message}
                </div>

                {/* Signatures */}
                {showNamesAtBottom && (
                    <div className={`mt-8 ${sortNames ? 'space-y-3' : 'space-y-6'}`}>
                        {enableFreeformNames ? (
                            // Freeform Mode
                            <>
                                <div className="leading-relaxed whitespace-pre-wrap text-sm text-gray-800 font-serif">
                                    {groomNameCustom}
                                </div>
                                <div className="leading-relaxed whitespace-pre-wrap text-sm text-gray-800 font-serif">
                                    {brideNameCustom}
                                </div>
                            </>
                        ) : (
                            // Standard Mode
                            <>
                                {/* Groom */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-serif text-gray-800">
                                    <div className="flex items-center gap-2">
                                        <span>{formatParentSearch(groom.parents.father)}</span>
                                        <span className="text-gray-400">·</span>
                                        <span>{formatParentSearch(groom.parents.mother)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs">의 {groom.relation}</span>
                                        <span className="text-lg font-medium">{groom.firstName}</span>
                                    </div>
                                </div>
                                {/* Bride */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-serif text-gray-800">
                                    <div className="flex items-center gap-2">
                                        <span>{formatParentSearch(bride.parents.father)}</span>
                                        <span className="text-gray-400">·</span>
                                        <span>{formatParentSearch(bride.parents.mother)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs">의 {bride.relation}</span>
                                        <span className="text-lg font-medium">{bride.firstName}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
