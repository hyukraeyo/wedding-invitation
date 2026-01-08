import React from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function NamesView() {
    const { groom, bride, theme } = useInvitationStore();

    return (
        <div className="py-16 px-8 text-center">
            <div className="flex justify-center items-center gap-12 mb-10">
                {/* Groom */}
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-light font-sans">{groom.relation}</span>
                    <span className="text-2xl font-serif font-light text-gray-800 tracking-wider">
                        <span className="text-lg opacity-60 mr-1">{groom.lastName}</span>
                        {groom.firstName}
                    </span>
                </div>

                {/* Elegant Ampersand Divider */}
                <div className="opacity-20 font-serif italic text-xl" style={{ color: theme.accentColor }}>&</div>

                {/* Bride */}
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-light font-sans">{bride.relation}</span>
                    <span className="text-2xl font-serif font-light text-gray-800 tracking-wider">
                        <span className="text-lg opacity-60 mr-1">{bride.lastName}</span>
                        {bride.firstName}
                    </span>
                </div>
            </div>

        </div>
    );
}
