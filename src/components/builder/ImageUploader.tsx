import React, { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { Label } from './Label';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SegmentedControl } from './SegmentedControl';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
                            <Image
                                src={displayUrl}
                                alt="Uploaded"
                                {...(isAutoRatio ? { width: 800, height: 600 } : { fill: true })}
                                className={cn(
                                    "object-cover transition-opacity duration-300",
                                    isAutoRatio && "w-full h-auto",
                                    isUploading && "opacity-50"
                                )}
                                unoptimized={displayUrl.startsWith('blob:')}
                            />
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                            <Button
                                type="button"
                                onClick={handleRemove}
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                disabled={isUploading}
                            >
                                <Trash2 size={16} />
                            </Button>
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
                        size="sm"
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}
