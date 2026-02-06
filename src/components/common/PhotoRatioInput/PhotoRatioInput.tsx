import * as React from 'react';
import { CloudUpload } from 'lucide-react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
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
        <div className={s.uploader} onClick={handleClick}>
          {image ? (
            <div className={s.preview}>
              <img src={image} alt="Uploaded" />
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
          <input
            type="file"
            ref={inputRef}
            onChange={onUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <SegmentedControl value={ratio} onChange={onRatioChange} alignment="fluid">
          <SegmentedControl.Item value="fixed">고정 (기본)</SegmentedControl.Item>
          <SegmentedControl.Item value="original">원본 비율</SegmentedControl.Item>
        </SegmentedControl>
      </div>
    );
  }
);
PhotoRatioInput.displayName = 'PhotoRatioInput';
