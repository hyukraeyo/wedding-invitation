import React from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function NamesView() {
    const { groom, bride, showNamesAtBottom } = useInvitationStore();

    return (
        <div className="py-12 px-6 text-center">
            <div className="flex justify-center items-center gap-8 mb-8">
                {/* Groom */}
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm text-gray-500">{groom.relation}</span>
                    <span className="text-xl font-serif font-medium">{groom.lastName}{groom.firstName}</span>
                </div>
                <div className="text-gray-300 text-sm">|</div>
                {/* Bride */}
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm text-gray-500">{bride.relation}</span>
                    <span className="text-xl font-serif font-medium">{bride.lastName}{bride.firstName}</span>
                </div>
            </div>

            {showNamesAtBottom && (
                <div className="text-sm text-gray-600 leading-loose">
                    <div className="flex items-center justify-center gap-2">
                        <span>{groom.parents.father.name} · {groom.parents.mother.name}</span>
                        <span className="text-xs text-gray-400">의 {groom.relation}</span>
                        <span className="font-medium">{groom.firstName}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span>{bride.parents.father.name} · {bride.parents.mother.name}</span>
                        <span className="text-xs text-gray-400">의 {bride.relation}</span>
                        <span className="font-medium">{bride.firstName}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
