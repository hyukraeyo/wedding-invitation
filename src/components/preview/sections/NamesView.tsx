import React from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function NamesView() {
    const { groom, bride, showNamesAtBottom } = useInvitationStore();

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
                <div className="text-forest-green opacity-20 font-serif italic text-xl">&</div>

                {/* Bride */}
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-light font-sans">{bride.relation}</span>
                    <span className="text-2xl font-serif font-light text-gray-800 tracking-wider">
                        <span className="text-lg opacity-60 mr-1">{bride.lastName}</span>
                        {bride.firstName}
                    </span>
                </div>
            </div>

            {showNamesAtBottom && (
                <div className="text-[14px] text-gray-500 leading-relaxed font-serif space-y-2 opacity-80">
                    <div className="flex items-center justify-center gap-3">
                        <span className="font-light">{groom.parents.father.name} · {groom.parents.mother.name}</span>
                        <span className="text-[11px] text-gray-300 font-sans italic lowercase">의 {groom.relation}</span>
                        <span className="font-medium text-gray-700">{groom.firstName}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <span className="font-light">{bride.parents.father.name} · {bride.parents.mother.name}</span>
                        <span className="text-[11px] text-gray-300 font-sans italic lowercase">의 {bride.relation}</span>
                        <span className="font-medium text-gray-700">{bride.firstName}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
