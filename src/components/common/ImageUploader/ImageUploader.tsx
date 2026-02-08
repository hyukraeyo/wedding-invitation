'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Plus, UploadCloud } from 'lucide-react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { isBlobUrl } from '@/lib/image';
import { ImagePreview } from '@/components/ui/ImagePreview';
import styles from './ImageUploader.module.scss';

export interface ImageUploaderProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  onUploadComplete?: (urls: string[]) => void;
  multiple?: boolean;
  maxCount?: number;
  currentCount?: number;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  aspectRatio?: string;
  ratio?: string;
  onRatioChange?: (value: string) => void;
  ratioOptions?: { label: string; value: string }[];
  uploadFolder?: string;
  allowDelete?: boolean;
  gallery?: boolean;
  id?: string;
  invalid?: boolean;
}

export const ImageUploader = React.forwardRef<HTMLInputElement, ImageUploaderProps>(
  (
    {
      value,
      onChange,
      onUploadComplete,
      multiple = false,
      maxCount = 10,
      currentCount = 0,
      label,
      placeholder = '사진을 추가해주세요',
      description,
      className,
      aspectRatio = '16/9',
      ratio,
      onRatioChange,
      ratioOptions,
      uploadFolder = 'uploads',
      allowDelete = true,
      gallery = false,
      invalid: invalidProp,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const accentColor = useInvitationStore((state) => state.theme.accentColor);
    const setIsGlobalUploading = useInvitationStore((state) => state.setIsUploading);
    const validationErrors = useInvitationStore((state) => state.validationErrors);
    const { toast } = useToast();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
      if (!multiple && !isUploading) {
        setPreviewUrl(value || null);
      }
    }, [value, isUploading, multiple]);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const fileList = Array.from(files);

      if (multiple && currentCount + fileList.length > maxCount) {
        toast({
          variant: 'destructive',
          title: '업로드 제한',
          description: `최대 ${maxCount}장까지 등록 가능해요.`,
        });
        return;
      }

      setIsUploading(true);
      setIsGlobalUploading(true);

      try {
        const { uploadImage } = await import('@/utils/upload');

        if (multiple) {
          const uploadPromises = fileList.map(async (file) => {
            try {
              return await uploadImage(file, 'images', uploadFolder);
            } catch (error) {
              console.error('File upload failed:', file.name, error);
              return null;
            }
          });

          const uploadedUrls = (await Promise.all(uploadPromises)).filter(
            (url): url is string => url !== null
          );

          if (uploadedUrls.length > 0) {
            onUploadComplete?.(uploadedUrls);
          }
        } else {
          const file = fileList[0];
          if (!file) return;

          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
          onChange?.(objectUrl);

          try {
            const publicUrl = await uploadImage(file, 'images', uploadFolder);
            setPreviewUrl(publicUrl);
            onChange?.(publicUrl);
          } catch (error) {
            setPreviewUrl(value || null);
            onChange?.(value || null);
            throw error;
          } finally {
            URL.revokeObjectURL(objectUrl);
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          variant: 'destructive',
          title: '업로드 실패',
          description: '이미지 업로드에 실패했어요. 다시 시도해주세요.',
        });
      } finally {
        setIsUploading(false);
        setIsGlobalUploading(false);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    };

    const handleRemove = () => {
      setPreviewUrl(null);
      onChange?.(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const displayUrl = previewUrl || value;
    const shouldUnoptimize = isBlobUrl(displayUrl || '');
    const ratioParts = (aspectRatio || '16/9').split('/');
    const width = Number(ratioParts[0]) || 16;
    const height = Number(ratioParts[1]) || 9;
    const imageRatio = width / height;

    const cssVars = {
      '--accent-color': accentColor,
    } as React.CSSProperties;

    const showGalleryAddButton = gallery && !displayUrl;

    return (
      <div className={cn(styles.container, className)} style={cssVars}>
        {label ? <div className={styles.label}>{label}</div> : null}

        <div
          className={cn(
            styles.uploadBox,
            gallery && styles.compact,
            !displayUrl && styles.empty,
            displayUrl && styles.filled,
            (invalidProp || (props.id && validationErrors.includes(props.id))) && styles.invalid
          )}
          onClick={() => inputRef.current?.click()}
          style={!gallery ? { aspectRatio: aspectRatio.replace('/', ' / ') } : undefined}
        >
          {displayUrl && !gallery ? (
            <ImagePreview
              src={displayUrl}
              ratio={imageRatio}
              isUploading={isUploading}
              unoptimized={shouldUnoptimize}
              className={styles.absoluteFull ?? ''}
              {...(allowDelete ? { onRemove: handleRemove } : {})}
            />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.iconCircle}>
                {showGalleryAddButton ? <Plus size={24} /> : <UploadCloud size={24} />}
              </div>
              <p className={styles.emptyTitle}>{placeholder}</p>
              {!multiple && !gallery ? (
                <p className={styles.emptyDesc}>클릭하여 이미지를 선택하세요</p>
              ) : null}
            </div>
          )}

          <input
            ref={inputRef}
            id={props.id}
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={handleUpload}
            className={styles.hiddenInput}
            disabled={isUploading}
          />
        </div>

        {description ? <p className={styles.emptyDesc}>{description}</p> : null}

        {!gallery && ratio && onRatioChange ? (
          <div className={styles.ratioControl}>
            <SegmentedControl
              alignment="fluid"
              value={ratio}
              onChange={(val: string) => onRatioChange(val)}
            >
              {ratioOptions ? (
                ratioOptions.map((option) => (
                  <SegmentedControl.Item key={option.value} value={option.value}>
                    {option.label}
                  </SegmentedControl.Item>
                ))
              ) : (
                <>
                  <SegmentedControl.Item value="fixed">고정 (기본)</SegmentedControl.Item>
                  <SegmentedControl.Item value="auto">원본 비율</SegmentedControl.Item>
                </>
              )}
            </SegmentedControl>
          </div>
        ) : null}
      </div>
    );
  }
);

ImageUploader.displayName = 'ImageUploader';
