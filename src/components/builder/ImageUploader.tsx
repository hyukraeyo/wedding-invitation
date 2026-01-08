import React, { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
    value: string | null;
    onChange: (value: string | null) => void;
    label?: string; // e.g. "사진"
    placeholder?: string; // e.g. "사진 추가"
    className?: string; // wrapper style
}

export function ImageUploader({ value, onChange, label, placeholder = '사진 추가', className }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onChange(url);
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

    return (
        <div className={`space-y-3 ${className}`}>
            {label && <label className="block text-sm font-bold text-gray-800">{label}</label>}

            <div
                className={`
                    relative group w-32 h-32 
                    ${!value ? 'cursor-pointer' : ''}
                `}
                onClick={() => !value && inputRef.current?.click()}
            >
                <div
                    className={`
                        w-full h-full rounded-[24px] overflow-hidden relative
                        transition-all duration-300
                        ${value
                            ? 'shadow-lg ring-1 ring-black/5'
                            : 'border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                        }
                    `}
                >
                    {value ? (
                        <>
                            <Image src={value} alt="Uploaded" fill className="object-cover" />
                            <button
                                onClick={handleRemove}
                                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all shadow-sm backdrop-blur-sm z-10"
                            >
                                <X size={14} strokeWidth={2.5} />
                            </button>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-1">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
                                <ImageIcon size={16} className="text-gray-400" />
                            </div>
                            <span className="text-[11px] font-medium opacity-70">{placeholder}</span>
                        </div>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                />
            </div>
        </div>
    );
}
