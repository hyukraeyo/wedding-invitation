'use client';

import React from 'react';
import Image from 'next/image';
import { Banana, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';
import { AspectRatio } from '@/components/ui/AspectRatio';
import { isBlobUrl } from '@/lib/image';
import { IMAGE_SIZES } from '@/constants/image';
import styles from './ImagePreview.module.scss';

export interface ImagePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  ratio?: number;
  isUploading?: boolean;
  onRemove?: () => void;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
  isDragging?: boolean;
  unoptimized?: boolean;
}

export const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(
  (
    {
      src,
      alt = 'Uploaded image',
      ratio = 1,
      isUploading = false,
      onRemove,
      className,
      imageClassName,
      children,
      isDragging,
      unoptimized,
      ...props
    },
    ref
  ) => {
    const shouldUnoptimize = unoptimized ?? isBlobUrl(src);

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, isDragging && styles.dragging, className)}
        {...props}
      >
        <AspectRatio ratio={ratio}>
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(styles.image, isUploading && styles.uploading, imageClassName)}
            sizes={IMAGE_SIZES.builder}
            unoptimized={shouldUnoptimize}
            draggable={false}
          />

          {children}

          {isUploading ? (
            <div className={styles.overlay}>
              <Banana className={styles.spinner} />
            </div>
          ) : null}

          {onRemove && !isUploading ? (
            <IconButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              variant="ghost"
              className={styles.removeButton}
              name="remove-image"
              aria-label="이미지 삭제"
            >
              <Trash2 />
            </IconButton>
          ) : null}
        </AspectRatio>
      </div>
    );
  }
);

ImagePreview.displayName = 'ImagePreview';
