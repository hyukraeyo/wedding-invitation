import React, { useMemo, useCallback, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Plus, Info } from 'lucide-react';
import styles from './GallerySection.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderInput } from '../BuilderInput';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
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

    const normalizedGallery = useMemo(() => {
        if (!gallery) return [];
        return (gallery as (string | { id: string; url: string })[]).map((item, index) => {
            if (typeof item === 'string') {
                return { id: `legacy-${index}-${item.substring(0, 10)}`, url: item };
            }
            return item;
        });
    }, [gallery]);

    const galleryIds = useMemo(() => normalizedGallery.map(item => item.id), [normalizedGallery]);

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

        const readFileAsBase64 = (file: File): Promise<string> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        };

        Promise.all(filesToProcess.map(readFileAsBase64)).then(newImageUrls => {
            const newEntries = newImageUrls.map(url => ({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                url
            }));
            setGallery([...gallery, ...newEntries]);
            e.target.value = '';
        });
    };

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = normalizedGallery.findIndex(item => item.id === active.id);
            const newIndex = normalizedGallery.findIndex(item => item.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                setGallery(arrayMove(normalizedGallery, oldIndex, newIndex));
            }
        }
        setActiveId(null);
    }, [normalizedGallery, setGallery]);

    const activeImageUrl = useMemo(() =>
        activeId ? normalizedGallery.find(item => item.id === activeId)?.url : null
        , [activeId, normalizedGallery]);

    return (
        <AccordionItem
            title="갤러리"
            icon={ImagePlus}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={normalizedGallery.length > 0}
        >
            <div className={styles.container}>
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
                    <div className={styles.toggleGroup}>
                        <BuilderToggle
                            checked={galleryPopup}
                            onChange={setGalleryPopup}
                            label="갤러리 팝업 뷰어 사용"
                        />
                    </div>
                </BuilderField>

                {/* 스와이퍼 옵션들 (스와이퍼 타입일 때만 표시) */}
                {galleryType === 'swiper' && (
                    <BuilderField label="스와이퍼 설정">
                        <div className={styles.toggleGroup}>
                            <BuilderToggle
                                checked={galleryPreview}
                                onChange={setGalleryPreview}
                                label="미리보기"
                            />
                            <BuilderToggle
                                checked={galleryFade}
                                onChange={setGalleryFade}
                                label="페이드 효과"
                            />
                            <BuilderToggle
                                checked={galleryAutoplay}
                                onChange={setGalleryAutoplay}
                                label="자동 재생"
                            />
                        </div>
                    </BuilderField>
                )}

                {/* 이미지 업로드 영역 */}
                <BuilderField
                    label={
                        <div className={styles.headerRow}>
                            <BuilderLabel className="!mb-0">사진 관리</BuilderLabel>
                            <span className={styles.count}>
                                <span style={{ color: normalizedGallery.length >= 20 ? '#EF4444' : theme.accentColor }}>{normalizedGallery.length}</span>
                                <span className={styles.max}> / 20</span>
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
                                items={galleryIds}
                                strategy={rectSortingStrategy}
                            >
                                <div className={styles.grid}>
                                    {/* 업로드된 이미지 리스트 */}
                                    {normalizedGallery.map((img) => (
                                        <SortableImage
                                            key={img.id}
                                            id={img.id}
                                            url={img.url}
                                            onDelete={setGallery}
                                            gallery={normalizedGallery}
                                        />
                                    ))}

                                    {/* 추가 버튼 (20개 미만일 때만 표시) */}
                                    {normalizedGallery.length < 20 && (
                                        <label className={styles.uploadButton}>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className={styles.hiddenInput}
                                                onChange={handleUpload}
                                            />
                                            <Plus size={20} />
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
                                    <div className={clsx(styles.sortableItem, styles.dragging)}>
                                        <Image
                                            src={activeImageUrl}
                                            alt=""
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>

                        {/* 안내 문구 */}
                        <div className={styles.infoBox}>
                            <Info size={14} className={styles.icon} />
                            <span>사진을 길게 누르거나 드래그하여 순서를 변경할 수 있습니다.</span>
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
    onDelete: (images: { id: string; url: string }[]) => void;
    gallery: { id: string; url: string }[];
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
        touchAction: 'none',
    };

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(gallery.filter(item => item.id !== id));
    }, [id, gallery, onDelete]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(styles.sortableItem, isDragging && styles.dragging)}
        >
            <Image
                src={url}
                alt=""
                fill
                unoptimized
            />

            <div className={styles.overlay} />

            <button
                onClick={handleDelete}
                className={styles.deleteButton}
                title="삭제"
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking delete
            >
                <Plus size={12} className="rotate-45" />
            </button>

            <div
                {...attributes}
                {...listeners}
                className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
            />
        </div>
    );
});

export default GallerySection;
