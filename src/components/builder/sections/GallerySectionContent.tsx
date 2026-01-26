import React, { useMemo, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TextField } from '@/components/common/TextField';
import { SwitchField } from '@/components/common/SwitchField';
import { cn } from '@/lib/utils';
import { isBlobUrl } from '@/lib/image';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensors,
    useSensor,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import styles from './GallerySection.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { ResponsiveModal } from '@/components/common/ResponsiveModal/ResponsiveModal';

interface SortableItemProps {
    id: string;
    url: string;
    index: number;
    onRemove: (id: string) => void;
    isDragging?: boolean;
}

const SortableItem = React.memo(function SortableItem({ id, url, index, onRemove, isDragging }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const isUploading = isBlobUrl(url);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                styles.sortableItem,
                isDragging && styles.dragging
            )}
            {...attributes}
            {...listeners}
        >
            <Image
                src={url}
                alt={`Gallery image ${index + 1}`}
                fill
                unoptimized
                className={cn(styles.image, isUploading && styles.imageUploading)}
                draggable={false}
            />

            {index === 0 && !isUploading && (
                <div className={styles.mainTag}>대표</div>
            )}

            {isUploading ? (
                <div className={styles.uploadingOverlay}>
                    <div className={styles.spinner} />
                </div>
            ) : null}

            <IconButton
                icon={Trash2}
                size="sm"
                className={styles.removeButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
            />
        </div>
    );
});

export default React.memo(function GallerySectionContent() {
    const {
        gallery,
        setGallery,
        galleryTitle,
        setGalleryTitle,
        gallerySubtitle,
        setGallerySubtitle,
        galleryType,
        setGalleryType,
        galleryPopup,
        setGalleryPopup,
        galleryFade,
        setGalleryFade,
        galleryAutoplay,
        setGalleryAutoplay,
        accentColor,
    } = useInvitationStore(useShallow((state) => ({
        gallery: state.gallery,
        setGallery: state.setGallery,
        galleryTitle: state.galleryTitle,
        setGalleryTitle: state.setGalleryTitle,
        gallerySubtitle: state.gallerySubtitle,
        setGallerySubtitle: state.setGallerySubtitle,
        galleryType: state.galleryType,
        setGalleryType: state.setGalleryType,
        galleryPopup: state.galleryPopup,
        setGalleryPopup: state.setGalleryPopup,
        galleryFade: state.galleryFade,
        setGalleryFade: state.setGalleryFade,
        galleryAutoplay: state.galleryAutoplay,
        setGalleryAutoplay: state.setGalleryAutoplay,
        accentColor: state.theme.accentColor,
    })));

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleUploadClick = () => {
        if (gallery.length >= 10) {
            setIsLimitModalOpen(true);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesToUpload = Array.from(e.target.files || []);
        if (filesToUpload.length === 0) return;

        const MAX_TOTAL = 10;
        const currentCount = gallery.length;

        if (currentCount >= MAX_TOTAL) {
            setIsLimitModalOpen(true);
            return;
        }

        const remainingCount = MAX_TOTAL - currentCount;

        if (filesToUpload.length > remainingCount) {
            setIsLimitModalOpen(true);
        }

        const slicedFiles = filesToUpload.slice(0, remainingCount);

        const tempItems = slicedFiles.map(file => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: URL.createObjectURL(file),
            file
        }));

        setGallery([...gallery, ...tempItems.map(({ id, url }) => ({ id, url }))]);
        e.target.value = '';

        try {
            // Dynamic import for code splitting - upload module loaded only when needed
            const { uploadImage } = await import('@/utils/upload');

            // Upload images in parallel for better performance
            await Promise.all(tempItems.map(async (item) => {
                try {
                    const publicUrl = await uploadImage(item.file, 'images', 'gallery');
                    setGallery((prev: { id: string; url: string }[]) =>
                        prev.map(g => g.id === item.id ? { ...g, url: publicUrl } : g)
                    );
                    URL.revokeObjectURL(item.url);
                } catch (error) {
                    console.error('Upload failed', error);
                    setGallery((prev: { id: string; url: string }[]) =>
                        prev.filter(g => g.id !== item.id)
                    );
                }
            }));
        } catch (error) {
            console.error('Failed to import upload module', error);
        }
    };

    const handleRemove = useCallback((id: string) => {
        setGallery((prev: { id: string; url: string }[]) => prev.filter(item => item.id !== id));
    }, [setGallery]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setGallery((prev: { id: string; url: string }[]) => {
                const oldIndex = prev.findIndex(item => item.id === active.id);
                const newIndex = prev.findIndex(item => item.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return prev;
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    }, [setGallery]);

    const activeImage = useMemo(() =>
        gallery.find(item => item.id === activeId),
        [gallery, activeId]
    );

    return (
        <SectionContainer>
            <TextField
                label="소제목"
                type="text"
                value={gallerySubtitle}
                onChange={(e) => setGallerySubtitle(e.target.value)}
                placeholder="예: GALLERY"
            />
            <TextField
                label="제목"
                type="text"
                value={galleryTitle}
                onChange={(e) => setGalleryTitle(e.target.value)}
                placeholder="예: 웨딩 갤러리"
            />

            <Field
                label={
                    <div className={styles.counter}>
                        <span className={styles.labelText}>사진 관리</span>
                        <span className={styles.countText}>
                            <span style={{ color: accentColor }}>{gallery.length}</span>
                            <span className={styles.countTotal}> / 10</span>
                        </span>
                    </div>
                }
            >
                <div className={styles.galleryManager}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={gallery.map(g => g.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className={styles.grid}>
                                {gallery.map((item, index) => (
                                    <SortableItem
                                        key={item.id}
                                        id={item.id}
                                        index={index}
                                        url={item.url}
                                        onRemove={handleRemove}
                                    />
                                ))}
                                {gallery.length < 10 && (
                                    <div className={styles.uploadItem} onClick={handleUploadClick}>
                                        <Plus className={styles.uploadIcon} />
                                        <span className={styles.uploadText}>추가</span>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            multiple
                                            accept="image/*"
                                            className={styles.hiddenInput}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </SortableContext>

                        <ResponsiveModal
                            open={isLimitModalOpen}
                            onOpenChange={setIsLimitModalOpen}
                            title="알림"
                            description="사진은 최대 10장까지 등록 가능합니다."
                            onConfirm={() => setIsLimitModalOpen(false)}
                            confirmText="확인"
                            showCancel={false}
                        />

                        <DragOverlay dropAnimation={{
                            sideEffects: defaultDropAnimationSideEffects({
                                styles: {
                                    active: { opacity: '0.4' }
                                }
                            })
                        }}>
                            {activeId && activeImage ? (
                                <div className={styles.dragOverlayItem}>
                                    <Image
                                        src={activeImage.url}
                                        alt=""
                                        fill
                                        unoptimized
                                        className={styles.image}
                                    />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    <InfoMessage>
                        사진을 길게 눌러 순서를 변경할 수 있습니다. (첫 번째 사진이 대표 사진)
                    </InfoMessage>
                </div>
            </Field>

            <Field label="전시 형태">
                <Tabs
                    value={galleryType}
                    onValueChange={(val: string) => {
                        const nextType = val === 'grid' ? 'grid' : val === 'thumbnail' ? 'thumbnail' : 'swiper';
                        setGalleryType(nextType);
                    }}
                >
                    <TabsList fluid>
                        <TabsTrigger value="swiper">스와이퍼</TabsTrigger>
                        <TabsTrigger value="grid">그리드</TabsTrigger>
                        <TabsTrigger value="thumbnail">리스트</TabsTrigger>
                    </TabsList>
                </Tabs>
            </Field>

            <Field label="기능 설정">
                <div className={styles.optionGroup}>
                    <SwitchField
                        checked={galleryPopup}
                        onChange={setGalleryPopup}
                        label="확대 보기 (팝업)"
                    />
                    {galleryType === 'swiper' ? (
                        <>
                            <SwitchField
                                checked={galleryAutoplay}
                                onChange={setGalleryAutoplay}
                                label="자동 재생"
                            />
                            <SwitchField
                                checked={galleryFade}
                                onChange={setGalleryFade}
                                label="페이드 효과"
                            />
                        </>
                    ) : null}
                </div>
            </Field>
        </SectionContainer>
    );
});
