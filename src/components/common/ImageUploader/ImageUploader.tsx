import React, { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Trash2, UploadCloud, Banana } from 'lucide-react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';
import { isBlobUrl } from '@/lib/image';
import { IMAGE_SIZES } from '@/constants/image';
import styles from './ImageUploader.module.scss';

interface ImageUploaderProps {
    value: string | null;
    onChange: (value: string | null) => void;
    label?: string | undefined;
    placeholder?: string | undefined;
    className?: string | undefined;
    aspectRatio?: '16/9' | '1/1' | '3/4' | '4/3' | '4/5' | undefined;
    ratio?: 'fixed' | 'auto' | undefined;
    onRatioChange?: ((value: 'fixed' | 'auto') => void) | undefined;
    uploadFolder?: string | undefined;
    allowDelete?: boolean;
    id?: string;
}

export function ImageUploader({ value, onChange, label, placeholder = '사진을 업로드해주세요', className, aspectRatio = '16/9', uploadFolder = 'uploads', allowDelete = true, ...props }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const accentColor = useInvitationStore(state => state.theme.accentColor);
    const { toast } = useToast();

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const setIsGlobalUploading = useInvitationStore(state => state.setIsUploading);

    // Sync previewUrl with value when value changes externally (and not currently uploading)
    React.useEffect(() => {
        if (!isUploading) {
            setPreviewUrl(value);
        }
    }, [value, isUploading]);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 1. Optimistic UI: Show Blob URL immediately
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setIsUploading(true);
            setIsGlobalUploading(true);

            // Immediate store update for Preview component
            onChange(objectUrl);

            try {
                // 2. Background Upload
                // Dynamically import to avoid server-side issues
                const { uploadImage } = await import('@/utils/upload');
                const publicUrl = await uploadImage(file, 'images', uploadFolder);

                // 3. Update Store with Real URL
                onChange(publicUrl);
            } catch (error) {
                console.error('Failed to upload image:', error);
                toast({
                    variant: "destructive",
                    title: "업로드 실패",
                    description: "이미지 업로드에 실패했습니다. 다시 시도해주세요."
                });
                // Revert to original value on failure
                setPreviewUrl(value);
                onChange(value);
            } finally {
                setIsUploading(false);
                setIsGlobalUploading(false);
                // Clean up Blob URL to avoid memory leaks
                URL.revokeObjectURL(objectUrl);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            }
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewUrl(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const cssVars = {
        '--accent-color': accentColor,
        '--aspect-ratio': aspectRatio.replace('/', ' / '),
    } as React.CSSProperties;

    // Use previewUrl for display if available (covers both existing value and optimistic update)
    const displayUrl = previewUrl || value;
    const shouldUnoptimize = isBlobUrl(displayUrl);
    const isAutoRatio = props.ratio === 'auto';

    return (
        <div className={styles.container}>
            <div className={cn(styles.wrapper, className)} style={cssVars}>
                {label ? <div className={styles.label}>{label}</div> : null}

                <div
                    className={cn(
                        styles.uploadBox,
                        !displayUrl && styles.empty,
                        displayUrl && styles.filled
                    )}
                    onClick={() => inputRef.current?.click()}
                    style={!isAutoRatio ? { aspectRatio: aspectRatio.replace('/', '/') } : {}}
                >
                    {displayUrl ? (
                        <div className={cn(styles.previewWrapper, isAutoRatio ? styles.minHeight : styles.absoluteFull)}>
                            {!isAutoRatio ? (
                                <div style={{ position: 'relative', width: '100%', aspectRatio: aspectRatio.replace('/', ' / ') }}>
                                    <Image
                                        src={displayUrl}
                                        alt="Uploaded"
                                        fill
                                        className={cn(
                                            styles.image,
                                            isUploading && styles.uploading
                                        )}
                                        sizes={IMAGE_SIZES.builder}
                                        priority
                                        loading="eager"
                                        unoptimized={shouldUnoptimize}
                                    />
                                </div>
                            ) : (
                                <Image
                                    src={displayUrl}
                                    alt="Uploaded"
                                    width={800}
                                    height={600}
                                    className={cn(
                                        styles.image,
                                        isUploading && styles.uploading
                                    )}
                                    sizes={IMAGE_SIZES.builder}
                                    priority
                                    loading="eager"
                                    unoptimized={shouldUnoptimize}
                                />
                            )}
                            {isUploading ? (
                                <div className={styles.overlay}>
                                    <Banana className={styles.spinner} />
                                </div>
                            ) : null}
                            {allowDelete && (
                                <IconButton
                                    type="button"
                                    onClick={handleRemove}
                                    variant="clear"
                                    iconSize={20}
                                    className={styles.removeButton}
                                    disabled={isUploading}
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
                                <UploadCloud size={24} className={styles.uploadIcon} />
                            </div>
                            <p className={styles.emptyTitle}>{placeholder}</p>
                            <p className={styles.emptyDesc}>클릭하여 이미지를 선택하세요</p>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        id={props.id}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className={styles.hiddenInput}
                    />
                </div>
            </div>

            {props.ratio && props.onRatioChange ? (
                <div className={styles.ratioControl}>
                    <SegmentedControl
                        alignment="fluid"
                        value={props.ratio}
                        onChange={(val: string) => props.onRatioChange?.(val as 'fixed' | 'auto')}
                    >
                        <SegmentedControl.Item value="fixed">
                            고정 (기본)
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="auto">
                            자동 (원본 비율)
                        </SegmentedControl.Item>
                    </SegmentedControl>
                </div>
            ) : null}
        </div>
    );
}
