import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import Image from 'next/image';
import s from './SortablePhoto.module.scss';
import { HTMLAttributes } from 'react';
import { Button } from '@/components/ui/Button';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';

interface SortablePhotoProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  url: string;
  onRemove: () => void;
}

export function SortablePhoto({ id, url, onRemove, style, ...props }: SortablePhotoProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const combinedStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
    ...style,
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      className={s.photoItem}
      {...attributes}
      {...listeners}
      {...props}
    >
      <Image
        src={url}
        alt="갤러리 이미지"
        fill
        sizes={IMAGE_SIZES.galleryGrid}
        className={s.photoImage}
        unoptimized={isBlobUrl(url)}
      />
      <Button
        unstyled
        type="button"
        className={s.deleteButton}
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on button click
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X size={14} />
      </Button>
    </div>
  );
}
