import React, { useMemo, useCallback, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Plus, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderCheckbox } from '../BuilderCheckbox';
import { BuilderInput } from '../BuilderInput';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderField } from '../BuilderField';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
        setGalleryPopup,
        galleryPreview,
        setGalleryPreview,
        galleryFade,
        setGalleryFade,
        galleryAutoplay,
        setGalleryAutoplay,
        theme
    } = useInvitationStore();

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    });

    const sensorsContext = useSensors(pointerSensor, keyboardSensor);

    const [activeId, setActiveId] = useState<string | null>(null);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const MAX_TOTAL = 20;

        const currentCount = gallery.length;
        if (currentCount >= MAX_TOTAL) {
            alert('이미 20장의 사진이 모두 등록되었습니다.');
            return;
        }

        const validFiles: File[] = [];
        const ignoredFiles: string[] = [];

        Array.from(files).forEach(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                ignoredFiles.push(`${file.name} (지원하지 않는 형식)`);
                return;
            }
            if (file.size > MAX_SIZE) {
                ignoredFiles.push(`${file.name} (10MB 초과)`);
                return;
            }
            validFiles.push(file);
        });

        if (ignoredFiles.length > 0) {
            alert(`일부 파일이 제외되었습니다:\n${ignoredFiles.join('\n')}`);
        }

        if (validFiles.length === 0) return;

        const remainingCount = MAX_TOTAL - currentCount;
        if (validFiles.length > remainingCount) {
            alert(`최대 20장까지만 등록 가능합니다. 선택한 파일 중 ${remainingCount}장만 추가됩니다.`);
        }

        const filesToProcess = validFiles.slice(0, remainingCount);
        const newImageUrls = filesToProcess.map(file => URL.createObjectURL(file));
        setGallery([...gallery, ...newImageUrls]);

        // Reset input
        e.target.value = '';
    };

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = gallery.indexOf(active.id as string);
            const newIndex = gallery.indexOf(over.id as string);
            setGallery(arrayMove(gallery, oldIndex, newIndex));
        }
        setActiveId(null);
    }, [gallery, setGallery]);

    const activeImageUrl = useMemo(() =>
        activeId ? gallery.find(url => url === activeId) : null
        , [activeId, gallery]);

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
                            { label: '스와이퍼', value: 'swiper' },
                            { label: '썸네일', value: 'thumbnail' },
                            { label: '그리드', value: 'grid' },
                        ]}
                        onChange={(val: 'swiper' | 'thumbnail' | 'grid') => setGalleryType(val)}
                    />
                </BuilderField>

                {/* 팝업 뷰어 */}
                <BuilderField label="옵션">
                    <BuilderCheckbox
                        checked={galleryPopup}
                        onChange={(checked) => setGalleryPopup(checked)}
                    >
                        갤러리 사진을 터치하면 팝업 뷰어로 크게 봅니다.
                    </BuilderCheckbox>
                </BuilderField>

                {/* 스와이퍼 옵션들 (스와이퍼 타입일 때만 표시) */}
                {galleryType === 'swiper' && (
                    <>
                        <BuilderField label="스와이퍼 옵션">
                            <div className="space-y-3 px-1">
                                <BuilderCheckbox
                                    checked={galleryPreview}
                                    onChange={(checked) => setGalleryPreview(checked)}
                                >
                                    다음 슬라이드 미리보기
                                </BuilderCheckbox>

                                <BuilderCheckbox
                                    checked={galleryFade}
                                    onChange={(checked) => setGalleryFade(checked)}
                                >
                                    페이드 효과 사용
                                </BuilderCheckbox>

                                <BuilderCheckbox
                                    checked={galleryAutoplay}
                                    onChange={(checked) => setGalleryAutoplay(checked)}
                                >
                                    자동 재생 (3초 간격)
                                </BuilderCheckbox>
                            </div>
                        </BuilderField>
                    </>
                )}

                {/* 이미지 업로드 영역 */}
                <BuilderField
                    label={
                        <div className="flex justify-between items-center w-full mb-3">
                            <BuilderLabel className="!mb-0">사진 관리</BuilderLabel>
                            <span className="text-xs font-normal">
                                <span style={{ color: gallery.length >= 20 ? '#EF4444' : theme.accentColor }}>{gallery.length}</span>
                                <span className="text-gray-400"> / 20</span>
                            </span>
                        </div>
                    }
                >
                    <div>
                        <DndContext
                            sensors={sensorsContext}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToWindowEdges]}
                        >
                            <SortableContext
                                items={gallery}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {/* 업로드된 이미지 리스트 */}
                                    {gallery.map((img) => (
                                        <SortableImage
                                            key={img}
                                            id={img}
                                            url={img}
                                            onDelete={setGallery}
                                            gallery={gallery}
                                        />
                                    ))}

                                    {/* 추가 버튼 (20개 미만일 때만 표시) */}
                                    {gallery.length < 20 && (
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
                                    )}
                                </div>
                            </SortableContext>
                            <DragOverlay dropAnimation={{
                                sideEffects: defaultDropAnimationSideEffects({
                                    styles: {
                                        active: {
                                            opacity: '0.4',
                                        },
                                    },
                                }),
                            }}>
                                {activeId && activeImageUrl ? (
                                    <div className="w-full aspect-square relative rounded-lg overflow-hidden shadow-2xl ring-2 ring-accent scale-105 opacity-90">
                                        <Image
                                            src={activeImageUrl}
                                            alt=""
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>

                        {/* 안내 문구 */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <Info size={13} className="shrink-0 text-gray-400" />
                                <span>사진을 길게 누르거나 드래그하여 순서를 변경할 수 있습니다.</span>
                            </div>
                        </div>
                    </div>
                </BuilderField>
            </div>
        </AccordionItem>
    );
});

// Sortable Image Component
const SortableImage = React.memo(function SortableImage({
    id,
    url,
    onDelete,
    gallery
}: {
    id: string;
    url: string;
    onDelete: (images: string[]) => void;
    gallery: string[];
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.4 : 1,
        touchAction: 'none', // Mobile performance optimization
    };

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(gallery.filter(item => item !== url));
    }, [url, gallery, onDelete]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative aspect-square rounded-lg overflow-hidden group border border-gray-100 bg-gray-50 transition-all duration-200 ${isDragging ? 'shadow-2xl ring-2 ring-accent scale-105 z-50' : 'hover:shadow-md'}`}
        >
            <Image
                src={url}
                alt=""
                fill
                unoptimized
                className={`object-cover transition-transform duration-500 will-change-transform ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}
            />

            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <button
                onClick={handleDelete}
                className="absolute top-1.5 right-1.5 z-30 w-6 h-6 bg-white/90 backdrop-blur-sm text-gray-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white hover:scale-110 shadow-sm border border-gray-200 cursor-pointer"
                title="삭제"
            >
                <Plus size={14} className="rotate-45" />
            </button>

            <div
                {...attributes}
                {...listeners}
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
            />
        </div>
    );
});

export default GallerySection;
