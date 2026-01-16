import React, { useMemo, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { InfoMessage } from '@/components/builder/InfoMessage';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useToast } from '@/hooks/use-toast';
import { Field } from '../FormPrimitives';
import { SegmentedControl } from '../SegmentedControl';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SwitchField } from '../SwitchField';
import { cn } from '@/lib/utils';
import { isBlobUrl } from '@/lib/image';

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
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { IconButton } from '@/components/ui/icon-button';
import { CSS } from '@dnd-kit/utilities';
import styles from './GallerySection.module.scss';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

interface SortableItemProps {
    id: string;
    url: string;
    onRemove: (id: string) => void;
    isDragging?: boolean;
}

const SortableItem = React.memo(function SortableItem({ id, url, onRemove, isDragging }: SortableItemProps) {
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
        touchAction: 'none',
    };

    const isUploading = isBlobUrl(url);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                styles.sortableItem,
                isDragging && styles.dragging,
                isUploading && styles.uploading
            )}
        >
            <Image
                src={url}
                alt="Gallery"
                fill
                unoptimized
                className={cn(styles.image, isUploading && styles.imageUploading)}
            />

            {isUploading ? (
                <div className={styles.uploadingOverlay}>
                    <div className={styles.spinner} />
                </div>
            ) : null}

            <div className={styles.gradientOverlay} />

            <div className="absolute top-1 right-1 z-10">
                <IconButton
                    icon={Trash2}
                    size="sm"
                    className="w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full border-none p-0"
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
            </div>

            <div
                {...attributes}
                {...listeners}
                className={styles.dragHandle}
            />
        </div>
    );
});

const GallerySection = React.memo<SectionProps>(function GallerySection({ value, isOpen }) {
    const gallery = useInvitationStore(state => state.gallery);
    const setGallery = useInvitationStore(state => state.setGallery);
    const galleryTitle = useInvitationStore(state => state.galleryTitle);
    const setGalleryTitle = useInvitationStore(state => state.setGalleryTitle);
    const gallerySubtitle = useInvitationStore(state => state.gallerySubtitle);
    const setGallerySubtitle = useInvitationStore(state => state.setGallerySubtitle);
    const galleryType = useInvitationStore(state => state.galleryType);
    const setGalleryType = useInvitationStore(state => state.setGalleryType);
    const galleryPopup = useInvitationStore(state => state.galleryPopup);
    const setGalleryPopup = useInvitationStore(state => state.setGalleryPopup);
    const galleryPreview = useInvitationStore(state => state.galleryPreview);
    const setGalleryPreview = useInvitationStore(state => state.setGalleryPreview);
    const galleryFade = useInvitationStore(state => state.galleryFade);
    const setGalleryFade = useInvitationStore(state => state.setGalleryFade);
    const galleryAutoplay = useInvitationStore(state => state.galleryAutoplay);
    const setGalleryAutoplay = useInvitationStore(state => state.setGalleryAutoplay);
    const accentColor = useInvitationStore(state => state.theme.accentColor);
    const { toast } = useToast();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

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

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesToUpload = Array.from(e.target.files || []);
        if (filesToUpload.length === 0) return;

        const MAX_TOTAL = 30;
        const currentCount = gallery.length;

        if (currentCount >= MAX_TOTAL) {
            toast({
                variant: 'destructive',
                description: `이미 ${MAX_TOTAL}장의 사진이 등록되어 있습니다.`,
            });
            return;
        }

        const remainingCount = MAX_TOTAL - currentCount;
        const slicedFiles = filesToUpload.slice(0, remainingCount);

        const tempItems = slicedFiles.map(file => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: URL.createObjectURL(file),
            file
        }));

        setGallery([...gallery, ...tempItems.map(({ id, url }) => ({ id, url }))]);
        e.target.value = '';

        try {
            const { uploadImage } = await import('@/utils/upload');

            for (const item of tempItems) {
                try {
                    const publicUrl = await uploadImage(item.file, 'images', 'gallery');
                    setGallery((prev: { id: string; url: string }[]) => prev.map(g => g.id === item.id ? { ...g, url: publicUrl } : g));
                    URL.revokeObjectURL(item.url);
                } catch (error) {
                    console.error('Upload failed', error);
                    setGallery((prev: { id: string; url: string }[]) => prev.filter(g => g.id !== item.id));
                }
            }
        } catch (error) {
            console.error('Failed to import upload module', error);
        }
    };

    const handleRemove = useCallback((id: string) => {
        setGallery(gallery.filter(item => item.id !== id));
    }, [gallery, setGallery]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = gallery.findIndex(item => item.id === active.id);
            const newIndex = gallery.findIndex(item => item.id === over.id);
            setGallery(arrayMove(gallery, oldIndex, newIndex));
        }
        setActiveId(null);
    }, [gallery, setGallery]);

    const activeImage = useMemo(() =>
        gallery.find(item => item.id === activeId),
        [gallery, activeId]
    );

    return (
        <AccordionItem
            value={value}
            title="웨딩 갤러리"
            icon={ImageIcon}
            isOpen={isOpen}
            isCompleted={gallery.length > 0}
        >
            <div className={styles.container}>
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
                            <span className="text-sm font-medium leading-none">사진 관리</span>
                            <span className={styles.countText}>
                                <span style={{ color: accentColor }}>{gallery.length}</span>
                                <span className={styles.countTotal}> / 30</span>
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
                                    {gallery.map((item) => (
                                        <SortableItem
                                            key={item.id}
                                            id={item.id}
                                            url={item.url}
                                            onRemove={handleRemove}
                                        />
                                    ))}
                                    {gallery.length < 30 ? (
                                        <div className={styles.uploadItem} onClick={handleUploadClick}>
                                            <Plus size={24} className={styles.uploadIcon} />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                multiple
                                                accept="image/*"
                                                className={styles.hiddenInput}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </SortableContext>

                            <DragOverlay dropAnimation={{
                                sideEffects: defaultDropAnimationSideEffects({
                                    styles: {
                                        active: { opacity: '0.4' }
                                    }
                                })
                            }}>
                                {activeId && activeImage ? (
                                    <div className={styles.overlay}>
                                        <Image
                                            src={activeImage.url}
                                            alt=""
                                            fill
                                            unoptimized
                                            className={styles.imageOverlay}
                                        />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>

                        <InfoMessage>
                            사진을 드래그하여 순서를 변경할 수 있습니다. 최대 30장까지 등록 가능합니다.
                        </InfoMessage>
                    </div>
                </Field>

                <Field label="전시 형태">
                    <SegmentedControl
                        value={galleryType}
                        options={[
                            { label: '스와이퍼', value: 'swiper' },
                            { label: '그리드', value: 'grid' },
                            { label: '리스트', value: 'thumbnail' },
                        ]}
                        onChange={(val) => setGalleryType(val as 'swiper' | 'grid' | 'thumbnail')}
                    />
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
                                <SwitchField
                                    checked={galleryPreview}
                                    onChange={setGalleryPreview}
                                    label="미리보기"
                                />
                            </>
                        ) : null}
                    </div>
                </Field>
            </div>
        </AccordionItem>
    );
});

export default GallerySection;
