import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash2, Plus, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function GallerySection({ isOpen, onToggle }: SectionProps) {
    const {
        gallery,
        setGallery,
        galleryTitle,
        setGalleryTitle,
        galleryType,
        setGalleryType,
        galleryPopup,
        setGalleryPopup
    } = useInvitationStore();

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setGallery([...gallery, ...newImages]);
        }
    };

    return (
        <AccordionItem
            title="갤러리"
            icon={ImagePlus}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={gallery.length > 0}
        >
            <div className="space-y-8 py-2">
                {/* 제목 */}
                <div className="flex items-center">
                    <label className="w-24 text-sm font-medium text-gray-800 shrink-0">제목</label>
                    <input
                        type="text"
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        placeholder="웨딩 갤러리"
                        className="w-full bg-gray-100 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-gray-300 outline-none"
                    />
                </div>

                {/* 갤러리 타입 */}
                <div className="flex items-center">
                    <label className="w-24 text-sm font-medium text-gray-800 shrink-0">갤러리 타입</label>
                    <div className="flex gap-2">
                        {(['swipe', 'thumbnail', 'grid'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setGalleryType(type)}
                                className={`
                                    px-4 py-2 text-sm border rounded transition-colors
                                    ${galleryType === type
                                        ? 'border-gray-800 font-bold text-gray-900'
                                        : 'border-gray-100 text-gray-400 font-normal hover:bg-gray-50'}
                                `}
                            >
                                {type === 'swipe' && '스와이프'}
                                {type === 'thumbnail' && '썸네일 스와이프'}
                                {type === 'grid' && '그리드'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 팝업뷰어 */}
                <div className="flex items-start">
                    <label className="w-24 text-sm font-medium text-gray-800 shrink-0 mt-0.5">팝업뷰어</label>
                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={galleryPopup}
                                onChange={(e) => setGalleryPopup(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-800"></div>
                        </label>
                        <span className="text-sm text-gray-400">갤러리 사진을 터치하면, 갤러리 전용 팝업 뷰어가 나타납니다.</span>
                    </div>
                </div>

                {/* 이미지 업로드 영역 */}
                <div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {/* 업로드된 이미지 리스트 */}
                        {gallery.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded overflow-hidden group border border-gray-100">
                                <Image src={img} alt="" fill className="object-cover" />
                                <button
                                    onClick={() => {
                                        const newGallery = [...gallery];
                                        newGallery.splice(i, 1);
                                        setGallery(newGallery);
                                    }}
                                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                                {/* Drag handle indicator (visual only for now) */}
                                <div className="absolute top-1 left-1 bg-black/20 p-0.5 rounded opacity-0 group-hover:opacity-100 cursor-move">
                                    <div className="w-3 h-3 grid grid-cols-2 gap-[1px]">
                                        <div className="bg-white/80 rounded-full"></div>
                                        <div className="bg-white/80 rounded-full"></div>
                                        <div className="bg-white/80 rounded-full"></div>
                                        <div className="bg-white/80 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 추가 버튼 */}
                        <label className="aspect-square border border-dashed border-gray-300 flex items-center justify-center rounded cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleUpload}
                            />
                            <Plus size={24} className="text-gray-400" />
                        </label>
                    </div>

                    {/* 안내 문구 */}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Info size={12} className="shrink-0" />
                            <span>사진을 드래그하여 순서 변경 가능</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Info size={12} className="shrink-0" />
                            <span>최대 40장까지 등록할 수 있습니다.</span>
                        </div>
                    </div>
                </div>
            </div>
        </AccordionItem>
    );
}
