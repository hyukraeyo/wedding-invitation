'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { AspectRatio } from '@/components/ui/AspectRatio';
import { IMAGE_SIZES } from '@/constants/image';
import type { GalleryItem } from './types';
import styles from '../GalleryView.module.scss';

interface GridGalleryProps {
  gallery: GalleryItem[];
  galleryPopup: boolean;
  onImageClick: (index: number) => void;
  blockDrawerGestureStart: (e: React.PointerEvent) => void;
  releaseVaulPointerCapture: (e: React.PointerEvent) => void;
}

const GridGallery = memo(function GridGallery({
  gallery,
  galleryPopup,
  onImageClick,
  blockDrawerGestureStart,
  releaseVaulPointerCapture,
}: GridGalleryProps) {
  return (
    <div
      className={styles.gridContainer}
      data-vaul-no-drag
      data-preview-gesture-bypass
      onPointerDown={blockDrawerGestureStart}
      onGotPointerCapture={releaseVaulPointerCapture}
    >
      {gallery.map((img, i) => (
        <div
          key={img.id}
          className={clsx(styles.gridItem, galleryPopup && styles.cursorPointer)}
          onClick={() => onImageClick(i)}
        >
          <AspectRatio ratio={1 / 1}>
            <Image
              src={img.url}
              alt=""
              fill
              priority={i === 0}
              loading={i < 6 ? 'eager' : 'lazy'}
              sizes={IMAGE_SIZES.galleryGrid}
              quality={85}
            />
          </AspectRatio>
        </div>
      ))}
    </div>
  );
});

export { GridGallery };
