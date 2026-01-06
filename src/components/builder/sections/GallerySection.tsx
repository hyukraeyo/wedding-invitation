import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function GallerySection({ isOpen, onToggle }: SectionProps) {
    const { gallery, setGallery } = useInvitationStore();

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
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    {gallery.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
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
                        </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-forest-green hover:text-forest-green transition-colors cursor-pointer">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                        />
                        <ImagePlus size={20} />
                        <span className="text-xs">추가</span>
                    </label>
                </div>
                <p className="text-xs text-gray-400">※ 실제 파일 업로드는 추후 구현 예정입니다. 지금은 브라우저 미리보기만 가능합니다.</p>
            </div>
        </AccordionItem>
    );
}
