import React, { useMemo, useCallback, useState } from 'react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/AspectRatio';
import { Trash2, Banana } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { FormControl, FormField, FormLabel, FormHeader } from '@/components/ui/Form';
import { Field } from '@/components/ui/Field';
import { Switch } from '@/components/ui/Switch';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
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
import { ImageUploader } from '@/components/common/ImageUploader';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import styles from './GallerySection.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface SortableItemProps {
  id: string;
  url: string;
  index: number;
  onRemove: (id: string) => void;
  isDragging?: boolean;
}

const SortableItem = React.memo(function SortableItem({
  id,
  url,
  index,
  onRemove,
  isDragging,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const isUploading = isBlobUrl(url);

  return (
    <AspectRatio
      ref={setNodeRef}
      ratio={1 / 1}
      style={style}
      className={cn(styles.sortableItem, isDragging && styles.dragging)}
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

      {index === 0 && !isUploading && <div className={styles.mainTag}>대표</div>}

      {isUploading ? (
        <div className={styles.uploadingOverlay}>
          <Banana className={styles.spinner} size={20} />
        </div>
      ) : null}

      <IconButton
        iconSize={20}
        className={styles.removeButton}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        variant="ghost"
        name=""
        aria-label="삭제"
      >
        <Trash2 size={20} />
      </IconButton>
    </AspectRatio>
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
  } = useInvitationStore(
    useShallow((state) => ({
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
    }))
  );

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

  const handleUploadComplete = (urls: string[]) => {
    const newItems = urls.map((url) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
    }));
    setGallery([...gallery, ...newItems]);
  };

  const handleRemove = useCallback(
    (id: string) => {
      setGallery((prev: { id: string; url: string }[]) => prev.filter((item) => item.id !== id));
    },
    [setGallery]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setGallery((prev: { id: string; url: string }[]) => {
          const oldIndex = prev.findIndex((item) => item.id === active.id);
          const newIndex = prev.findIndex((item) => item.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
      setActiveId(null);
    },
    [setGallery]
  );

  const activeImage = useMemo(
    () => gallery.find((item) => item.id === activeId),
    [gallery, activeId]
  );

  return (
    <div className={styles.container}>
      <FormField name="gallery-subtitle">
        <FormHeader>
          <FormLabel htmlFor="gallery-subtitle">소제목</FormLabel>
        </FormHeader>
        <FormControl asChild>
          <TextField
            id="gallery-subtitle"
            type="text"
            value={gallerySubtitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGallerySubtitle(e.target.value)
            }
            placeholder="예: GALLERY"
          />
        </FormControl>
      </FormField>
      <FormField name="gallery-title">
        <FormHeader>
          <FormLabel htmlFor="gallery-title">제목</FormLabel>
        </FormHeader>
        <FormControl asChild>
          <TextField
            id="gallery-title"
            type="text"
            value={galleryTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGalleryTitle(e.target.value)}
            placeholder="예: 웨딩 갤러리"
          />
        </FormControl>
      </FormField>

      <FormField name="gallery">
        <FormHeader>
          <FormLabel>사진 관리</FormLabel>
          <div className={styles.counter}>
            <span className={styles.countText}>
              <strong style={{ color: accentColor }}>{gallery.length}</strong>
              <span className={styles.countTotal}> / 10</span>
            </span>
          </div>
        </FormHeader>

        <div className={styles.galleryManager}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={gallery.map((g) => g.id)} strategy={rectSortingStrategy}>
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
                  <ImageUploader
                    multiple
                    variant="compact"
                    placeholder="추가"
                    currentCount={gallery.length}
                    maxCount={10}
                    onUploadComplete={handleUploadComplete}
                    uploadFolder="gallery"
                  />
                )}
              </div>
            </SortableContext>

            <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
              <Dialog.Header title="알림" />
              <Dialog.Body className={styles.centerBody}>
                <p style={{ fontSize: '1rem', color: '#666' }}>
                  사진은 최대 10장까지 등록 가능해요.
                </p>
              </Dialog.Body>
              <Dialog.Footer className={styles.paddedFooter}>
                <Button
                  type="button"
                  color="primary"
                  size="lg"
                  style={{ width: '100%' }}
                  onClick={() => setIsLimitModalOpen(false)}
                >
                  확인
                </Button>
              </Dialog.Footer>
            </Dialog>

            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: {
                    active: { opacity: '0.4' },
                  },
                }),
              }}
            >
              {activeId && activeImage ? (
                <AspectRatio ratio={1 / 1} className={styles.dragOverlayItem}>
                  <Image src={activeImage.url} alt="" fill unoptimized className={styles.image} />
                </AspectRatio>
              ) : null}
            </DragOverlay>
          </DndContext>

          <Field.Footer>
            <Field.HelperText>
              사진을 길게 눌러 순서를 변경할 수 있어요. (첫 번째 사진이 대표 사진이에요)
            </Field.HelperText>
          </Field.Footer>
        </div>
      </FormField>

      <FormField name="gallery-type">
        <FormHeader>
          <FormLabel>전시 형태</FormLabel>
        </FormHeader>
        <FormControl asChild>
          <SegmentedControl
            alignment="fluid"
            value={galleryType}
            onChange={(val: string) => setGalleryType(val as 'swiper' | 'grid' | 'thumbnail')}
          >
            <SegmentedControl.Item value="swiper">스와이퍼</SegmentedControl.Item>
            <SegmentedControl.Item value="grid">그리드</SegmentedControl.Item>
            <SegmentedControl.Item value="thumbnail">리스트</SegmentedControl.Item>
          </SegmentedControl>
        </FormControl>
      </FormField>

      <FormField name="gallery-popup" className={styles.toggleRow}>
        <FormLabel>확대 보기 (팝업)</FormLabel>
        <FormControl asChild>
          <Switch checked={galleryPopup} onCheckedChange={(checked) => setGalleryPopup(checked)} />
        </FormControl>
      </FormField>

      {galleryType === 'swiper' ? (
        <>
          <FormField name="gallery-autoplay" className={styles.toggleRow}>
            <FormLabel>자동 재생</FormLabel>
            <FormControl asChild>
              <Switch
                checked={galleryAutoplay}
                onCheckedChange={(checked) => setGalleryAutoplay(checked)}
              />
            </FormControl>
          </FormField>
          <FormField name="gallery-fade" className={styles.toggleRow}>
            <FormLabel>페이드 효과</FormLabel>
            <FormControl asChild>
              <Switch
                checked={galleryFade}
                onCheckedChange={(checked) => setGalleryFade(checked)}
              />
            </FormControl>
          </FormField>
        </>
      ) : null}
    </div>
  );
});
