import React, { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useShallow } from 'zustand/react/shallow';
import { ImageUploader } from '@/components/common/ImageUploader';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SwitchRow } from '@/components/common/SwitchRow';
import { TextField } from '@/components/ui/TextField';
import { Text } from '@/components/ui/Text';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { isRequiredField } from '@/constants/requiredFields';
import { isBlobUrl } from '@/lib/image';
import { cn } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './GallerySection.module.scss';

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
  const isUploading = isBlobUrl(url);

  return (
    <ImagePreview
      ref={setNodeRef}
      src={url}
      ratio={1}
      isUploading={isUploading}
      onRemove={() => onRemove(id)}
      isDragging={Boolean(isDragging)}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(styles.sortableItem, isDragging && styles.dragging)}
      {...attributes}
      {...listeners}
    >
      {index === 0 && !isUploading ? <div className={styles.mainTag}>대표</div> : null}
    </ImagePreview>
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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleUploadComplete = (urls: string[]) => {
    const newItems = urls.map((url) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
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
      if (!over || active.id === over.id) {
        setActiveId(null);
        return;
      }

      setGallery((prev: { id: string; url: string }[]) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
      setActiveId(null);
    },
    [setGallery]
  );

  const activeImage = useMemo(
    () => gallery.find((item) => item.id === activeId),
    [gallery, activeId]
  );

  return (
    <div>
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
          <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
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
            <SortableContext items={gallery.map((item) => item.id)} strategy={rectSortingStrategy}>
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
                {gallery.length < 10 ? (
                  <ImageUploader
                    multiple
                    gallery
                    placeholder="추가"
                    currentCount={gallery.length}
                    maxCount={10}
                    onUploadComplete={handleUploadComplete}
                    uploadFolder="gallery"
                  />
                ) : null}
              </div>
            </SortableContext>

            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: '0.4' } },
                }),
              }}
            >
              {activeId && activeImage ? (
                <ImagePreview
                  src={activeImage.url}
                  ratio={1}
                  className={styles.dragOverlayItem ?? ''}
                  unoptimized
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
            <Dialog.Header title="알림" />
            <Dialog.Body className={styles.centerBody}>
              <Text color="secondary">사진은 최대 10장까지 등록 가능해요.</Text>
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

          <Field.Footer>
            <Field.HelperText>
              사진을 길게 눌러 순서를 변경할 수 있어요. (첫 번째 사진이 대표 사진이에요)
            </Field.HelperText>
          </Field.Footer>
          <FormControl asChild>
            <VisuallyHidden asChild>
              <input
                id="gallery-images-required"
                aria-label="갤러리 이미지"
                required={isRequiredField('galleryImages')}
                readOnly
                value={gallery.length > 0 ? 'has-images' : ''}
              />
            </VisuallyHidden>
          </FormControl>
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
            onChange={(value: string) => setGalleryType(value as 'swiper' | 'grid' | 'thumbnail')}
          >
            <SegmentedControl.Item value="swiper">스와이퍼</SegmentedControl.Item>
            <SegmentedControl.Item value="grid">그리드</SegmentedControl.Item>
            <SegmentedControl.Item value="thumbnail">리스트</SegmentedControl.Item>
          </SegmentedControl>
        </FormControl>
      </FormField>

      <FormField name="gallery-popup">
        <SwitchRow
          label="확대 보기 (팝업)"
          checked={galleryPopup}
          onCheckedChange={setGalleryPopup}
        />
      </FormField>

      {galleryType === 'swiper' ? (
        <>
          <FormField name="gallery-autoplay">
            <SwitchRow
              label="자동 재생"
              checked={galleryAutoplay}
              onCheckedChange={setGalleryAutoplay}
            />
          </FormField>
          <FormField name="gallery-fade">
            <SwitchRow label="페이드 효과" checked={galleryFade} onCheckedChange={setGalleryFade} />
          </FormField>
        </>
      ) : null}
    </div>
  );
});
