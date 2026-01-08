import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GalleryView() {
    const { gallery, galleryType, galleryPreview, galleryFade, theme } = useInvitationStore();
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
            case 'swiper':
                return (
                    <div className="w-full max-w-2xl mx-auto">
                        <Swiper
                            modules={[Navigation, Pagination, EffectFade, Autoplay]}
                            spaceBetween={galleryPreview ? 20 : 30}
                            slidesPerView={galleryPreview ? 1.2 : 1}
                            centeredSlides={galleryPreview}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            pagination={{
                                el: '.swiper-pagination-custom',
                                clickable: true,
                            }}
                            effect={galleryFade ? "fade" : "slide"}
                            {...(galleryFade && { fadeEffect: { crossFade: true } })}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            loop={gallery.length > 1}
                            grabCursor={true}
                            className="aspect-[4/3] relative rounded-lg overflow-hidden"
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={img}
                                            alt={`Gallery ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}

                            {/* Custom Navigation */}
                            {gallery.length > 1 && (
                                <>
                                    <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10">
                                        <ChevronRight size={20} />
                                    </button>

                                    {/* Custom Pagination */}
                                    <div className="swiper-pagination-custom absolute bottom-6 left-1/2 -translate-x-1/2 z-20"></div>
                                </>
                            )}
                        </Swiper>
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
                                    className={`flex-shrink-0 w-14 h-14 relative rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex ? 'ring-2 ring-offset-2 opacity-100' : 'opacity-40 grayscale-[50%]'}`}
                                    style={index === currentIndex ? { '--tw-ring-color': theme.accentColor } as React.CSSProperties : {}}
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
        <div className="py-16 px-6">
            <div className="text-center space-y-4 mb-10">
                <div className="flex flex-col items-center space-y-2">
                    <span
                        className="tracking-[0.4em] font-medium uppercase"
                        style={{ fontSize: 'calc(10px * var(--font-scale))', color: theme.accentColor, opacity: 0.4 }}
                    >Wedding Gallery</span>
                    <div className="w-8 h-[1px]" style={{ backgroundColor: theme.accentColor, opacity: 0.1 }}></div>
                </div>
            </div>
            {renderGallery()}
        </div>
    );
}
