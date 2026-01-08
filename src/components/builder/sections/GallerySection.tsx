import React from 'react';
import Image from 'next/image';
import { ImagePlus, Trash2, Plus, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderCheckbox } from '../BuilderCheckbox';
import { BuilderInput } from '../BuilderInput';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderField } from '../BuilderField';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const GallerySection = React.memo<SectionProps>(function GallerySection({ isOpen, onToggle }) {
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

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <div className="space-y-6">
                {/* 제목 */}
                <BuilderField label="제목">
                    <BuilderInput
                        type="text"
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        placeholder="웨딩 갤러리"
                    />
                </BuilderField>

                {/* 갤러리 타입 */}
                <BuilderField label="갤러리 타입">
                    <BuilderButtonGroup
                        value={galleryType}
                        options={[
                            { label: '스와이프', value: 'swipe' },
                            { label: '썸네일', value: 'thumbnail' },
                            { label: '그리드', value: 'grid' },
                        ]}
                        onChange={(val: 'swipe' | 'thumbnail' | 'grid') => setGalleryType(val)}
                    />
                </BuilderField>

                {/* 팝업 뷰어 */}
                <BuilderField label="옵션">
                    <BuilderCheckbox
                        checked={galleryPopup}
                        onChange={(checked) => setGalleryPopup(checked)}
                    >
                        <span className="text-sm text-gray-500">갤러리 사진을 터치하면 팝업 뷰어로 크게 봅니다.</span>
                    </BuilderCheckbox>
                </BuilderField>

                {/* 이미지 업로드 영역 */}
                <BuilderField label="사진 관리">
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
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Info size={12} className="shrink-0 text-gray-400" />
                                <span>사진을 드래그하여 순서 변경 가능</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Info size={12} className="shrink-0 text-gray-400" />
                                <span>최대 40장까지 등록할 수 있습니다.</span>
                            </div>
                        </div>
                    </div>
                </BuilderField>
            </div>
        </AccordionItem>
    );
});

export default GallerySection;
