import React from 'react';
import { User2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function BasicInfoSection({ isOpen, onToggle }: SectionProps) {
    const {
        groom, setGroom,
        bride, setBride,
        setGroomParents,
        setBrideParents
    } = useInvitationStore();

    return (
        <AccordionItem
            title="기본 정보"
            icon={User2}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!groom.firstName && !!bride.firstName}
        >
            <div className="space-y-8">
                {/* Groom Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-800">🤵 신랑</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium pl-1">신랑</span>
                        <BuilderInput
                            type="text"
                            placeholder="성"
                            value={groom.lastName}
                            onChange={(e) => setGroom({ lastName: e.target.value })}
                        />
                        <BuilderInput
                            type="text"
                            placeholder="이름"
                            value={groom.firstName}
                            onChange={(e) => setGroom({ firstName: e.target.value })}
                        />
                        <BuilderInput
                            type="text"
                            placeholder="관계"
                            value={groom.relation}
                            onChange={(e) => setGroom({ relation: e.target.value })}
                        />
                    </div>

                    {/* Groom Parents */}
                    <div className="grid grid-cols-[60px_1fr_60px] gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium pl-1">아버지</span>
                        <BuilderInput
                            type="text"
                            placeholder="성함"
                            value={groom.parents.father.name}
                            onChange={(e) => setGroomParents('father', { name: e.target.value })}
                        />
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={groom.parents.father.isDeceased}
                                onChange={(e) => setGroomParents('father', { isDeceased: e.target.checked })}
                                className="rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">故</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-[60px_1fr_60px] gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium pl-1">어머니</span>
                        <BuilderInput
                            type="text"
                            placeholder="성함"
                            value={groom.parents.mother.name}
                            onChange={(e) => setGroomParents('mother', { name: e.target.value })}
                        />
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={groom.parents.mother.isDeceased}
                                onChange={(e) => setGroomParents('mother', { isDeceased: e.target.checked })}
                                className="rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">故</span>
                        </label>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100"></div>

                {/* Bride Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-800">👰‍♀️ 신부</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium pl-1">신부</span>
                        <BuilderInput
                            type="text"
                            placeholder="성"
                            value={bride.lastName}
                            onChange={(e) => setBride({ lastName: e.target.value })}
                        />
                        <BuilderInput
                            type="text"
                            placeholder="이름"
                            value={bride.firstName}
                            onChange={(e) => setBride({ firstName: e.target.value })}
                        />
                        <BuilderInput
                            type="text"
                            placeholder="관계"
                            value={bride.relation}
                            onChange={(e) => setBride({ relation: e.target.value })}
                        />
                    </div>

                    {/* Bride Parents */}
                    <div className="grid grid-cols-[60px_1fr_60px] gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium pl-1">아버지</span>
                        <BuilderInput
                            type="text"
                            placeholder="성함"
                            value={bride.parents.father.name}
                            onChange={(e) => setBrideParents('father', { name: e.target.value })}
                        />
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={bride.parents.father.isDeceased}
                                onChange={(e) => setBrideParents('father', { isDeceased: e.target.checked })}
                                className="rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">故</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-[60px_1fr_60px] gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium pl-1">어머니</span>
                        <BuilderInput
                            type="text"
                            placeholder="성함"
                            value={bride.parents.mother.name}
                            onChange={(e) => setBrideParents('mother', { name: e.target.value })}
                        />
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={bride.parents.mother.isDeceased}
                                onChange={(e) => setBrideParents('mother', { isDeceased: e.target.checked })}
                                className="rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">故</span>
                        </label>
                    </div>
                </div>

            </div>
        </AccordionItem>
    );
}
