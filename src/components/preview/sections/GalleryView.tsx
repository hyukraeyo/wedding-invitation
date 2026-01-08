import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay, FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import type { Swiper as SwiperClass } from 'swiper';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GalleryView() {
    const { gallery, galleryTitle, galleryType, galleryPreview, galleryFade, galleryAutoplay, galleryPopup, theme } = useInvitationStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [popupIndex, setPopupIndex] = useState<number | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent scrolling when popup is open
    React.useEffect(() => {
        if (popupIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [popupIndex]);

    if (!gallery || gallery.length === 0) return null;
    if (!isMounted) return null;

    const handleImageClick = (index: number) => {
        if (galleryPopup) {
            setPopupIndex(index);
        }
    };

    // Render different gallery types
    const renderGallery = () => {
        switch (galleryType) {
            case 'swiper':
                return (
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="relative group">
                            <Swiper
                                key={`${gallery.length}-${galleryType}-${galleryPreview}-${galleryFade}`}
                                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                                observer={true}
                                observeParents={true}
                                spaceBetween={galleryPreview ? 20 : 30}
                                slidesPerView={galleryPreview ? 1.2 : 1}
                                centeredSlides={galleryPreview}
                                navigation={{
                                    nextEl: '.swiper-button-next-custom',
                                    prevEl: '.swiper-button-prev-custom',
                                }}
                                effect={galleryFade ? "fade" : "slide"}
                                {...(galleryFade && { fadeEffect: { crossFade: true } })}
                                autoplay={galleryAutoplay ? {
                                    delay: 3000,
                                    disableOnInteraction: false,
                                } : false}
                                loop={gallery.length > 1}
                                grabCursor={true}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                                className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden bg-gray-50 shadow-sm"
                                style={{ width: '100%', aspectRatio: '4/3' }}
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={`${index}-${img}`} className="h-full">
                                        <div
                                            className={`relative w-full h-full ${galleryPopup ? 'cursor-zoom-in' : ''}`}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Gallery ${index + 1}`}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}

                                {/* Custom Navigation (Desktop Only) */}
                                {gallery.length > 1 && (
                                    <>
                                        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all z-30 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all z-30 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center">
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Fraction Indicator (Modern & Sleek for Mobile) */}
                                {gallery.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full z-40 text-[11px] font-medium tracking-tight pointer-events-none">
                                        <span>{currentIndex + 1}</span>
                                        <span className="mx-1 opacity-50">/</span>
                                        <span className="opacity-70">{gallery.length}</span>
                                    </div>
                                )}
                            </Swiper>

                            <style>
                                {`
                            .swiper-button-disabled {
                                opacity: 0 !important;
                                pointer-events: none;
                            }
                            `}
                            </style>
                        </div>
                    </div>
                );

            case 'thumbnail':
                return (
                    <div className="w-full max-w-4xl mx-auto">
                        {/* Main Swiper */}
                        <div className="relative group mb-4">
                            <Swiper
                                spaceBetween={10}
                                navigation={{
                                    nextEl: '.thumb-next',
                                    prevEl: '.thumb-prev',
                                }}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                                className={`w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm ${galleryPopup ? 'cursor-zoom-in' : ''}`}
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={index} onClick={() => handleImageClick(index)}>
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={`Gallery ${index + 1}`}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Desktop Nav */}
                            <button className="thumb-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="thumb-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Thumbnail Swiper */}
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={8}
                            slidesPerView={5.5}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="thumbs-swiper !py-2 !px-1"
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={index} className="cursor-pointer">
                                    <div
                                        className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex ? 'ring-2 ring-offset-2 opacity-100 scale-[0.98]' : 'opacity-40 grayscale-[30%]'}`}
                                        style={index === currentIndex ? { '--tw-ring-color': theme.accentColor } as React.CSSProperties : {}}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                );

            case 'grid':
            default:
                return (
                    <div className="grid grid-cols-2 gap-2">
                        {gallery.map((img, i) => (
                            <div
                                key={i}
                                className={`relative rounded-lg overflow-hidden ${i % 3 === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'} ${galleryPopup ? 'cursor-zoom-in' : ''}`}
                                onClick={() => handleImageClick(i)}
                            >
                                <Image
                                    src={img}
                                    alt={`Gallery ${i + 1}`}
                                    fill
                                    unoptimized
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
        <div className="">
            <div className="text-center mb-10">
                <div className="flex flex-col items-center space-y-3">
                    <span
                        className="tracking-[0.4em] font-medium uppercase"
                        style={{ fontSize: 'calc(10px * var(--font-scale))', color: theme.accentColor, opacity: 0.4 }}
                    >GALLERY</span>
                    <h2
                        className="font-serif text-gray-900 font-medium"
                        style={{ fontSize: 'calc(20px * var(--font-scale))' }}
                    >
                        {galleryTitle}
                    </h2>
                    <div className="w-8 h-[1px]" style={{ backgroundColor: theme.accentColor, opacity: 0.3 }}></div>
                </div>
            </div>

            {renderGallery()}

            {/* Popup Viewer */}
            {popupIndex !== null && (
                <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-0 m-0 animate-in fade-in duration-300">
                    <button
                        onClick={() => setPopupIndex(null)}
                        className="absolute top-6 right-6 z-[10001] text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-full h-full py-12 md:py-20">
                        <Swiper
                            initialSlide={popupIndex}
                            modules={[Navigation, Pagination, EffectFade]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation={{
                                nextEl: '.popup-next',
                                prevEl: '.popup-prev',
                            }}
                            pagination={{
                                type: 'fraction',
                                el: '.popup-pagination',
                            }}
                            className="w-full h-full"
                        >
                            {gallery.map((img, i) => (
                                <SwiperSlide key={`popup-${i}`} className="flex items-center justify-center">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={`Gallery Large ${i + 1}`}
                                                fill
                                                unoptimized
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}

                            {/* Popup Navigation */}
                            <button className="popup-prev absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all z-[10001] hidden md:block">
                                <ChevronLeft size={48} strokeWidth={1} />
                            </button>
                            <button className="popup-next absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all z-[10001] hidden md:block">
                                <ChevronRight size={48} strokeWidth={1} />
                            </button>

                            {/* Popup Fraction */}
                            <div className="popup-pagination absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-light tracking-widest text-sm z-[10001]"></div>
                        </Swiper>
                    </div>

                    <style>
                        {`
                        .popup-pagination.swiper-pagination-fraction {
                            bottom: 40px !important;
                        }
                        .popup-pagination .swiper-pagination-current {
                            font-weight: 500;
                            color: white;
                        }
                        .popup-pagination .swiper-pagination-total {
                            opacity: 0.5;
                        }
                        `}
                    </style>
                </div>
            )}
        </div>
    );
}

