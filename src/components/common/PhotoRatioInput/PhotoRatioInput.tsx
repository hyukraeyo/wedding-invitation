import * as React from 'react';
import { CloudUpload } from 'lucide-react';
import Image from 'next/image';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { IconButton } from '@/components/ui/IconButton';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';
import { cn } from '@/lib/utils';
import s from './PhotoRatioInput.module.scss';

export interface PhotoRatioInputProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange' | 'placeholder'
> {
  image: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ratio: string;
  onRatioChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
}

export const PhotoRatioInput = React.forwardRef<HTMLDivElement, PhotoRatioInputProps>(
  (
    {
      image,
      onUpload,
      ratio,
      onRatioChange,
      className,
      placeholder = '사진 추가',
      helperText = '클릭하여 이미지를 선택하세요',
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
      inputRef.current?.click();
    };

    return (
      <div ref={ref} className={cn(s.container, className)} {...props}>
        <IconButton
          variant="unstyled"
          className={s.uploader}
          onClick={handleClick}
          aria-label={image ? '업로드된 사진 변경하기' : '사진 업로드하기'}
          name=""
        >
          {image ? (
            <div className={s.preview}>
              <Image
                src={image}
                alt="업로드된 사진 미리보기"
                fill
                sizes={IMAGE_SIZES.builder}
                className={s.previewImage}
                unoptimized={isBlobUrl(image)}
              />
            </div>
          ) : (
            <>
              <div className={s.iconCircle}>
                <CloudUpload size={24} />
              </div>
              <div className={s.uploadText}>{placeholder}</div>
              <div className={s.uploadSubtext}>{helperText}</div>
            </>
          )}
        </IconButton>
        <input
          type="file"
          ref={inputRef}
          onChange={onUpload}
          accept="image/*"
          className={s.fileInput}
        />
        <SegmentedControl value={ratio} onChange={onRatioChange} alignment="fluid">
          <SegmentedControl.Item value="fixed">고정 (기본)</SegmentedControl.Item>
          <SegmentedControl.Item value="original">원본 비율</SegmentedControl.Item>
        </SegmentedControl>
      </div>
    );
  }
);
PhotoRatioInput.displayName = 'PhotoRatioInput';
