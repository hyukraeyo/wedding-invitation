'use client';

import React, { useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { SortablePhoto } from '@/components/common/SortablePhoto';
import s from './PhotoGallery.module.scss';

export interface PhotoGalleryProps {
  images: string[];
  maxCount?: number;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  helperText?: React.ReactNode;
}

export function PhotoGallery({
  images,
  maxCount = 10,
  onUpload,
  onRemove,
  onDragEnd,
  helperText,
}: PhotoGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = images.length >= maxCount;

  return (
    <Field.Root>
      <div className={s.photoGrid}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            {images.map((photo, index) => (
              <SortablePhoto key={photo} id={photo} url={photo} onRemove={() => onRemove(index)} />
            ))}
          </SortableContext>
        </DndContext>

        {!isFull && (
          <Button
            unstyled
            className={s.addPhotoButton}
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            <Plus size={24} />
            <span>추가</span>
          </Button>
        )}
        <input
          type="file"
          ref={inputRef}
          onChange={onUpload}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
      </div>
      {helperText && (
        <Field.Footer>
          <Field.HelperText>{helperText}</Field.HelperText>
        </Field.Footer>
      )}
    </Field.Root>
  );
}
