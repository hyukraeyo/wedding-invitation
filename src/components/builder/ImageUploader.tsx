import React, { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { Label } from './FormPrimitives';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SegmentedControl } from './SegmentedControl';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/icon-button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { isBlobUrl } from '@/lib/image';
import { IMAGE_SIZES } from '@/constants/image';

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
}

export function ImageUploader({ value, onChange, label, placeholder = '사진을 업로드해주세요', className, aspectRatio = '16/9', uploadFolder = 'uploads', ...props }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const accentColor = useInvitationStore(state => state.theme.accentColor);
    const { toast } = useToast();

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

    // Calculate aspect ratio class or style
    // Tailwind aspect-ratio plugin usually needed or arbitrary values.
    // We can use arbitrary values like aspect-[16/9] if supported or style.
    // For now we use style for dynamic ratio compatibility or standard classes if mapped.

    return (
        <div className="flex flex-col gap-2">
            <div className={cn("w-full", className)} style={cssVars}>
                {label && <Label className="mb-2 block">{label}</Label>}

                <div
                    className={cn(
                        "group relative w-full border-2 border-dashed rounded-lg flex items-center justify-center transition-colors overflow-hidden bg-background",
                        !displayUrl && "hover:bg-muted/50 cursor-pointer border-muted-foreground/25",
                        displayUrl && "border-transparent",
                        !displayUrl && "min-h-[200px]"
                    )}
                    onClick={() => !displayUrl && inputRef.current?.click()}
                    style={!isAutoRatio ? { aspectRatio: aspectRatio.replace('/', '/') } : {}}
                >
                    {displayUrl ? (
                        <div className={cn("relative w-full h-full", isAutoRatio ? "min-h-[200px]" : "absolute inset-0")}>
                            {!isAutoRatio ? (
                                <AspectRatio ratio={aspectRatio.split('/').map(Number).reduce((a, b) => a / b)}>
                                    <Image
                                        src={displayUrl}
                                        alt="Uploaded"
                                        fill
                                        className={cn(
                                            "object-cover transition-opacity duration-300",
                                            isUploading && "opacity-50"
                                        )}
                                        sizes={IMAGE_SIZES.builder}
                                        unoptimized={shouldUnoptimize}
                                    />
                                </AspectRatio>
                            ) : (
                                <Image
                                    src={displayUrl}
                                    alt="Uploaded"
                                    width={800}
                                    height={600}
                                    className={cn(
                                        "object-cover transition-opacity duration-300 w-full h-auto",
                                        isUploading && "opacity-50"
                                    )}
                                    sizes={IMAGE_SIZES.builder}
                                    unoptimized={shouldUnoptimize}
                                />
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                            <IconButton
                                type="button"
                                onClick={handleRemove}
                                variant="destructive"
                                size="sm"
                                icon={Trash2}
                                className="absolute top-2 right-2 transition-opacity z-20 w-8 h-8 rounded-full shadow-sm"
                                disabled={isUploading}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <UploadCloud size={24} className="text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium mb-1">{placeholder}</p>
                            <p className="text-xs text-muted-foreground/75">클릭하여 이미지를 선택하세요</p>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {value && props.ratio && props.onRatioChange && (
                <div className="mt-2">
                    <SegmentedControl
                        value={props.ratio}
                        options={[
                            { label: '고정 (기본)', value: 'fixed' },
                            { label: '자동 (원본 비율)', value: 'auto' },
                        ]}
                        onChange={props.onRatioChange}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}
