import React, { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Trash2, UploadCloud } from 'lucide-react';
import styles from './ImageUploader.module.scss';
import { clsx } from 'clsx';
import { BuilderLabel } from './BuilderLabel';
import { useInvitationStore } from '@/store/useInvitationStore';

interface ImageUploaderProps {
    value: string | null;
    onChange: (value: string | null) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function ImageUploader({ value, onChange, label, placeholder = '사진을 업로드해주세요', className }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const cssVars = {
        '--accent-color': accentColor,
    } as React.CSSProperties;

    return (
        <div className={clsx(styles.container, className)} style={cssVars}>
            {label && <BuilderLabel>{label}</BuilderLabel>}

            <div
                className={clsx(styles.uploader, value && styles.hasImage)}
                onClick={() => !value && inputRef.current?.click()}
            >
                <div className={styles.previewArea}>
                    {value ? (
                        <>
                            <Image
                                src={value}
                                alt="Uploaded"
                                fill
                                className={styles.image}
                            />
                            <button
                                onClick={handleRemove}
                                className={styles.removeButton}
                                title="사진 삭제"
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
                                <div className={styles.text}>{placeholder}</div>
                                <div className={styles.subText}>클릭하여 이미지를 선택하세요</div>
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
    );
}
