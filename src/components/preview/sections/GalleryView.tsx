import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GalleryView() {
    const { gallery, galleryType } = useInvitationStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!gallery || gallery.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % gallery.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Render different gallery types
    const renderGallery = () => {
        switch (galleryType) {
            case 'swipe':
                return (
                    <div className="relative w-full max-w-2xl mx-auto">
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                            <Image
                                src={gallery[currentIndex] || ''}
                                alt={`Gallery ${currentIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>

                        {/* Navigation buttons */}
                        {gallery.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* Dots indicator */}
                                <div className="flex justify-center mt-6 space-x-1.5">
                                    {gallery.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-forest-green w-4 opacity-100' : 'bg-forest-green/20'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'thumbnail':
                return (
                    <div className="w-full max-w-4xl mx-auto">
                        {/* Main image */}
                        <div className="aspect-[16/10] relative rounded-2xl overflow-hidden mb-4 shadow-sm">
                            <Image
                                src={gallery[currentIndex] || ''}
                                alt={`Gallery ${currentIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>

                        {/* Thumbnail strip */}
                        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                            {gallery.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`flex-shrink-0 w-14 h-14 relative rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex ? 'ring-2 ring-forest-green ring-offset-2 opacity-100' : 'opacity-40 grayscale-[50%]'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'grid':
            default:
                return (
                    <div className="grid grid-cols-2 gap-2">
                        {gallery.map((img, i) => (
                            <div key={i} className={`relative rounded-lg overflow-hidden ${i % 3 === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
                                <Image
                                    src={img}
                                    alt={`Gallery ${i + 1}`}
                                    fill
                                    className="object-cover transition-transform hover:scale-105 duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="py-24 px-6">
            <div className="text-center space-y-4 mb-10">
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] tracking-[0.4em] text-forest-green/40 font-medium uppercase">Wedding Gallery</span>
                    <div className="w-8 h-[1px] bg-forest-green opacity-10"></div>
                </div>
            </div>
            {renderGallery()}
        </div>
    );
}
