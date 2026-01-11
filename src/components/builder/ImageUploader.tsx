import React, { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Trash2, UploadCloud } from 'lucide-react';
import styles from './ImageUploader.module.scss';
import { clsx } from 'clsx';
import { BuilderLabel } from './BuilderLabel';
import { useInvitationStore } from '@/store/useInvitationStore';
import { BuilderButtonGroup } from './BuilderButtonGroup';

interface ImageUploaderProps {
    value: string | null;
    onChange: (value: string | null) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    aspectRatio?: '16/9' | '1/1' | '3/4' | '4/3';
    ratio?: 'fixed' | 'auto';
    onRatioChange?: (value: 'fixed' | 'auto') => void;
    uploadFolder?: string;
}

export function ImageUploader({ value, onChange, label, placeholder = '사진을 업로드해주세요', className, aspectRatio = '16/9', uploadFolder = 'uploads', ...props }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);

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
                alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
                // Revert to original value on failure
                setPreviewUrl(value);
                onChange(value);
            } finally {
                setIsUploading(false);
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
    const isAutoRatio = props.ratio === 'auto';

    return (
        <div className={styles.wrapper}>
            <div className={clsx(styles.container, className)} style={cssVars}>
                {label && <BuilderLabel>{label}</BuilderLabel>}

                <div
                    className={clsx(styles.uploader, displayUrl && styles.hasImage)}
                    onClick={() => !displayUrl && inputRef.current?.click()}
                >
                    <div className={clsx(styles.previewArea, isAutoRatio && styles.autoRatio)}>
                        {displayUrl ? (
                            <>
                                {isAutoRatio ? (
                                    <Image
                                        src={displayUrl}
                                        alt="Uploaded"
                                        width={800}
                                        height={600}
                                        className={clsx(styles.image, isUploading && styles.optimisticImage)}
                                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                        unoptimized={displayUrl.startsWith('blob:')}
                                    />
                                ) : (
                                    <Image
                                        src={displayUrl}
                                        alt="Uploaded"
                                        fill
                                        className={clsx(styles.image, isUploading && styles.optimisticImage)}
                                        style={{ objectFit: 'cover' }}
                                        // Blob URLs need unoptimized
                                        unoptimized={displayUrl.startsWith('blob:')}
                                    />
                                )}
                                {isUploading && (
                                    <div className={styles.loadingOverlay}>
                                        <div className={styles.spinner} />
                                    </div>
                                )}
                                <button
                                    onClick={handleRemove}
                                    className={styles.removeButton}
                                    title="사진 삭제"
                                    disabled={isUploading}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                <div className={styles.iconWrapper}>
                                    <UploadCloud size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <div className={styles.text}>
                                        {placeholder}
                                    </div>
                                    <div className={styles.subText}>
                                        클릭하여 이미지를 선택하세요
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className={styles.hiddenInput} // Force hidden via SCSS
                    />
                </div>
            </div>

            {value && props.ratio && props.onRatioChange && (
                <div className={styles.ratioControl}>
                    <BuilderButtonGroup
                        value={props.ratio}
                        options={[
                            { label: '고정 (기본)', value: 'fixed' },
                            { label: '자동 (원본 비율)', value: 'auto' },
                        ]}
                        onChange={props.onRatioChange}
                    />
                </div>
            )}
        </div>
    );
}
