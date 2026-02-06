'use client';

import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, UploadCloud, Banana, Plus } from 'lucide-react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';
import { isBlobUrl } from '@/lib/image';
import { IMAGE_SIZES } from '@/constants/image';
import { AspectRatio } from '@/components/ui/AspectRatio';
import styles from './ImageUploader.module.scss';

export interface ImageUploaderProps {
  /** 단일 모드: 현재 이미지 URL */
  value?: string | null;
  /** 단일 모드: 변경 핸들러 */
  onChange?: (value: string | null) => void;
  /** 멀티 모드: 업로드 완료 핸들러 */
  onUploadComplete?: (urls: string[]) => void;
  /** 멀티 모드 여부 */
  multiple?: boolean;
  /** 최대 파일 개수 (멀티 모드) */
  maxCount?: number;
  /** 현재 파일 개수 (멀티 모드 체크용) */
  currentCount?: number;

  /** 레이블 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 설명 */
  description?: string;
  /** 커스텀 클래스 */
  className?: string;
  /** 고정 비율 (예: '1/1', '16/9') */
  aspectRatio?: string;
  /** UI 타입 */
  variant?: 'default' | 'compact';

  /** 비율 선택 정보 (메인 사진 등에서 사용) */
  ratio?: string;
  onRatioChange?: (value: string) => void;
  ratioOptions?: { label: string; value: string }[];

  /** 업로드 폴더 (S3/스토리지 경로) */
  uploadFolder?: string;
  /** 삭제 버튼 허용 여부 */
  allowDelete?: boolean;
  /** id */
  id?: string;
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
      variant = 'default',
      uploadFolder = 'uploads',
      allowDelete = true,
      ratio,
      onRatioChange,
      ratioOptions,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const accentColor = useInvitationStore((state) => state.theme.accentColor);
    const setIsGlobalUploading = useInvitationStore((state) => state.setIsUploading);
    const { toast } = useToast();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // 단일 모드일 때 외부 value 동기화
    useEffect(() => {
      if (!multiple && !isUploading) {
        setPreviewUrl(value || null);
      }
    }, [value, isUploading, multiple]);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const fileList = Array.from(files);

      // 개수 제한 체크
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
          // 멀티 업로드 루프
          const uploadPromises = fileList.map(async (file) => {
            try {
              return await uploadImage(file, 'images', uploadFolder);
            } catch (err) {
              console.error('File upload failed:', file.name, err);
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
          // 단일 업로드
          const file = fileList[0];
          if (!file) return;
          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
          onChange?.(objectUrl); // 낙관적 업데이트

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

    const handleRemove = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setPreviewUrl(null);
      onChange?.(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const displayUrl = previewUrl || value;
    const shouldUnoptimize = isBlobUrl(displayUrl || '');
    const isAutoRatio = ratio === 'auto';

    const cssVars = {
      '--accent-color': accentColor,
    } as React.CSSProperties;

    // 렌더링 영역
    return (
      <div className={cn(styles.container, className)} style={cssVars}>
        {label && <div className={styles.label}>{label}</div>}

        <div
          className={cn(
            styles.uploadBox,
            styles[variant],
            !displayUrl && styles.empty,
            displayUrl && styles.filled
          )}
          onClick={() => inputRef.current?.click()}
          style={
            variant === 'default' && !isAutoRatio
              ? { aspectRatio: aspectRatio.replace('/', ' / ') }
              : {}
          }
        >
          {displayUrl && variant === 'default' ? (
            <div
              className={cn(
                styles.previewWrapper,
                isAutoRatio ? styles.minHeight : styles.absoluteFull
              )}
            >
              {!isAutoRatio ? (
                (() => {
                  const ratioParts = (aspectRatio || '16/9').split('/');
                  const w = Number(ratioParts[0]) || 16;
                  const h = Number(ratioParts[1]) || 9;
                  const r = w / h;
                  return (
                    <AspectRatio ratio={r} style={{ width: '100%' }}>
                      <Image
                        src={displayUrl}
                        alt="Uploaded"
                        fill
                        className={cn(styles.image, isUploading && styles.uploading)}
                        sizes={IMAGE_SIZES.builder}
                        priority
                        unoptimized={shouldUnoptimize}
                      />
                    </AspectRatio>
                  );
                })()
              ) : (
                <Image
                  src={displayUrl}
                  alt="Uploaded"
                  width={0}
                  height={0}
                  className={cn(styles.image, isUploading && styles.uploading)}
                  sizes={IMAGE_SIZES.builder}
                  priority
                  unoptimized={shouldUnoptimize}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}

              {isUploading && (
                <div className={styles.overlay}>
                  <Banana className={styles.spinner} />
                </div>
              )}

              {allowDelete && !isUploading && (
                <IconButton
                  type="button"
                  onClick={handleRemove}
                  variant="ghost"
                  className={styles.removeButton}
                  name=""
                  aria-label="삭제"
                >
                  <Trash2 size={20} />
                </IconButton>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.iconCircle}>
                {variant === 'compact' ? <Plus size={24} /> : <UploadCloud size={24} />}
              </div>
              <p className={styles.emptyTitle}>{placeholder}</p>
              {!multiple && variant === 'default' && (
                <p className={styles.emptyDesc}>클릭하여 이미지를 선택하세요</p>
              )}
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

        {description && <p className={styles.emptyDesc}>{description}</p>}

        {variant === 'default' && ratio && onRatioChange && (
          <div className={styles.ratioControl}>
            <SegmentedControl
              alignment="fluid"
              value={ratio}
              onChange={(val: string) => onRatioChange?.(val)}
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
        )}
      </div>
    );
  }
);

ImageUploader.displayName = 'ImageUploader';
